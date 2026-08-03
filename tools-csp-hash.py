#!/usr/bin/env python3
"""Print the CSP hash for the inline JSON-LD block in index.html.

The Content-Security-Policy in netlify.toml allows exactly one inline script:
the structured-data block in <head>. It is allowed by hash, not by
'unsafe-inline', so ANY edit to that block — even a space — invalidates the
hash and the browser silently refuses to run it. Silently is the problem: the
page looks fine and the structured data disappears from search.

So: edit the JSON-LD, run this, paste the line it prints into netlify.toml.

    python3 tools-csp-hash.py            # print the hash
    python3 tools-csp-hash.py --check    # exit 1 if netlify.toml is stale

The --check form is what to run before a deploy, and what a CI step would
call. It is the whole reason this file exists.
"""

import base64
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
BLOCK = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)


def hashes():
    """Every inline script in index.html, as CSP source expressions."""
    html = (ROOT / "index.html").read_text()
    found = BLOCK.findall(html)
    if not found:
        sys.exit("index.html: no JSON-LD block found. Has it been removed?")

    out = []
    for body in found:
        try:
            json.loads(body)
        except json.JSONDecodeError as exc:
            sys.exit(f"index.html: the JSON-LD block is not valid JSON — {exc}")
        digest = hashlib.sha256(body.encode()).digest()
        out.append("sha256-" + base64.b64encode(digest).decode())
    return out


def main():
    found = hashes()
    check = "--check" in sys.argv

    if not check:
        for h in found:
            print(f"'{h}'")
        return

    toml = (ROOT / "netlify.toml").read_text()
    missing = [h for h in found if h not in toml]
    if missing:
        print("STALE. netlify.toml does not carry the current hash.")
        for h in missing:
            print(f"  expected: '{h}'")
        print("\nReplace the 'sha256-...' value in the script-src directive.")
        sys.exit(1)
    print(f"netlify.toml is current ({len(found)} inline script allowed).")


if __name__ == "__main__":
    main()
