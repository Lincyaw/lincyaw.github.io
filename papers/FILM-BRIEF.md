# Paper documents: the page and the one-minute film in one lecture.json

Each paper is one Presmium document, `papers/<id>/lecture.json`. Its web form is the paper's page on the site; its
`slides` and `lecture` forms are the narrated one-minute film, which the home page's paper overlay plays in an iframe
(`papers/<id>/slides/?view=present&track=script&section=<section>&step=0&autoplay`). The workspace build makes all
three forms.

## Sources

- `papers/<id>/highlights.md`: the facts (paper-highlights skill). Every claim on the page and in the film comes from it.
- `papers/<id>/script.md`: the film's story: thesis, ABT, chosen storyline, beats with times, narration (140–160 words).
- `papers/<id>/figures/`: real figures from the paper.
- `papers/fse26/lecture.json` (current version): the page structure to follow; it has no film yet.

## How to write it

Read before writing: Presmium's author skill (`/home/ddq/AoyangSpace/presmium/.agents/skills/presmium-author/SKILL.md`
and its references), the animation skill (`…/presmium-animate/SKILL.md`, `references/story.md`, `lengths.md`,
`timeline.md`, `libraries.md`), the narrated worked example `…/presmium-animate/gallery/story/` (lecture.json and
scenes/) and the films in `…/presmium-animate/gallery/films/`, and `…/presmium-present/references/lecture.md`. Read the
installed public types under `node_modules/@lincyaw/` (kernel contracts, `@lincyaw/addon-motion/scene`) before using an
API; do not guess.

- **Sections are the film's beats**, in the order and with the names of `script.md`, which `site/profile.ts` lists as
  the paper's `chapters`. Each section's id is its chapter name in lower case with every run of other characters
  turned into one `-` ("Who gets blamed?" → `who-gets-blamed`): the overlay's chapter buttons start the film there.
  The first section's title is the paper's title (its id still comes from the first chapter's name); the others' titles
  are the chapter names. If the story needs other beats than `profile.ts` lists, say so in the report.
- **Each section has one scene** (a component block from a definition in `definitions`, implemented in
  `papers/<id>/scenes/<name>.ts` with `@lincyaw/addon-motion/scene`), shown in the film and as the animated figure on
  the page, with explicit step states; it rests on a readable final frame. Scenes may show the paper's figures.
- **The page prose is web-only**: text, image and code blocks with `"only": ["web"]`, written by the launch event
  principle (core claim and its evidence first, every sentence informative, no defensive or self-undermining phrasing,
  no two consecutive sections in the same layout). The first section also carries, web-only, the author line (Aoyang
  Fang in bold), venue and honors, and the links (PDF, DOI or arXiv, code); the last section ends with the BibTeX in a
  web-only code block. No section may be web-only as a whole: every section has its scene.
- **Narration** goes in `narrations`, named by the steps; it is `script.md`'s narration, spoken English.
- **Metadata**: `lang: "en"`, `description` = the one-sentence claim, `tags: ["<Thread>", "<Venue>"]` (Thread is
  Collect, Diagnose, Evaluate or Testing & analysis), `plugins: ["@lincyaw/addon-motion", "@lincyaw/addon-lecture",
  "@lincyaw/addon-speech"]`, `renderers: { "web": {}, "slides": {}, "lecture": {} }`.
- **Voice**: `production.defaults.voiceSource = { "type": "tts", "voice": { "engine": "edge", "voice": "en-US-AndrewNeural" } }`,
  `trailingPauseMs` about 300; the whole film 55–65 s.
- **Look**: 16:9. The site's palette: ink `#17171c`, paper `#f6f6f1`, white `#ffffff`, muted `#5a5a66`, line `#d9d9d0`;
  threads Collect `#0f766e`, Diagnose `#2546b8`, Evaluate `#b93a0b`, Testing & analysis `#5b4b99`. Labels may use the
  pixel font Silkscreen (Google Fonts); body text IBM Plex Sans. Square corners, hard offset shadows, little text on
  screen.

## Verify (in the site repository, `/home/ddq/AoyangSpace/lincyaw.github.io`)

```sh
source ~/.local/share/presmium-edge-tts/env.sh   # the "edge" speech engine
pnpm exec presmium check papers/<id>
flock /tmp/lincyaw-voiceover.lock node tools/voiceover.mjs papers/<id>   # missing narration audio, one run at a time
pnpm exec presmium build papers/<id> --out /tmp/<id>-build
```

No video file is exported: the site plays the film live from the document's presentation. Look at it as a viewer
does: serve `/tmp/<id>-build` (`python3 -m http.server`) and open `slides/?view=present&track=script&section=<id>&step=0`
in Chromium (Playwright from `/home/ddq/AoyangSpace/presmium/node_modules`), screenshot each section's rest frame and a
moment of motion, and read the screenshots. Check that the narration plays to the end of each section, the whole film
runs 55–65 s, and fix what a cold viewer would not follow. Work only inside `papers/<id>/`; do not run the whole
workspace build, do not edit other papers, the theme or the home page, and do not commit.

The narration audio lands in `papers/<id>/.presmium/speech/` with `speech.lock.json`; it is committed with the
document, since the site's build has no speech engine. After changing a narration, run the voiceover again.
