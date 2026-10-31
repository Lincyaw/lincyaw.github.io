import './style.css'
import avatar from './assets/avatar.jpg'
import { ABOUT, NEWS, PAPERS, THREADS } from './profile.ts'
import type { Paper, Thread } from './profile.ts'

/** What Presmium injects into the page: the site's documents and its theme's stylesheets. */
interface SiteData {
  base: string
  documents: { id: string, href: string }[]
  theme?: { name: string, stylesheets: string[] }
}

const data = document.getElementById('presmium-site-data')?.textContent
const site: SiteData = data ? JSON.parse(data) : { base: '/', documents: [] }
for (const href of site.theme?.stylesheets ?? []) document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href }))

// The reader's appearance, shared with the paper pages.
const APPEARANCE = 'presmium-appearance'
const stored = (() => { try { return localStorage.getItem(APPEARANCE) } catch { return null } })()
const root = document.documentElement
root.classList.toggle('dark', stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)

const esc = (text: string) => text.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)
const pageOf = (paper: Paper) => site.documents.find(doc => doc.id === `papers/${paper.id}`)?.href ?? `${site.base}papers/${paper.id}/`
const ME = /Aoyang Fang( \(co-first\))?/
/** A chapter's section in the paper's document: its name in lower case, every run of other characters one '-'. */
const sectionOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
/** The film plays from its document: the presentation with its narrated lecture, from the chapter's section. */
const filmOf = (paper: Paper, chapter: number) => `${pageOf(paper)}slides/?view=present&track=script&section=${encodeURIComponent(sectionOf(paper.chapters[chapter]![1]))}&step=0&autoplay`

const state = {
  thread: 'all' as Thread | 'all',
  view: matchMedia('(max-width: 767px)').matches ? 'list' : 'map',
  hover: 'fse26',
  newsAll: false,
  card: 0 as number | undefined,
  chapter: 0,
  playing: false,
}

const tag = (paper: Paper) => `<span class="px-tag" data-thread="${paper.thread}">${esc(paper.venue)}</span>`
const PLAY = '<svg class="px-play" viewBox="0 0 6 7" aria-hidden="true" shape-rendering="crispEdges"><rect x="0" y="0" width="2" height="7"/><rect x="2" y="1" width="2" height="5"/><rect x="4" y="2" width="2" height="3"/></svg>'

function header(): string {
  return `<header class="px-header">
    <nav class="px-header__bar" aria-label="Main">
      <a class="px-brand" href="#top"><span class="px-brand__mark" aria-hidden="true">AF</span><span class="px-brand__name">Aoyang Fang</span></a>
      <button class="px-menu" type="button" aria-expanded="false" aria-controls="px-links" aria-label="Menu"><span></span></button>
      <div class="px-links" id="px-links">
        <a href="#now">Research</a><a href="#papers">Papers</a><a href="#talks">Talks</a><a href="#about">About</a>
        <span class="px-links__soon">Blog <span class="px-chip">Soon</span></span>
        <button class="px-appearance" type="button" aria-label="Switch light and dark">${root.classList.contains('dark') ? 'Light' : 'Dark'}</button>
      </div>
    </nav>
  </header>`
}

function hero(): string {
  return `<section class="px-hero" id="top">
    <div class="px-hero__text">
      <p class="px-kicker">&gt; PhD candidate · CUHK-Shenzhen</p>
      <h1>When a microservice system fails, which service is to blame?</h1>
      <p class="px-lead">I study root cause analysis for microservices: keeping the telemetry that matters, locating the faulty service, and building benchmarks that show which methods hold up on realistic failures. Advised by <a href="https://pinjiahe.github.io/">Prof. Pinjia He</a>; research intern at ByteDance.</p>
      <div class="px-actions">
        <a class="px-button px-button--primary" href="#now">${PLAY}Watch the one-minute papers</a>
        <a class="px-button" href="https://scholar.google.com/citations?user=fknpyMIAAAAJ">Google Scholar<span class="px-citations" data-citations hidden></span></a>
        <a class="px-button" href="${site.base}assets/pdf/cv/cv.pdf">CV</a>
        <a class="px-button" href="https://github.com/Lincyaw">GitHub</a>
        <a class="px-button" href="mailto:aoyangfang@gmail.com">Email</a>
      </div>
    </div>
    <figure class="px-portrait"><img src="${avatar}" alt="Portrait of Aoyang Fang" width="260" height="260"><figcaption>Shenzhen · CN</figcaption></figure>
  </section>`
}

