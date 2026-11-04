#!/usr/bin/env python3
"""Lint the Markdown posts in content/blog against the site's style rules.

Checks front matter, terminology (content/style/terminology.json), image alt text and
paths, internal links, heading structure, sentence length, and meme blocks.

Usage:
    python3 scripts/lint_content.py              # lint every post
    python3 scripts/lint_content.py path/to.md   # lint specific files
    python3 scripts/lint_content.py --strict     # treat warnings as errors (for CI)
    python3 scripts/lint_content.py --external   # also check that external links respond

Exit code is 1 when any error is found (or any warning, with --strict), otherwise 0.
Standard library only, so it runs anywhere Python 3.9+ does.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
PUBLIC_DIR = ROOT / "public"
TERMS_FILE = ROOT / "content" / "style" / "terminology.json"

REQUIRED_FIELDS = ("title", "date", "description", "tags")
MAX_SENTENCE_WORDS = 38
DESCRIPTION_RANGE = (60, 230)
MEME_FORMATS = {"stonks", "nah-yeah", "versus", "dialogue"}
TAG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


@dataclass
class Finding:
    path: Path
    line: int
    level: str  # "error" | "warning"
    rule: str
    message: str

    def __str__(self) -> str:
        rel = self.path.relative_to(ROOT)
        return f"{rel}:{self.line}: {self.level} [{self.rule}] {self.message}"


def parse_front_matter(text: str) -> tuple[dict, int]:
    """Parse the small YAML subset the blog uses. Returns (fields, first body line number)."""
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return {}, 1
    fields: dict = {}
    for index, line in enumerate(lines[1:], start=2):
        if line.strip() == "---":
            return fields, index + 1
        key, _, value = line.partition(":")
        value = value.strip()
        if value.startswith("["):
            try:
                fields[key.strip()] = json.loads(value)
            except json.JSONDecodeError:
                fields[key.strip()] = value
        elif value in ("true", "false"):
            fields[key.strip()] = value == "true"
        else:
            fields[key.strip()] = value.strip('"').strip("'")
    return fields, 1


def fence_marker(line: str) -> str | None:
    """The fence characters a line opens or closes with (``` or ~~~, possibly longer), else None."""
    match = re.match(r"^\s*(`{3,}|~{3,})", line)
    return match.group(1) if match else None


def walk_lines(body: str, first_line: int):
    """Yield (line_number, line, fence_info) where fence_info is the opening line of the enclosing
    fenced block, or None for prose. A fence closes only on the same character with at least the
    same length, so a ```` block can contain ``` examples."""
    open_fence: str | None = None
    open_line = ""
    for offset, line in enumerate(body.split("\n")):
        number = first_line + offset
        marker = fence_marker(line)
        if open_fence is None and marker:
            open_fence, open_line = marker, line.strip()
            yield number, line, "fence-open"
            continue
        if open_fence and marker and marker[0] == open_fence[0] and len(marker) >= len(open_fence) and line.strip() == marker:
            open_fence = None
            yield number, line, "fence-close"
            continue
        yield number, line, open_line if open_fence else None


def prose_lines(body: str, first_line: int):
    """Yield (line_number, text) for prose only; inline code, link targets and URLs are blanked."""
    for number, line, fence in walk_lines(body, first_line):
        if fence:
            continue
        cleaned = re.sub(r"`[^`]*`", " ", line)
        cleaned = re.sub(r"\]\([^)]*\)", "]", cleaned)
        cleaned = re.sub(r"https?://\S+", " ", cleaned)
        yield number, cleaned


