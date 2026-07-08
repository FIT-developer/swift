#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;
const STEP_NAMES = [
  "round-1-codex",
  "round-1-claude",
  "round-2-codex-review",
  "round-2-claude-review",
  "consensus",
];

function usage() {
  console.log(`Usage:
  node scripts/agent-council.mjs run <specs/agent-council/{topic}/brief.md> [options]
  node scripts/agent-council.mjs smoke [--agent both|codex|claude]

Options:
  --dry-run                 Print planned steps without calling CLIs or writing outputs
  --force                   Overwrite existing round/review/consensus files
  --only <step>             Run one step: ${STEP_NAMES.join(", ")}
  --synthesizer <agent>     consensus author: codex or claude (default: codex)
  --agent <agent>           smoke target: both, codex, or claude (default: both)
  --timeout-ms <number>     Per-CLI timeout (default: ${DEFAULT_TIMEOUT_MS})

Notes:
  - Existing files are preserved by default, so the command is resumable.
  - Nested CLIs return markdown only; this script writes files and author headers.
  - Failed steps write <target>.error.md and keep prior files intact.
`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const opts = {
    command,
    briefPath: null,
    dryRun: false,
    force: false,
    only: null,
    synthesizer: "codex",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    smokeAgent: "both",
  };

  let i = 0;
  if (command === "run") {
    opts.briefPath = rest[i++];
  }

  for (; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--only") opts.only = rest[++i];
    else if (arg === "--synthesizer") opts.synthesizer = rest[++i];
    else if (arg === "--timeout-ms") opts.timeoutMs = Number(rest[++i]);
    else if (arg === "--agent") opts.smokeAgent = rest[++i];
    else throw new Error(`unknown argument: ${arg}`);
  }

  if (!opts.command || opts.command === "--help" || opts.command === "-h") {
    opts.command = "help";
  }
  return opts;
}

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  return readFile(filePath, "utf8");
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, "/");
}

function ensureBriefPath(briefPath) {
  if (!briefPath) throw new Error("missing brief path");
  const abs = path.resolve(ROOT, briefPath);
  const normalized = rel(abs);
  if (!normalized.startsWith("specs/agent-council/") || !normalized.endsWith("/brief.md")) {
    throw new Error("brief must be specs/agent-council/{topic}/brief.md");
  }
  return abs;
}

function stripModelNoise(text) {
  let out = text.trim();
  const fenceMatch = out.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/i);
  if (fenceMatch) out = fenceMatch[1].trim();
  if (out.startsWith("---")) {
    const end = out.indexOf("\n---", 3);
    if (end >= 0) out = out.slice(end + 4).trim();
  }
  return out.trim() + "\n";
}

function header({ author, role, modelFamily, sourceFiles }) {
  const sources = sourceFiles.map((source) => `  - ${source}`).join("\n");
  return `---\nauthor: ${author}\nrole: ${role}\nmodel_family: ${modelFamily}\nsource_files:\n${sources}\n---\n\n`;
}

function wrapOutput(meta, body) {
  return header(meta) + stripModelNoise(body);
}

function sourceBlock(label, content) {
  return `\n\n<source path="${label}">\n${content.trim()}\n</source>\n`;
}

async function runProcess(command, args, stdin, { timeoutMs }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, NO_COLOR: "1" },
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`${command} timed out after ${timeoutMs}ms\n${stderr}`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`${command} exited ${code}\n${stderr}\n${stdout}`));
      } else {
        resolve({ stdout, stderr });
      }
    });

    child.stdin.end(stdin);
  });
}

async function runClaude(prompt, opts) {
  const args = [
    "-p",
    "--output-format",
    "json",
    "--permission-mode",
    "dontAsk",
    "--tools",
    "",
  ];
  const { stdout } = await runProcess("claude", args, prompt, opts);
  try {
    const parsed = JSON.parse(stdout);
    if (typeof parsed.result === "string") return parsed.result;
    if (typeof parsed.message === "string") return parsed.message;
  } catch {
    // Fall through to raw stdout.
  }
  return stdout;
}

async function runCodex(prompt, opts) {
  const outPath = path.join(os.tmpdir(), `agent-council-codex-${Date.now()}-${Math.random().toString(16).slice(2)}.md`);
  const args = [
    "exec",
    "--cd",
    ROOT,
    "--sandbox",
    "read-only",
    "--ephemeral",
    "--output-last-message",
    outPath,
    "-",
  ];
  const { stdout } = await runProcess("codex", args, prompt, opts);
  if (await exists(outPath)) {
    return readText(outPath);
  }
  return stdout;
}

