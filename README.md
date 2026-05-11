# qwen-worker-todo-pages

A small static to-do app intended to run from the GitHub Pages root.

## Features

- Add, complete, delete, and clear completed todos
- Saves todos in `localStorage`
- Accessible labels and keyboard-friendly controls
- Plain HTML, CSS, and JavaScript only

## Files

- `index.html` - page markup
- `styles.css` - responsive light/dark styling
- `app.js` - todo state, rendering, and persistence

## Verification

```bash
node --check app.js
git diff --check
```
