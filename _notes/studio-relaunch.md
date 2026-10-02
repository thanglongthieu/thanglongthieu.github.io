---
title: "From games room to research studio"
date: 2026-10-02 12:00:00 +0000
track: tools
kind: Studio log
summary: "Why the site is now organised around questions, what moved, and what stayed exactly where it was."
experiments: [research-notebook, gemini-chat]
---

The site began as a games room: math drills, kanji quizzes, a handful of Three.js scenes, and later a couple of
utilities. Looking at the list again, almost every entry had been built to find something out — whether a timer helps
recall, whether a 3D picture makes a counting argument obvious, whether hearing a word problem changes how it is read.
So the site is now organised around those questions.

## What changed

- **One registry.** The two lists that drove the old home page (`apps.yml` and `games.yml`) gave way to a single
  `_data/experiments.yml`. Every entry has a track, a kind (tool, scene, simulation, drill, or game), a stack, and a
  *question*: the thing it was built to poke at.
- **Four tracks.** Spatial Computing, Mathematical Thinking, Language & Speech, and Tools for Thinking. The home page
  figure draws them as hills whose height follows the number of experiments in each track, so the map changes as the
  registry does.
- **A notebook.** The new [Research Notebook]({{ '/feature/research-notebook/' | relative_url }}) is a local-first place
  for questions, hypotheses, observations, and sources. Entries can link to experiments and export to Markdown or JSON.
- **A sturdier assistant.** The Gemini page is now the [Research Assistant]({{ '/feature/gemini-chat/' | relative_url }}).
  It lists the models your key can reach instead of hard-coding one, sends the key in a request header rather than the
  URL, and can save any reply straight into the notebook.
- **Lab notes.** Write-ups like this one live in `_notes/` and are published under `/notes/`.

## What did not change

Every experiment URL. Pages under `/games/` and `/feature/` are exactly where they were, so old links and bookmarks still
work.

## Open questions

- Are four tracks the right cut? Several math experiments are really about *space* (the cube stack, the stick
  crossings). The registry makes it cheap to move them if that turns out to be the better reading.
- Does printing the question on each card change how people approach an experiment? That is the notebook's own
  question, and the notebook is where the answer should be logged.