def lint_post(path: Path, terms: dict, slugs: set[str], check_external: bool) -> list[Finding]:
    findings: list[Finding] = []
    text = path.read_text(encoding="utf-8")
    meta, body_start = parse_front_matter(text)
    body = "\n".join(text.split("\n")[body_start - 1:])

    def add(line: int, level: str, rule: str, message: str) -> None:
        findings.append(Finding(path, line, level, rule, message))

    # Front matter
    for field in REQUIRED_FIELDS:
        if not meta.get(field):
            add(1, "error", "front-matter", f"missing '{field}'")
    date = str(meta.get("date", ""))
    try:
        if dt.date.fromisoformat(date) > dt.date.today():
            add(1, "warning", "front-matter", f"date {date} is in the future")
    except ValueError:
        add(1, "error", "front-matter", f"date '{date}' is not YYYY-MM-DD")
    description = str(meta.get("description", ""))
    low, high = DESCRIPTION_RANGE
    if description and not low <= len(description) <= high:
        add(1, "warning", "description-length", f"{len(description)} characters; aim for {low}-{high} so search snippets aren't cut off")
    tags = meta.get("tags", [])
    if isinstance(tags, list):
        for tag in tags:
            if not TAG_PATTERN.match(str(tag)):
                add(1, "error", "tags", f"tag '{tag}' should be lowercase-kebab-case")
        if not 1 <= len(tags) <= 5:
            add(1, "warning", "tags", f"{len(tags)} tags; use 1-5")

    # Prose rules
    prefer = terms.get("prefer", {})
    avoid = terms.get("avoid", {})
    previous_level = 1
    headings: dict[str, int] = {}
    paragraph: list[tuple[int, str]] = []

    def check_paragraph() -> None:
        if not paragraph:
            return
        joined = " ".join(text for _, text in paragraph)
        if joined.lstrip().startswith(("|", "-", "*", ">", "!")) or re.match(r"^\s*\d+\.", joined):
            paragraph.clear()
            return
        for sentence in re.split(r"(?<=[.!?])[\"”')*]*\s+", joined):
            words = len(sentence.split())
            if words > MAX_SENTENCE_WORDS:
                add(paragraph[0][0], "warning", "sentence-length", f"{words}-word sentence: \"{sentence[:60].strip()}…\"")
        paragraph.clear()

    for number, line in prose_lines(body, body_start):
        heading = re.match(r"^(#{1,6})\s+(.*)", line)
        if heading:
            check_paragraph()
            level = len(heading.group(1))
            title = heading.group(2).strip()
            if level == 1:
                add(number, "warning", "heading", "use '##' for sections; the post title is the only h1")
            elif level > previous_level + 1:
                add(number, "warning", "heading", f"jumps from h{previous_level} to h{level}")
            key = title.lower()
            if key in headings:
                add(number, "warning", "heading", f"duplicate heading '{title}' (first on line {headings[key]})")
            headings.setdefault(key, number)
            previous_level = level
            continue

        if line.strip():
            paragraph.append((number, line.strip()))
        else:
            check_paragraph()

        for wrong, right in prefer.items():
            if re.search(rf"(?<![\w/.-]){re.escape(wrong)}(?![\w-])", line):
                add(number, "error", "terminology", f"'{wrong}' → '{right}'")
        # Quoted text is a mention, not a use: "as mentioned above" in quotes is an example.
        lowered = re.sub(r"[\"“][^\"”]*[\"”]", " ", line).lower()
        for phrase, reason in avoid.items():
            if re.search(rf"\b{re.escape(phrase)}\b", lowered):
                add(number, "warning", "word-choice", f"'{phrase}': {reason}")
    check_paragraph()

    # Images, links and meme blocks read the raw body (alt text and URLs live there).
    for number, line, fence in walk_lines(body, body_start):
        if fence:
            if fence == "```meme" and line.lower().startswith("format:"):
                fmt = line.split(":", 1)[1].strip()
                if fmt not in MEME_FORMATS:
                    add(number, "error", "meme", f"unknown format '{fmt}'; use one of {sorted(MEME_FORMATS)}")
            continue

        for alt, src in re.findall(r"!\[([^\]]*)\]\(([^)\s]+)", line):
            if not alt.strip():
                add(number, "error", "image-alt", f"image {src} has no alt text")
            elif len(alt) < 15:
                add(number, "warning", "image-alt", f"alt text '{alt}' is too short to describe the image")
            if src.startswith("/") and not (PUBLIC_DIR / src.lstrip("/")).exists():
                add(number, "error", "image-path", f"{src} does not exist in public/")

        for href in re.findall(r"(?<!!)\[[^\]]*\]\(([^)\s]+)", line):
            if href.startswith("/blog/"):
                slug = href.removeprefix("/blog/").split("#")[0].strip("/")
                if slug and slug not in slugs:
                    add(number, "error", "link", f"{href} points to a post that doesn't exist")
            elif check_external and href.startswith("http"):
                status = check_url(href)
                if status:
                    add(number, "warning", "external-link", f"{href} → {status}")

    return findings


def check_url(url: str) -> str | None:
    request = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "content-linter"})
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            return None if response.status < 400 else f"HTTP {response.status}"
    except urllib.error.HTTPError as error:
        # Some hosts reject HEAD; only report clear failures.
        return None if error.code in (403, 405, 429) else f"HTTP {error.code}"
    except (urllib.error.URLError, TimeoutError) as error:
        return f"unreachable ({error})"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("files", nargs="*", type=Path, help="posts to lint (default: all of content/blog)")
    parser.add_argument("--strict", action="store_true", help="treat warnings as errors")
    parser.add_argument("--external", action="store_true", help="check external links over the network")
    args = parser.parse_args()

    terms = json.loads(TERMS_FILE.read_text(encoding="utf-8"))
    all_posts = sorted(BLOG_DIR.glob("*.md"))
    slugs = {post.stem for post in all_posts}
    targets = [path.resolve() for path in args.files] or all_posts

    findings: list[Finding] = []
    for path in targets:
        findings.extend(lint_post(path, terms, slugs, args.external))

    for finding in sorted(findings, key=lambda f: (str(f.path), f.line)):
        print(finding)

    errors = sum(f.level == "error" for f in findings)
    warnings = len(findings) - errors
    print(f"\n{len(targets)} posts checked: {errors} errors, {warnings} warnings")
    return 1 if errors or (args.strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main())
