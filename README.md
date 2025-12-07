# Andi & Anna Games Room

This repository now uses **Jekyll** to publish the games hub as a static site.
The homepage is generated from a data file so adding new games only requires updating the list—no JavaScript needed.

## Structure
- `index.html` – homepage that renders cards for each game using Liquid templates.
- `_data/games.yml` – source of truth for games (ID, title, description).
- `_layouts/default.html` – shared HTML shell and stylesheet link.
- `assets/css/main.css` – site styles.
- `games/` – individual game folders with their own `index.html` files.

## Running locally
1. Install Ruby and Bundler.
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Serve the site with Jekyll:
   ```bash
   bundle exec jekyll serve
   ```
   The site will be available at http://localhost:4000.

## Adding a game
1. Create a folder under `games/` and add an `index.html` for the game.
2. Append the game details to `_data/games.yml` with its folder name as the `id`.
3. Commit and push—GitHub Pages will rebuild the site with the new card.