function basePrompt({ task, role, sources, outputGuidance }) {
  const sourceText = sources.map(([label, content]) => sourceBlock(label, content)).join("");
  return `You are participating in a repo-file-mediated Codex/Claude agent council.

Task:
${task}

Role:
${role}

Rules:
- Output markdown body only.
- Do not include YAML frontmatter; the runner adds the author header.
- Do not wrap the answer in a code fence.
- Do not edit files, run commands, or ask for user input.
- Base the answer only on the included source files.
- Keep consensus as DRAFT - pending user decision.
- Mark concrete candidates with source attribution when asked.

${outputGuidance}

Included source files:${sourceText}
`;
}

function roundOnePrompt(agentName, briefPath, brief) {
  return basePrompt({
    task: `Produce ${agentName} round-1 independent analysis for this council brief.`,
    role: "round-1 independent analysis",
    sources: [[briefPath, brief]],
    outputGuidance: `Recommended sections:
# Round 1 - ${agentName} independent analysis

## Position
## Facts
## Assessment
## Recommendation
## Needs User Decision`,
  });
}

function reviewPrompt(agentName, briefPath, brief, peerPath, peer, ownPath, own) {
  return basePrompt({
    task: `Review the peer round-1 analysis and produce ${agentName} round-2 review.`,
    role: "round-2 critique + counterproposal",
    sources: [
      [briefPath, brief],
      [peerPath, peer],
      [ownPath, own],
    ],
    outputGuidance: `Recommended sections:
# Round 2 - ${agentName} review

## Agreement
## Critique
## Counterproposal
## Recommended User Question`,
  });
}

function consensusPrompt(agentName, sources) {
  return basePrompt({
    task: `Synthesize the council into consensus.md as ${agentName}.`,
    role: "synthesizer draft",
    sources,
    outputGuidance: `Required structure:
# Consensus (DRAFT - pending user decision)

## Decision Candidates
Each candidate must include one source label: source: Codex, source: Claude, source: Both, or source: Synthesizer synthesis.

## Why
## Agreement
## Disagreement
## Risks
## Action Plan
## Needs User Decision`,
  });
}

async function callAgent(agent, prompt, opts) {
  if (agent === "codex") return runCodex(prompt, opts);
  if (agent === "claude") return runClaude(prompt, opts);
  throw new Error(`unknown agent: ${agent}`);
}

function stepMeta(stepName, targetPath, topicDir) {
  const topicRel = rel(topicDir);
  const source = (name) => `${topicRel}/${name}`;
  const map = {
    "round-1-codex": {
      agent: "codex",
      target: "round-1-codex.md",
      meta: {
        author: "Codex CLI",
        role: "round-1 independent analysis",
        modelFamily: "GPT",
        sourceFiles: [source("brief.md")],
      },
    },
    "round-1-claude": {
      agent: "claude",
      target: "round-1-claude.md",
      meta: {
        author: "Claude CLI",
        role: "round-1 independent analysis",
        modelFamily: "Claude",
        sourceFiles: [source("brief.md")],
      },
    },
    "round-2-codex-review": {
      agent: "codex",
      target: "round-2-codex-review.md",
      meta: {
        author: "Codex CLI",
        role: "round-2 review of Claude round-1",
        modelFamily: "GPT",
        sourceFiles: [source("brief.md"), source("round-1-claude.md"), source("round-1-codex.md")],
      },
    },
    "round-2-claude-review": {
      agent: "claude",
      target: "round-2-claude-review.md",
      meta: {
        author: "Claude CLI",
        role: "round-2 review of Codex round-1",
        modelFamily: "Claude",
        sourceFiles: [source("brief.md"), source("round-1-codex.md"), source("round-1-claude.md")],
      },
    },
    consensus: {
      agent: targetPath === "claude" ? "claude" : "codex",
      target: "consensus.md",
      meta: {
        author: targetPath === "claude" ? "Claude CLI" : "Codex CLI",
        role: "synthesizer draft",
        modelFamily: targetPath === "claude" ? "Claude" : "GPT",
        sourceFiles: [
          source("round-1-codex.md"),
          source("round-1-claude.md"),
          source("round-2-codex-review.md"),
          source("round-2-claude-review.md"),
        ],
      },
    },
  };
  const step = map[stepName];
  if (!step) throw new Error(`unknown step: ${stepName}`);
  return step;
}

