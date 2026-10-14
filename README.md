# Jisu Ko — personal site

Source for [kozysu.github.io](https://kozysu.github.io). Built with Next.js and
exported as a static site.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy

Pushing to `main` deploys the site. `.github/workflows/deploy.yml` builds a
static export into `out/` and publishes it to GitHub Pages. In the repository's
Settings → Pages, Source must be set to **GitHub Actions**.

To check the export locally without disturbing a running dev server:

```bash
NEXT_DIST_DIR=.next-export npx next build   # writes the site to .next-export/
```

## Editing content

Most content lives in `src/data/`. Edit those files rather than the components.

| What | File |
|---|---|
| Intro text | `src/app/page.tsx` |
| News | `src/data/news.ts` |
| Publications | `src/data/publications.ts` |
| Paper PDFs | `public/papers/` (linked through `pdfUrl`) |
| Paper figures | `src/assets/` |
| Profile links (Scholar, GitHub, LinkedIn) | `src/data/profiles.ts` |
| Research lens copy (section currently hidden) | `src/data/lens.ts` |

There is no image server on GitHub Pages, so images ship at their original
size. Keep figures around 1400px wide; WebP works well (for example,
`cwebp -q 90 in.png -o out.webp`).

Styles are in `src/styles/site.css`, and the color tokens are in
`src/styles/theme.css`.

## Hidden for now

These are kept in the code but not published:

- **CV page:** `src/app/_cv/`. Folders that start with `_` are not routed. To
  restore it, rename the folder to `cv`, move `cv.pdf` and
  `pdf.worker.min.mjs` from `_offline/` back to `public/`, and uncomment the CV
  link in `src/components/SiteHeader.tsx`.
- **Project pages:** `src/app/_projects/`. To restore them, rename the folder
  to `projects` and set `projectsVisible` in `src/data/systems.ts`.
- **Research lens section:** to restore it, uncomment it in
  `src/app/page.tsx`.

`_offline/` is not committed. It holds `cv.pdf` and the full-size originals of
the images.

## Credits

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
