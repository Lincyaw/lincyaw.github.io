// The film's one object: the incident ticket of Figure 1 (a sign-in failure of the desktop client on Mac), carried
// from chapter to chapter, and the team lanes or log boxes it meets.

export const TICKET_TEXT = 'Customers can’t sign in to the desktop client on Mac.'

export const TICKET_CSS = `
  .ticket__kind { font-size: 1.2cqw; color: var(--pm-color-muted); }
  .ticket__text { font-size: 1.9cqw; margin-top: 0.6cqw; line-height: 1.3; }
  .box { width: 16cqw; height: 8.5cqw; padding: 1cqw 1.2cqw; }
  .box__name { font-size: 1.35cqw; }
  .box__lines { margin-top: 0.8cqw; display: grid; gap: 0.55cqw; }
  .box__lines i { display: block; height: 0.55cqw; background: var(--pm-color-line); }
  .box__lid { position: absolute; left: -0.22cqw; right: -0.22cqw; top: 3.2cqw; bottom: -0.22cqw; background: var(--pm-color-ink); transform-origin: top center; }
  .box__lid span { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: var(--pm-color-bg); font-size: 1.2cqw; }
`

/** A team's box of logs and documents; closed under a lid until its agent opens it. */
export function box(team: string, x: number, y: number, extra = ''): string {
  return `<div class="pos card box box--${team}${extra}" style="left:${x}%; top:${y}%">
    <div class="px box__name">team <span class="box__letter">${team}</span> logs</div>
    <div class="box__lines"><i style="width:90%"></i><i style="width:70%"></i><i style="width:80%"></i></div>
    <div class="box__lid"><span class="px">closed</span></div>
  </div>`
}
