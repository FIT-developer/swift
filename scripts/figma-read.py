#!/usr/bin/env python3
"""Read-only helper for figma-mcp-go tool results saved to disk.

get_selection / get_screenshot output gets written to a tool-results *.txt
file whenever it exceeds the inline token limit. This script replaces the
one-off python3 heredocs used to inspect those files, so repeated figma-go
reads can call a single fixed command instead of writing new ad-hoc code
each time.

Subcommands:
  tree       <selection.txt> [--id NODE_ID] [--depth N]
  texts      <selection.txt> [--id NODE_ID]
  node       <selection.txt> <NODE_ID> [--depth N]
  screenshot <screenshot.txt> <output.png> [--index N]
  crop       <image.png> <x> <y> <w> <h> <output.png> [--zoom N]
  pixel      <image.png> <x,y> [<x,y> ...]
"""
import argparse
import base64
import json
import sys


def load_selection(path):
    with open(path) as f:
        return json.load(f)


def find_by_id(node, target_id):
    if node.get("id") == target_id:
        return node
    for c in node.get("children", []):
        r = find_by_id(c, target_id)
        if r:
            return r
    return None


def find_in_roots(roots, target_id):
    for root in roots:
        r = find_by_id(root, target_id)
        if r:
            return r
    return None


def print_tree(node, depth, max_depth):
    indent = "  " * depth
    b = node.get("bounds", {})
    bstr = f"{b.get('width')}x{b.get('height')} @ ({b.get('x')},{b.get('y')})"
    chars = node.get("characters")
    charstr = f" TEXT={chars!r}" if chars is not None else ""
    print(
        f"{indent}[{node.get('type')}] {node.get('name')} | id={node.get('id')} | "
        f"{bstr}{charstr} | children={len(node.get('children', []))}"
    )
    if depth < max_depth:
        for c in node.get("children", []):
            print_tree(c, depth + 1, max_depth)


def collect_texts(node, path_names, out):
    new_path = path_names + [node.get("name")]
    if node.get("type") == "TEXT":
        st = node.get("styles", {})
        out.append(
            {
                "path": " > ".join(new_path),
                "id": node.get("id"),
                "chars": node.get("characters"),
                "fontSize": st.get("fontSize"),
                "fontWeight": st.get("fontWeight"),
                "fill": st.get("fills"),
            }
        )
    for c in node.get("children", []):
        collect_texts(c, new_path, out)


def print_node_detail(node, depth, max_depth):
    indent = "  " * depth
    st = node.get("styles", {})
    chars = node.get("characters")
    extra = []
    if st.get("fills"):
        extra.append(f"fills={st.get('fills')}")
    if st.get("strokes"):
        extra.append(f"strokes={st.get('strokes')}")
    if st.get("cornerRadius") is not None:
        extra.append(f"cornerRadius={st.get('cornerRadius')}")
    if st.get("padding"):
        extra.append(f"padding={st.get('padding')}")
    if chars is not None:
        extra.append(f"TEXT={chars!r}")
    print(f"{indent}[{node.get('type')}] {node.get('name')} id={node.get('id')} {' '.join(extra)}")
    if depth < max_depth:
        for c in node.get("children", []):
            print_node_detail(c, depth + 1, max_depth)


def cmd_tree(args):
    roots = load_selection(args.file)
    for root in roots:
        target = find_by_id(root, args.id) if args.id else root
        if target is not None:
            print_tree(target, 0, args.depth)


def cmd_texts(args):
    roots = load_selection(args.file)
    out = []
    for root in roots:
        target = find_by_id(root, args.id) if args.id else root
        if target is not None:
            collect_texts(target, [], out)
    print(f"total text nodes: {len(out)}")
    for t in out:
        print(f"{t['chars']!r:24s} | fontSize={t['fontSize']} weight={t['fontWeight']} fill={t['fill']} | {t['path']}")


def cmd_node(args):
    roots = load_selection(args.file)
    target = find_in_roots(roots, args.node_id)
    if target is None:
        print(f"node id {args.node_id} not found", file=sys.stderr)
        sys.exit(1)
    print_node_detail(target, 0, args.depth)


def cmd_screenshot(args):
    with open(args.file) as f:
        data = json.load(f)
    exports = data.get("exports", [])
    if not exports:
        print("no exports found in screenshot result", file=sys.stderr)
        sys.exit(1)
    if args.index >= len(exports):
        print(f"index {args.index} out of range (found {len(exports)} exports)", file=sys.stderr)
        sys.exit(1)
    img = base64.b64decode(exports[args.index]["base64"])
    with open(args.output, "wb") as f:
        f.write(img)
    print(f"saved {len(img)} bytes -> {args.output}")


def cmd_crop(args):
    from PIL import Image

    img = Image.open(args.image)
    crop = img.crop((args.x, args.y, args.x + args.w, args.y + args.h))
    if args.zoom != 1:
        crop = crop.resize((crop.width * args.zoom, crop.height * args.zoom), Image.NEAREST)
    crop.save(args.output)
    print(f"saved crop {args.w}x{args.h}@({args.x},{args.y}) zoom={args.zoom} -> {args.output}")


def cmd_pixel(args):
    from PIL import Image

    img = Image.open(args.image)
    for point in args.points:
        x_str, y_str = point.split(",")
        xy = (int(x_str), int(y_str))
        print(f"{xy} -> {img.getpixel(xy)}")


def main():
    parser = argparse.ArgumentParser(description="Read-only helper for figma-mcp-go tool result files.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("tree", help="Print hierarchical node summary")
    p.add_argument("file")
    p.add_argument("--id", default=None, help="Start from this node id instead of the root")
    p.add_argument("--depth", type=int, default=4)
    p.set_defaults(func=cmd_tree)

    p = sub.add_parser("texts", help="Dump all TEXT node contents with path/style info")
    p.add_argument("file")
    p.add_argument("--id", default=None, help="Scope to this node id instead of the whole selection")
    p.set_defaults(func=cmd_texts)

    p = sub.add_parser("node", help="Print full style/structure detail for one node id")
    p.add_argument("file")
    p.add_argument("node_id")
    p.add_argument("--depth", type=int, default=6)
    p.set_defaults(func=cmd_node)

    p = sub.add_parser("screenshot", help="Decode a saved get_screenshot result to a PNG file")
    p.add_argument("file")
    p.add_argument("output")
    p.add_argument("--index", type=int, default=0)
    p.set_defaults(func=cmd_screenshot)

    p = sub.add_parser("crop", help="Crop + zoom a region of a PNG for close visual inspection")
    p.add_argument("image")
    p.add_argument("x", type=int)
    p.add_argument("y", type=int)
    p.add_argument("w", type=int)
    p.add_argument("h", type=int)
    p.add_argument("output")
    p.add_argument("--zoom", type=int, default=1)
    p.set_defaults(func=cmd_crop)

    p = sub.add_parser("pixel", help="Print RGBA value at one or more x,y points")
    p.add_argument("image")
    p.add_argument("points", nargs="+", help="x,y pairs, e.g. 200,765")
    p.set_defaults(func=cmd_pixel)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
