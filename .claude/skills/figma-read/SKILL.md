---
name: figma-read
description: Read a Figma selection/frame/section/component via figma-mcp-go before building or updating a spec (components/*.md, specs/pages/*.md) in the "swift" hotel-dashboard project. Use when the user says "figma-go", asks to read/implement/update from Figma, or references a Figma frame/selection/node.
---

This skill does not replace `start.md` - it points at it. The actual rules
(three-stage checkpoint flow, "JSON is not visual truth" landmines,
selection-coverage discipline, where specs get written) are load-bearing
constraints that live in `start.md` because that file is imported
unconditionally into every session via `CLAUDE.md`'s `@start.md`. This
skill's own auto-load isn't guaranteed the same way, so it doesn't own or
duplicate the rules - it only adds what doesn't already exist elsewhere:
documented, verified usage of `scripts/figma-read.py`, the helper for
inspecting large `figma-mcp-go` outputs.

## Where the actual rules are (read these, don't skip)

- `start.md` "Figma 讀取與寫檔 checkpoint" (search for `figma-go`) - the
  three-stage flow: Read -> Spec checkpoint -> Write+implement. Don't skip
  to stage 3 unless the user explicitly said "figma-go 然後實作" or gave an
  implementation plan.
- `start.md` "Figma MCP「JSON 不等於視覺」限制" - gradient fills/strokes,
  single-side strokes, hidden layers that serialize identically to visible
  ones. `get_node`/`get_selection`/`get_design_context` can all lie; a
  screenshot cross-check is not optional for anything visual.
- `start.md` "讀 Figma 的硬性檢查" - selection-coverage (root children
  checklist, cross-check against spec, force-iterate large/truncated JSON)
  and the "is this Figma-given or am I guessing?" self-check before writing
  anything down as fact.
- `start.md` 檔案地圖 - where confirmed specs get written: `components/{name}.md`
  for a component, `specs/pages/{name}.md` for a page. `sections/`/`layouts/`
  are frozen-reference, never a new-implementation target.

If any of the above conflicts with what this skill says, `start.md` wins -
it's the newer/more-frequently-touched file of the two.

## `scripts/figma-read.py` - inspecting saved tool-result files

`get_selection`/`get_screenshot` results get written to a `tool-results/*.txt`
file on disk whenever they exceed the inline token limit (the exact path is
reported back by the tool call itself, not a fixed location - watch for it
in the tool result). This script replaces one-off `python3` heredocs for
digging through those files. Six subcommands, all verified this session
against synthetic data built to match the real output shape (a JSON array
of root nodes, each with `id`/`name`/`type`/`bounds`/`styles`/`children`,
optionally `characters` for TEXT nodes; screenshot results are
`{"exports": [{"base64": "..."}]}`):

```bash
# Hierarchical summary: type, name, id, bounds, child count, TEXT contents
python3 scripts/figma-read.py tree <selection.txt> [--id NODE_ID] [--depth N]

# Every TEXT node's content + font size/weight/fill, with its path in the tree
python3 scripts/figma-read.py texts <selection.txt> [--id NODE_ID]

# Full style/structure detail (fills, strokes, cornerRadius, padding) for one node
python3 scripts/figma-read.py node <selection.txt> <NODE_ID> [--depth N]

# Decode a saved get_screenshot result to an actual PNG file
python3 scripts/figma-read.py screenshot <screenshot.txt> <output.png> [--index N]

# Crop + zoom a region of a PNG for close visual inspection (e.g. checking
# a single-side stroke or a gradient the JSON can't be trusted on)
python3 scripts/figma-read.py crop <image.png> <x> <y> <w> <h> <output.png> [--zoom N]

# Read the RGBA value at specific x,y points (confirming an exact color
# against a token, or checking whether a "border" is actually painted)
python3 scripts/figma-read.py pixel <image.png> <x,y> [<x,y> ...]
```

`crop`/`pixel` need Pillow (`pip3 install Pillow` - already present in this
environment, verified via `python3 -c "import PIL"`).

## Gotchas (found while verifying this session)

- **`tree`/`node`/`texts` all expect the selection file to be a JSON array
  of root nodes**, not a single root object - `get_selection` on multiple
  selected frames returns a list, and the script's `find_in_roots`/loop
  over `roots` assumes that shape even for a single selection. Verified
  the actual failure if you hand it a bare object instead: `for root in
  roots` iterates the dict's *keys* (each just a string like `"id"`), then
  `print_tree` calls `.get()` on that string and crashes with
  `AttributeError: 'str' object has no attribute 'get'` - not a clean
  error message, just a raw traceback. Wrap a single selection in `[...]`
  if you ever construct a selection file by hand instead of using real
  tool output (real `get_selection` output is already list-shaped, so this
  only bites hand-built test fixtures).
- **`node` exits 1 with a stderr message on an unknown id** (verified:
  `node id 99:99 not found` on a synthetic file that didn't have that id) -
  script errors are structured, not a silent empty result.
- **`screenshot --index` out of range prints the actual export count and
  exits 1**, doesn't silently write a truncated/empty file.
- **These are all read-only.** Nothing here calls back into Figma or the
  MCP server - they only operate on files already saved to disk by a prior
  tool call. If the file doesn't exist yet, that means the corresponding
  `get_selection`/`get_screenshot` call hasn't been made (or was small
  enough to stay inline and never got written to disk) - this script can't
  fetch it for you.