function now(): string {
  const stages = (['collect', 'diagnose', 'evaluate'] as Thread[]).map((thread) => {
    const t = THREADS[thread]
    const papers = PAPERS.filter(paper => paper.thread === thread)
    return `<article class="px-stage" data-thread="${thread}">
      <p class="px-stage__name"><span class="px-stage__step">${t.step}</span>${esc(t.label)}</p>
      <h3>${esc(t.question!)}</h3>
      <p>${esc(t.detail!)}</p>
      <div class="px-stage__papers">${papers.map(paper => `<button type="button" class="px-paper-chip" data-open="${paper.id}">${PLAY}${tag(paper)}<span class="px-paper-chip__name">${esc(paper.short)}</span><span class="px-paper-chip__time">1:00</span></button>`).join('')}</div>
    </article>`
  }).join('')
  const earlier = PAPERS.filter(paper => paper.thread === 'testing').map(paper => `<button type="button" class="px-inline" data-open="${paper.id}">${esc(paper.short)} (${esc(paper.venue)})</button>`).join(' and ')
  return `<section class="px-section" id="now" aria-labelledby="now-title">
    <div class="px-section__head"><h2 id="now-title">Now</h2><p>Three steps of one question. Every paper comes with a one-minute film.</p></div>
    <div class="px-stages">${stages}</div>
    <p class="px-earlier">Before root cause analysis, I worked on software testing and program analysis: ${earlier}.</p>
  </section>`
}

function papers(): string {
  const filters = (['all', 'collect', 'diagnose', 'evaluate', 'testing'] as const).map(key => `<button type="button" class="px-filter" data-filter="${key}" data-thread="${key}" aria-pressed="${state.thread === key}">${key === 'all' ? 'All' : esc(THREADS[key].label)}</button>`).join('')
  const shown = PAPERS.filter(paper => state.thread === 'all' || paper.thread === state.thread)
  const lanes: Thread[] = ['collect', 'diagnose', 'evaluate', 'testing']
  const x = (at: number) => ((at - 2023.4) / 3.4 * 100).toFixed(2)
  const hovered = PAPERS.find(paper => paper.id === state.hover) ?? PAPERS[0]!
  const map = `<div class="px-map" role="group" aria-label="Papers by thread and year">
    <div class="px-map__scroll"><div class="px-map__plot">
      ${lanes.map(lane => `<div class="px-map__lane" data-thread="${lane}"><span class="px-map__label">${esc(THREADS[lane].label)}</span><span class="px-map__track">
        ${PAPERS.filter(paper => paper.thread === lane).map(paper => `<button type="button" class="px-map__node" data-open="${paper.id}" data-hover="${paper.id}" style="left: ${x(paper.at)}%" aria-label="${esc(`${paper.venue}: ${paper.title}`)}" ${shown.includes(paper) ? '' : 'data-dim'} ${paper.id === hovered.id ? 'data-active' : ''}><span class="px-map__dot"></span><span class="px-map__venue">${esc(paper.venue)}</span></button>`).join('')}
      </span></div>`).join('')}
      <div class="px-map__years"><span class="px-map__label"></span><span class="px-map__track">${[2024, 2025, 2026].map(year => `<span style="left: ${x(year)}%">${year}</span>`).join('')}</span></div>
    </div></div>
    <p class="px-map__readout" aria-live="polite">${tag(hovered)}<strong>${esc(hovered.short)}</strong><span>${esc(hovered.claim)}</span></p>
  </div>`
  const list = `<ol class="px-list">${shown.map(paper => `<li>
    ${tag(paper)}
    <div><button type="button" class="px-list__title" data-open="${paper.id}">${esc(paper.title)}</button><p>${authorLine(paper)}</p></div>
    <button type="button" class="px-button px-button--dark" data-open="${paper.id}">${PLAY}1:00</button>
  </li>`).join('')}</ol>`
  return `<section class="px-section" id="papers" aria-labelledby="papers-title">
    <div class="px-section__head px-section__head--tools"><h2 id="papers-title">Papers</h2>
      <div class="px-filters" role="group" aria-label="Filter by thread">${filters}</div>
      <div class="px-toggle" role="group" aria-label="View"><button type="button" data-view="map" aria-pressed="${state.view === 'map'}">Map</button><button type="button" data-view="list" aria-pressed="${state.view === 'list'}">List</button></div>
    </div>
    ${state.view === 'map' ? map : list}
  </section>`
}

