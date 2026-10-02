# Known issues

Findings from the Research Studio rebuild ([PR #42](https://github.com/thanglongthieu/thanglongthieu.github.io/pull/42),
deployed 2 October 2026). This file lives in the repository only. It is excluded from the published site.

## Open

| # | Issue | Where | Notes |
| --- | --- | --- | --- |
| 1 | Unused sample-app and build leftovers are still in the repo | `app/` (includes a committed `__lwr_cache__` build cache and built `site/` output), `app.js`, `app.ts`, `style.css`, `test.html`, `rollup.config.js` (points at a `src/main.js` that doesn't exist), `lwr.config.json`, `tsconfig.json`, `package.json`, `package-lock.json` | Nothing on the site uses them, and most are kept out of the build via `exclude` in `_config.yml`. Safe to delete (`git rm`). |
| 2 | `.DS_Store` is committed | repo root | It is in `.gitignore` now, but the tracked copy remains. |
| 3 | Unused files still in the repo | `assets/css/main.css` (still published), `_data/apps.yml`, `_data/games.yml` | `_data/experiments.yml` replaced the two data files. |
| 4 | Salesforce login page is still live | `login/index.html` → `/login/` | It asks for a Salesforce username, password and security token in the browser. The related Salesforce app was removed in #34. It is unlinked from the nav, still loads Tailwind from a CDN (`tailwind: true` front matter), and is the only page left in the old style. Suggest removing it. |
| 5 | Site address mismatch | `_config.yml` has `url: https://thanglongthieu.github.io`, but `CNAME` is `code.dina.jp` | Any full URL the site builds (for example in link previews) would point at github.io. The site doesn't generate full URLs today, so nothing is broken yet. Fix: set `url: "https://code.dina.jp"`. |
| 6 | Live site not checked by eye | <https://code.dina.jp> | The sandbox used for the rebuild could not reach the site (proxy 403). The Pages deploy succeeded (run 37017553778), but no one has looked at the live page yet. |
| 7 | Some features not tested for real | `feature/gemini-chat/`, `games/*`, `login/` | The Research Assistant was only tested against a mocked Gemini API. The 3D games, which the rebuild didn't change, weren't run. The login page wasn't tested with Tailwind loaded. The CDNs they need were blocked in the sandbox. |

## Fixed in the rebuild

| # | Issue | Fix |
| --- | --- | --- |
| 8 | Gemini chat was hard-coded to `gemini-1.5-flash-latest`, a retired model | It now lists the models the user's key can use, defaulting to `gemini-2.5-flash`. |
| 9 | The Gemini API key was sent in the request URL (`?key=…`), where it can end up in logs and history | It is now sent in the `x-goog-api-key` header. |
| 10 | `maxOutputTokens: 512` could cut answers short or return empty replies | Cap removed. An empty or blocked reply now shows the reason. |
| 11 | The page claimed replies "stream back", but the request didn't stream | Copy corrected. Replies render as a safe Markdown subset with HTML escaped. |
| 12 | `number-fun` and `rock-paper-scissor-fun` were missing from `games.yml`, so they never appeared on the homepage | Both are in the registry now. |
| 13 | Placeholder descriptions ("Mini Craft!", "Kanji Fun!", "Fraction Game") | Rewritten from what each game actually does. |
| 14 | Names that didn't match the page (`three-triangle` is a spaceship; `math-car-run` was titled "Simple Random Demo") | Accurate titles in the registry. Folder names kept so the URLs still work. |
| 15 | Mixed branding ("Andi & Anna Games Room" in the config, "Beautiful Apps Studio" on the page) | One name everywhere: Research Studio. |
| 16 | The Tailwind Play CDN, which Tailwind says isn't for production, styled the whole site | Replaced by `assets/css/studio.css`, except on the legacy login page. |
| 17 | Photo → 3D hid its loading cover before the image was ready, and the cover relied on Tailwind's `hidden` class | It now hides when the image has loaded, using the `hidden` attribute. |
| 18 | Photo → 3D used an uncapped pixel ratio and only resized when the window did | Pixel ratio capped at 2, and a `ResizeObserver` follows the container. |
| 19 | The Japanese pronunciation page linked "Back to games" | Now "Back to the studio". |
| 20 | The README only documented games | Rewritten for the new structure. |
| 21 | `.gitignore` only listed `node_modules` | Added `_site/`, `.sass-cache/`, `.jekyll-cache/`, `.jekyll-metadata`, `.DS_Store`. |

## Bugs found in screenshots and tests, fixed before merge

- The notebook's type-picker dots picked up button styling (a descendant-selector bug).
- The About sidebar overflowed sideways by 16px because of a long repository link.
- Hint text inside form labels showed in bold.
- Tag backgrounds were nearly invisible in dark mode.
- The earlier/later note links didn't line up with the text column.
- About-page Markdown wasn't formatted inside nested HTML, so the page moved to `about.html` with `markdownify`.

## Local build note

Building locally with the `github-pages` gem fails on the default theme's (`jekyll-theme-primer`) Sass unless a UTF-8
locale is set, for example `LC_ALL=C.UTF-8 bundle exec jekyll build`. GitHub's own build is unaffected.
