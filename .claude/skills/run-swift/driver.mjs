#!/usr/bin/env node
// Driver for the "swift" preview app - agent-facing CLI to launch, drive,
// and screenshot preview/*.html without hand-rolling CDP boilerplate again.
//
// This is the generalized form of scripts written ad hoc throughout dev
// sessions (screenshot a modal state, eval a computed style, check a
// selector count). scripts/smoke-test.mjs is the fixed assertion suite;
// this driver is for arbitrary one-off exploration.
//
// Zero dependencies: Node >= 22 (native WebSocket) + system Chrome headless
// CDP + python3 http.server. Verified on macOS (Darwin); CHROME_BIN env var
// overrides the binary path for other platforms (untested here).
//
// Usage:
//   node driver.mjs shot <page.html> [--out path.png] [--viewport 1440x900]
//                        [--click "css selector"] [--wait "js expr"]
//   node driver.mjs eval <page.html> "<js expression>"
//   node driver.mjs serve [port]     # persistent server for manual browsing
//   node driver.mjs smoke            # delegate to scripts/smoke-test.mjs
//
// Paths are relative to the repo root (this file's grandparent's parent),
// not to this skill directory.

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const PREVIEW_DIR = join(ROOT, "preview");
const CHROME =
  process.env.CHROME_BIN ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

async function waitHttp(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return;
    } catch {
      /* server not up yet */
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("http server did not start: " + url);
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.seq = 0;
    this.pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== undefined && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }
  send(method, params, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++this.seq;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {}, sessionId }));
    });
  }
}

async function launchChrome(userDataDir) {
  const proc = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=0",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--user-data-dir=" + userDataDir,
    "about:blank",
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(
      () => reject(new Error("chrome devtools endpoint timeout")),
      15000,
    );
    proc.stderr.on("data", (chunk) => {
      buf += chunk.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
    proc.on("exit", (code) => reject(new Error("chrome exited early: " + code)));
  });
  return { proc, wsUrl };
}

function parseArgs(rest) {
  const opts = { viewport: "1440x900" };
  const positional = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--out") opts.out = rest[++i];
    else if (a === "--viewport") opts.viewport = rest[++i];
    else if (a === "--click") opts.click = rest[++i];
    else if (a === "--wait") opts.wait = rest[++i];
    else positional.push(a);
  }
  return { opts, positional };
}

// Shared session bring-up: ephemeral http server + headless chrome + CDP
// session + navigate + wait for [data-partial] hydration to finish.
async function withPage(page, viewport, fn) {
  const port = await freePort();
  const server = spawn("python3", [
    "-m", "http.server", String(port),
    "--directory", PREVIEW_DIR,
    "--bind", "127.0.0.1",
  ]);
  const udd = mkdtempSync(join(tmpdir(), "swift-driver-"));
  let chrome = null;
  try {
    const baseUrl = "http://127.0.0.1:" + port;
    await waitHttp(baseUrl + "/" + page, 8000);
    const launched = await launchChrome(udd);
    chrome = launched.proc;
    const ws = await new Promise((resolve, reject) => {
      const w = new WebSocket(launched.wsUrl);
      w.addEventListener("open", () => resolve(w));
      w.addEventListener("error", (e) => reject(new Error("ws error: " + e.message)));
    });
    const cdp = new CDP(ws);
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    const [w, h] = viewport.split("x").map(Number);
    await cdp.send(
      "Emulation.setDeviceMetricsOverride",
      { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 },
      sessionId,
    );
    await cdp.send("Page.navigate", { url: baseUrl + "/" + page }, sessionId);

    async function evl(expr) {
      const r = await cdp.send(
        "Runtime.evaluate",
        { expression: expr, returnByValue: true, awaitPromise: true },
        sessionId,
      );
      if (r.exceptionDetails) {
        const d = r.exceptionDetails;
        throw new Error("evaluate threw: " + ((d.exception && d.exception.description) || d.text));
      }
      return r.result.value;
    }
    // Wait for partials (aside/topbar/etc.) to finish hydrating - every page
    // in this project loads shared markup async via js/partials.js.
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      if (await evl('!document.querySelector("[data-partial]")')) break;
      await new Promise((r) => setTimeout(r, 200));
    }

    const result = await fn({ cdp, sessionId, evl });
    ws.close();
    return result;
  } finally {
    if (chrome) {
      const exited = new Promise((r) => chrome.on("exit", r));
      chrome.kill();
      await exited;
    }
    server.kill();
    rmSync(udd, { recursive: true, force: true, maxRetries: 3 });
  }
}

async function cmdShot(rest) {
  const { opts, positional } = parseArgs(rest);
  const page = positional[0];
  if (!page) throw new Error("usage: node driver.mjs shot <page.html> [--out path.png] [--viewport 1440x900] [--click sel] [--wait expr]");
  const out = opts.out || join(dirname(fileURLToPath(import.meta.url)), "shot.png");
  await withPage(page, opts.viewport, async ({ cdp, sessionId, evl }) => {
    if (opts.wait) {
      const deadline = Date.now() + 10000;
      while (Date.now() < deadline) {
        if (await evl("!!(" + opts.wait + ")")) break;
        await new Promise((r) => setTimeout(r, 150));
      }
    }
    if (opts.click) {
      const sel = JSON.stringify(opts.click);
      await evl(
        `(function(){var el=document.querySelector(${sel});if(!el)throw new Error("click target not found: "+${sel});el.click();return true;})()`,
      );
      await new Promise((r) => setTimeout(r, 300));
    }
    const res = await cdp.send("Page.captureScreenshot", { format: "png" }, sessionId);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, Buffer.from(res.data, "base64"));
    console.log("saved " + out);
  });
}

async function cmdEval(rest) {
  const { opts, positional } = parseArgs(rest);
  const [page, expr] = positional;
  if (!page || !expr) throw new Error('usage: node driver.mjs eval <page.html> "<js expression>" [--wait "js expr"]');
  await withPage(page, "1440x900", async ({ evl }) => {
    // withPage only waits for partials (aside/topbar/etc.) to hydrate.
    // Page-specific behaviors (e.g. room-booking's calendar render) init
    // afterward via module imports - pass --wait for a page-specific
    // readiness condition or eval will race ahead of it (see Gotchas).
    if (opts.wait) {
      const deadline = Date.now() + 10000;
      while (Date.now() < deadline) {
        if (await evl("!!(" + opts.wait + ")")) break;
        await new Promise((r) => setTimeout(r, 150));
      }
    }
    const value = await evl(expr);
    console.log(JSON.stringify(value, null, 2));
  });
}

function cmdServe(rest) {
  const port = rest[0] || "8000";
  console.log("serving " + PREVIEW_DIR + " at http://localhost:" + port + " (Ctrl-C to stop)");
  const server = spawn("python3", ["-m", "http.server", port, "--directory", PREVIEW_DIR], {
    stdio: "inherit",
  });
  process.on("SIGINT", () => server.kill());
}

function cmdSmoke() {
  const r = spawnSync("node", [join(ROOT, "scripts", "smoke-test.mjs")], { stdio: "inherit" });
  process.exit(r.status ?? 1);
}

const [, , cmd, ...rest] = process.argv;
try {
  if (cmd === "shot") await cmdShot(rest);
  else if (cmd === "eval") await cmdEval(rest);
  else if (cmd === "serve") cmdServe(rest);
  else if (cmd === "smoke") cmdSmoke();
  else {
    console.error("usage: node driver.mjs <shot|eval|serve|smoke> ...");
    process.exit(1);
  }
} catch (err) {
  console.error("driver error: " + err.message);
  process.exit(1);
}
