# Personal website

Static site for GitHub Pages: plain HTML, CSS and JavaScript, no build step.

## Preview locally

The Research and Projects lists are loaded with `fetch()`, which browsers
block when a page is opened by double-clicking (`file://`). Run a local
server instead:

```sh
python3 -m http.server
```

Then open <http://localhost:8000>.

## Adding a project

Open `projects/projects.json` and add an entry at the **top** of the list
(newest first):

```json
{
  "title": "Project name",
  "role": "Lead developer",
  "collaborators": ["Name One", "Name Two"],
  "affiliation": "Lab, course, company, or Personal",
  "period": "Mar – Aug 2026",
  "description": "One or two sentences, with an optional <a href=\"https://...\">link</a>.",
  "tags": ["React", "LLM"],
  "links": {
    "Website": "https://...",
    "Code": "https://...",
    "Demo": "https://...",
    "Paper": "https://...",
    "Slides": "https://..."
  },
  "thumbnail": "projects/img/name.png"
}
```

- Only `title`, `period` and `description` are needed; delete any other line
  you don't use (omit `collaborators` for a solo project).
- `links` — include only the ones you have. They are always shown in the
  order Website, Code, Demo, Paper, Slides. If there is a `Website`, the
  title links to it too.
- `description` — the one field read as HTML, so it can contain `<a>` links.
  Inside it, write quotes as `\"` and a literal `&` or `<` as `&amp;` or `&lt;`.
- `thumbnail` — put the image in `projects/img/`. It is shown 120px wide and
  cropped to 4:3, so a 480×360 image works well.
- If `projects.json` is empty (`[]`) or deleted, the Projects section
  disappears from the page.

JSON is strict: entries are separated by commas, with no comma after the last
item in a list.