async function buildPrompt(stepName, briefPath, topicDir, synthesizer) {
  const topicRel = rel(topicDir);
  const readTopic = async (name) => readText(path.join(topicDir, name));
  const brief = await readText(briefPath);
  const briefRel = `${topicRel}/brief.md`;

  if (stepName === "round-1-codex") return roundOnePrompt("Codex", briefRel, brief);
  if (stepName === "round-1-claude") return roundOnePrompt("Claude", briefRel, brief);
  if (stepName === "round-2-codex-review") {
    return reviewPrompt(
      "Codex",
      briefRel,
      brief,
      `${topicRel}/round-1-claude.md`,
      await readTopic("round-1-claude.md"),
      `${topicRel}/round-1-codex.md`,
      await readTopic("round-1-codex.md"),
    );
  }
  if (stepName === "round-2-claude-review") {
    return reviewPrompt(
      "Claude",
      briefRel,
      brief,
      `${topicRel}/round-1-codex.md`,
      await readTopic("round-1-codex.md"),
      `${topicRel}/round-1-claude.md`,
      await readTopic("round-1-claude.md"),
    );
  }
  if (stepName === "consensus") {
    return consensusPrompt(synthesizer === "claude" ? "Claude" : "Codex", [
      [briefRel, brief],
      [`${topicRel}/round-1-codex.md`, await readTopic("round-1-codex.md")],
      [`${topicRel}/round-1-claude.md`, await readTopic("round-1-claude.md")],
      [`${topicRel}/round-2-codex-review.md`, await readTopic("round-2-codex-review.md")],
      [`${topicRel}/round-2-claude-review.md`, await readTopic("round-2-claude-review.md")],
    ]);
  }
  throw new Error(`unknown step: ${stepName}`);
}

async function writeError(target, err) {
  const errorPath = `${target}.error.md`;
  const content = `# Agent Council Step Failed\n\nTarget: ${rel(target)}\n\nError:\n\n\`\`\`text\n${String(err.stack || err.message || err)}\n\`\`\`\n`;
  await writeFile(errorPath, content, "utf8");
  console.error(`failed: ${rel(target)} (details: ${rel(errorPath)})`);
}

async function runStep(stepName, briefPath, topicDir, opts) {
  const step = stepMeta(stepName, opts.synthesizer, topicDir);
  const target = path.join(topicDir, step.target);
  if (!opts.force && await exists(target)) {
    console.log(`skip existing ${rel(target)}`);
    return;
  }

  console.log(`run ${stepName} -> ${rel(target)} via ${step.agent}`);
  if (opts.dryRun) return;

  await mkdir(topicDir, { recursive: true });
  const prompt = await buildPrompt(stepName, briefPath, topicDir, opts.synthesizer);
  try {
    const body = await callAgent(step.agent, prompt, opts);
    await writeFile(target, wrapOutput(step.meta, body), "utf8");
  } catch (err) {
    await writeError(target, err);
    throw err;
  }
}

async function runCouncil(opts) {
  if (opts.only && !STEP_NAMES.includes(opts.only)) {
    throw new Error(`--only must be one of: ${STEP_NAMES.join(", ")}`);
  }
  if (!["codex", "claude"].includes(opts.synthesizer)) {
    throw new Error("--synthesizer must be codex or claude");
  }
  const briefPath = ensureBriefPath(opts.briefPath);
  const topicDir = path.dirname(briefPath);
  if (!await exists(briefPath)) throw new Error(`brief not found: ${rel(briefPath)}`);

  const steps = opts.only ? [opts.only] : STEP_NAMES;
  for (const stepName of steps) {
    await runStep(stepName, briefPath, topicDir, opts);
  }
}

async function smoke(opts) {
  const prompt = "Reply with exactly: AGENT_COUNCIL_SMOKE_OK";
  const agents = opts.smokeAgent === "both" ? ["claude", "codex"] : [opts.smokeAgent];
  for (const agent of agents) {
    if (!["claude", "codex"].includes(agent)) throw new Error("--agent must be both, claude, or codex");
    console.log(`smoke ${agent}`);
    const result = stripModelNoise(await callAgent(agent, prompt, opts)).trim();
    if (!result.includes("AGENT_COUNCIL_SMOKE_OK")) {
      throw new Error(`${agent} smoke returned unexpected output: ${result}`);
    }
    console.log(`ok ${agent}`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.command === "help") {
    usage();
    return;
  }
  if (!Number.isFinite(opts.timeoutMs) || opts.timeoutMs <= 0) {
    throw new Error("--timeout-ms must be a positive number");
  }
  if (opts.command === "run") await runCouncil(opts);
  else if (opts.command === "smoke") await smoke(opts);
  else {
    usage();
    throw new Error(`unknown command: ${opts.command}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
