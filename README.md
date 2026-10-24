# Jie Sun — Academic Homepage

Visit **https://sunjie279.github.io/**.

A bilingual static academic homepage hosted on GitHub Pages. No build step, dependencies, analytics, or external fonts are required.

## Updating the page

- `index.html`: English biography, education, internships, awards, and links.
- `content.js`: publications, paper resources, and Chinese translations.
- `styles.css`: layout and responsive styles.
- `app.js`: topic filters, language switch, navigation, and paper figure viewer.
- `assets/`: profile image and paper figures. Each publication can define `image` (preview), `imageFull` (click-to-enlarge version), `imageAlt`, and the preview's `imageWidth`/`imageHeight` in `content.js`.
- `assets/papers/sources.json`: provenance for the added paper figures, including the source publication, figure number, page, and crop bounds. Figures preserve the original diagrams, labels, and legends; only surrounding page text and whitespace are removed. EI-CDA uses the author's archived manuscript. ARGO uses the author-provided original figure; its related arXiv version uses the Apollo name. All 19 publications now have figures.

Publish by committing changes to `main`. GitHub Pages serves the repository root; `.nojekyll` preserves these static files without Jekyll processing.

To preview locally, run `python3 -m http.server 8765` and open http://localhost:8765.

The previous homepage remains available in the Git history before this replacement. The current content follows the October 2026 resume and verified primary publication sources. The full resume and private phone number are not included.
