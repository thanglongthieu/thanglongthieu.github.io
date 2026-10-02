# Research Studio

A small research studio that builds interactive experiments — 3D scenes, math simulations, language drills, and
tools for thinking — and writes down what it learns. Published with **Jekyll** on GitHub Pages at
[code.dina.jp](https://code.dina.jp).

Every experiment is a single static page built around an open question. The site organises them into four research
tracks, adds a local-first Research Notebook and a bring-your-own-key Research Assistant, and publishes lab notes.

## Structure

| Path | Purpose |
| --- | --- |
| `_data/experiments.yml` | **The experiment registry** — the single source of truth for every card, filter, and the home-page figure. |
| `_data/tracks.yml` | The four research tracks (Spatial Computing, Mathematical Thinking, Language & Speech, Tools for Thinking). |
| `_notes/` | Lab notes in Markdown, published under `/notes/<slug>/`. |
| `_layouts/default.html` | Site shell: header, navigation, theme toggle, footer. |
| `_layouts/tool.html` | Shell for tool pages; renders the title, summary, and question from the registry. |
| `_layouts/note.html` | Lab-note page with related-experiment sidebar and earlier/later navigation. |
| `_includes/` | Experiment card, note row, and the studio mark. |
| `assets/css/studio.css` | The design system (light and dark themes, components). |
| `assets/js/studio.js` | Theme toggle, mobile nav, experiment filters, and the hero terrain figure. |
| `index.html` | Home: hero figure, tracks, selected experiments, method, latest notes. |
| `experiments/` | Filterable index of every experiment (`?track=`, `?kind=`, `?q=` are shareable). |
| `notes/`, `about.html`, `404.html` | Lab-notes index, about page, not-found page. |
| `feature/` | Tools that use the studio layout: `research-notebook/`, `gemini-chat/` (Research Assistant), `photo-to-3d/`. |
| `games/` | Self-contained experiment pages, kept at their original URLs. |

## Running locally

1. Install Ruby and Bundler.
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Serve the site:
   ```bash
   bundle exec jekyll serve
   ```
   The site is available at http://localhost:4000.

## Adding an experiment

1. Create `games/<id>/index.html` — any self-contained HTML page works. Use `feature/<id>/index.html` with
   `layout: tool` and `experiment: <id>` in the front matter if it should share the studio chrome.
2. Register it in `_data/experiments.yml`:
   ```yaml
   - id: my-experiment
     title: My Experiment
     path: /games/my-experiment/
     track: math            # spatial | math | language | tools
     kind: simulation       # tool | scene | simulation | drill | game
     added: 2026-10-02
     updated: 2026-10-02
     summary: "One or two sentences on what it does."
     question: "The open question it is built to poke at?"
     stack: [Three.js]
     featured: false
   ```
3. Commit and push. The home page, the experiments index, the notebook and assistant pickers, and the hero figure all
   update on the next build.

## Writing a lab note

Add `_notes/<slug>.md`:

```yaml
---
title: "What the note is about"
date: 2026-10-02 10:00:00 +0000
track: spatial
kind: Method               # free text: Method, Explainer, Studio log, Result…
summary: "One-sentence summary shown in lists."
experiments: [photo-to-3d] # optional; shown in the sidebar
---
```

## Privacy

- The **Research Notebook** stores entries in the browser's `localStorage` under `rs-notebook-v1`. Export to Markdown or
  JSON to keep a copy.
- The **Research Assistant** sends prompts directly from the browser to the Gemini API, with the key in the
  `x-goog-api-key` header. The key is stored only if you click *Save in this browser*.
- There are no analytics.