const authorLine = (paper: Paper) => esc(paper.authors).replace(ME, match => `<strong>${match}</strong>`)

function talks(): string {
  return `<section class="px-section" id="talks" aria-labelledby="talks-title">
    <div class="px-section__head"><h2 id="talks-title">Talks</h2></div>
    <a class="px-talk" href="${site.base}fse26-rca/"><span class="px-talk__cover">Slides</span><span class="px-talk__text"><strong>Rethinking the Evaluation of Microservice RCA</strong><span>FSE 2026 · interactive slides</span></span><span class="px-talk__go">Open →</span></a>
  </section>`
}

function about(): string {
  const news = state.newsAll ? NEWS : NEWS.slice(0, 4)
  const card = state.card === undefined ? undefined : ABOUT[state.card]
  return `<section class="px-section px-columns" id="about">
    <div><div class="px-section__head"><h2>News</h2></div>
      <ol class="px-news">${news.map(([date, text]) => `<li><time>${date}</time><span>${esc(text)}</span></li>`).join('')}</ol>
      <button type="button" class="px-button px-button--small" data-news>${state.newsAll ? 'Show less' : `Show all ${NEWS.length}`}</button>
    </div>
    <div><div class="px-section__head"><h2>About</h2></div>
      <div class="px-cards">${ABOUT.map((item, i) => `<button type="button" class="px-card" data-card="${i}" aria-expanded="${state.card === i}"><span class="px-card__label">${esc(item.label)}</span><span>${esc(item.summary)}</span></button>`).join('')}</div>
      ${card ? `<ul class="px-card__items">${card.items.map(([when, what]) => `<li><span>${esc(when)}</span><span>${esc(what)}</span></li>`).join('')}</ul>` : ''}
    </div>
  </section>`
}

function overlay(paper: Paper): string {
  const i = PAPERS.indexOf(paper)
  const prev = PAPERS[(i + PAPERS.length - 1) % PAPERS.length]!, next = PAPERS[(i + 1) % PAPERS.length]!
  return `<div class="px-overlay" data-close>
    <div class="px-dialog" role="dialog" aria-modal="true" aria-labelledby="px-dialog-title" tabindex="-1">
      <div class="px-film">
        ${state.playing
          ? `<iframe class="px-film__live" src="${filmOf(paper, state.chapter)}" title="${esc(`${paper.short}: one-minute film`)}" allow="autoplay; fullscreen"></iframe>`
          : `<button type="button" class="px-film__frame" data-play>${PLAY}<span>Play the one-minute film</span></button>`}
        <button type="button" class="px-film__close" data-close aria-label="Close">X</button>
      </div>
      <div class="px-chapters" role="group" aria-label="Chapters" style="--count: ${paper.chapters.length}">${paper.chapters.map(([at, name], n) => `<button type="button" data-chapter="${n}" aria-pressed="${n === state.chapter}"><time>${at}</time><span>${esc(name)}</span></button>`).join('')}</div>
      <div class="px-dialog__body">
        <p class="px-dialog__tags">${tag(paper)}<span class="px-thread" data-thread="${paper.thread}">${esc(THREADS[paper.thread].label)}</span>${paper.badge ? `<span class="px-badge">${esc(paper.badge)}</span>` : ''}</p>
        <h2 id="px-dialog-title">${esc(paper.title)}</h2>
        <p class="px-dialog__authors">${authorLine(paper)}</p>
        <p class="px-dialog__claim">${esc(paper.claim)}</p>
        <div class="px-actions"><a class="px-button px-button--primary" href="${pageOf(paper)}">Read the full page →</a>${paper.links.map(link => `<a class="px-button" href="${esc(link.href)}">${esc(link.label)}</a>`).join('')}</div>
        <div class="px-dialog__pager"><button type="button" data-open="${prev.id}">← ${esc(prev.short)}</button><button type="button" data-open="${next.id}">${esc(next.short)} →</button></div>
      </div>
    </div>
  </div>`
}

