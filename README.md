# profile.aoyangfang.top

The personal site of Aoyang Fang, built with [Presmium](https://github.com/Lincyaw/presmium). Every paper is one
document under `papers/<id>/lecture.json`: its web form is the paper's page, and its presentation is a narrated
one-minute film that the home page plays.

| Path | What it holds |
|---|---|
| `site/` | The home page: `home.html`, `home.ts`, `style.css`, and `profile.ts` with the papers, news and CV entries |
| `theme/` | The pixel site theme: design tokens (`theme.json`) and `pixel.css`, shared by the home page and the papers |
| `papers/<id>/` | A paper's document, its scenes, figures, narration audio and the material it was written from |
| `public/` | Files published as they are: the CV, the paper PDFs, the FSE 2026 talk slides |
| `tools/voiceover.mjs` | Generates a document's missing narration with the configured speech engine |

```sh
pnpm install
pnpm serve     # preview, updating on save
pnpm build     # the static site in dist/web/
```

Pushing to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/pages.yml`).
