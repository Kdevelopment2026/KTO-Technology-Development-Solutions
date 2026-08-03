#!/usr/bin/env python3
"""Set — or verify — the one hostname this site hard-codes.

Fifteen places across three files carry the site's absolute address: the
canonical link, og:url, og:image, twitter:image, the JSON-LD `@id` and `url`
fields, the Sitemap line in robots.txt, and `<loc>` in sitemap.xml. They have
to be absolute, and they all have to agree.

Getting it wrong is quiet and expensive. A canonical pointing at a host that
404s tells Google to index nothing. An og:image that 404s means every LinkedIn
or Slack share renders with no card. Neither looks like a broken page.

    python3 tools-host.py                     # show the current host
    python3 tools-host.py --check             # exit 1 if it is still the placeholder
    python3 tools-host.py --set example.com   # rewrite all of them

`--check` runs in the Netlify build command, so a deploy fails rather than
publishing a site whose canonical points somewhere else.

The site's own host is read from `<link rel="canonical">` — the one place it
is unambiguous — and only that exact host is ever rewritten. External links
(LinkedIn, the certificate verifiers, schema.org) are never touched.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
FILES = ["index.html", "robots.txt", "sitemap.xml"]

# What the repo shipped with. Netlify serves a 404 for it: it belongs to nobody.
PLACEHOLDER = "kto-technology.netlify.app"

CANONICAL_RE = re.compile(r'<link rel="canonical" href="https://([^/"]+)/?"')


def site_host():
    """The site's own hostname, taken from the canonical link."""
    m = CANONICAL_RE.search((ROOT / "index.html").read_text())
    if not m:
        sys.exit("index.html: no <link rel=\"canonical\"> found — cannot tell "
                 "which host belongs to this site.")
    return m.group(1)


def occurrences(host):
    return {name: (ROOT / name).read_text().count(f"https://{host}")
            for name in FILES}


def show():
    host = site_host()
    counts = occurrences(host)
    total = sum(counts.values())
    flag = "   <- placeholder, unclaimed, returns 404" if host == PLACEHOLDER else ""
    print(f"Site host: {host}{flag}")
    for name, n in counts.items():
        print(f"  {name:14s} {n}")
    print(f"  {'total':14s} {total}")
    return host, total


def check():
    host = site_host()
    total = sum(occurrences(host).values())
    if host == PLACEHOLDER:
        print(f"STALE. {total} absolute URLs still point at {PLACEHOLDER}.")
        print("That host is unclaimed and Netlify returns 404 for it, so the")
        print("canonical, the social card and the sitemap all point at nothing.")
        print("\nFix:  python3 tools-host.py --set <your-real-host>")
        return 1
    print(f"Host is {host}, used consistently in {total} places.")
    return 0


def set_host(new):
    new = new.strip().rstrip("/")
    for prefix in ("https://", "http://"):
        if new.startswith(prefix):
            new = new[len(prefix):]
    if "." not in new or " " in new or "/" in new:
        sys.exit(f"'{new}' does not look like a hostname.")

    old = site_host()
    if old == new:
        print(f"Already set to {new}.")
        return check()

    total = 0
    for name in FILES:
        path = ROOT / name
        text = path.read_text()
        n = text.count(f"https://{old}")
        if n:
            path.write_text(text.replace(f"https://{old}", f"https://{new}"))
            total += n
            print(f"{name}: {n} rewritten")

    print(f"\n{total} URLs now point at https://{new}/")
    print("The JSON-LD block changed, so its CSP hash has too. Run:")
    print("  python3 tools-csp-hash.py        # then paste the hash into netlify.toml")
    return check()


def main():
    args = sys.argv[1:]
    if not args:
        show()
        return 0
    if args[0] == "--check":
        return check()
    if args[0] == "--set" and len(args) == 2:
        return set_host(args[1])
    sys.exit(__doc__)


if __name__ == "__main__":
    sys.exit(main())