const app = document.getElementById('app')!

function opened(): Paper | undefined {
  const match = /^#paper\/([\w-]+)$/.exec(location.hash)
  return match ? PAPERS.find(paper => paper.id === match[1]) : undefined
}

function render(): void {
  const paper = opened()
  app.innerHTML = `${header()}<main>${hero()}${now()}${papers()}${talks()}${about()}</main><footer class="px-footer">Built with Presmium · © 2026 Aoyang Fang</footer>${paper ? overlay(paper) : ''}`
  document.body.classList.toggle('px-locked', Boolean(paper))
  if (paper) app.querySelector<HTMLElement>('.px-dialog')?.focus()
}

let returnTo: string | undefined
app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const el = target.closest<HTMLElement>('[data-open],[data-close],[data-play],[data-filter],[data-view],[data-news],[data-card],[data-chapter],.px-menu,.px-appearance')
  if (!el) return
  if (el.dataset.open) { returnTo ??= el.dataset.open; state.chapter = 0; state.playing = false; history.pushState(null, '', `#paper/${el.dataset.open}`); return render() }
  if (el.dataset.play !== undefined) { state.playing = true; return render() }
  if (el.dataset.close !== undefined) { if (target === el || el.tagName === 'BUTTON') close(); return }
  if (el.dataset.filter) { state.thread = el.dataset.filter as Thread | 'all'; return render() }
  if (el.dataset.view) { state.view = el.dataset.view; return render() }
  if (el.dataset.news !== undefined) { state.newsAll = !state.newsAll; return render() }
  if (el.dataset.card) { const n = Number(el.dataset.card); state.card = state.card === n ? undefined : n; return render() }
  if (el.dataset.chapter) { state.chapter = Number(el.dataset.chapter); state.playing = true; return render() }
  if (el.classList.contains('px-menu')) { const open = el.getAttribute('aria-expanded') !== 'true'; el.setAttribute('aria-expanded', String(open)); return }
  if (el.classList.contains('px-appearance')) {
    const dark = !root.classList.contains('dark')
    root.classList.toggle('dark', dark)
    try { localStorage.setItem(APPEARANCE, dark ? 'dark' : 'light') } catch {}
    return render()
  }
})

app.addEventListener('pointerover', (event) => {
  const node = (event.target as HTMLElement).closest<HTMLElement>('[data-hover]')
  if (node && node.dataset.hover !== state.hover) { state.hover = node.dataset.hover!; render() }
})
app.addEventListener('focusin', (event) => {
  const node = (event.target as HTMLElement).closest<HTMLElement>('[data-hover]')
  if (node && node.dataset.hover !== state.hover) { state.hover = node.dataset.hover!; render(); app.querySelector<HTMLElement>(`[data-hover="${state.hover}"]`)?.focus() }
})

function close(): void {
  state.playing = false
  history.pushState(null, '', location.pathname + location.search)
  render()
  if (returnTo) app.querySelector<HTMLElement>(`[data-open="${returnTo}"]`)?.focus()
  returnTo = undefined
}
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && opened()) close() })
addEventListener('popstate', render)
render()

// The citation count, updated daily by the Scholar crawler on the google-scholar-stats branch.
let citations: string | undefined
fetch('https://cdn.jsdelivr.net/gh/Lincyaw/lincyaw.github.io@google-scholar-stats/gs_data_shieldsio.json')
  .then(response => response.ok ? response.json() : undefined)
  .then((data?: { message?: string }) => {
    citations = data?.message
    const show = () => { for (const el of app.querySelectorAll<HTMLElement>('[data-citations]')) { el.textContent = `${citations} citations`; el.hidden = !citations } }
    show()
    new MutationObserver(show).observe(app, { childList: true })
  })
  .catch(() => {})
