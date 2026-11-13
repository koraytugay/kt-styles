# kt-styles — CLAUDE.md

## What this is

kt-styles is a **generic** CSS design system that all of my websites share, plus a Bootstrap-docs-style
showcase site that documents it. When I start a new website, I tell the agent there to use the CSS from
here. When a project needs an element that doesn't exist yet, the element gets added **here first**, refined
in the showcase, and only then used in the project.

The repo has two parts:

1. **The library** (`css/`): the styles that projects link to.
2. **The showcase** (`index.html`, `pages/`, `showcase/`): a site with a sidebar, where every element is shown
   live, with the clean markup in the page source.

`README.md` is the guide for consuming projects (and their agents). Keep it in sync whenever classes are
added, renamed or removed.

## Hard rules

- **Everything is domain-neutral.** Class names, example content, labels, comments and docs must not refer
  to any specific app or subject (no "games", "players", "stocks", "albums"…). Use neutral placeholders like
  "Item title", "Subtitle", "Category", "Metric one". A component is named for its **shape**
  (`media-card`, `stat`), never for its content.
- **The showcase is a reference, not a product site.** Its readers are me and agents, so leave out
  announcement or marketing chrome: no "new"/"beta" tags, changelogs, version banners or hero copy.
  Every element on a page should help someone look up, compare or copy a component.
- **Only CSS belongs here.** App-level conventions (which emoji or icon means what, data formats, wording)
  belong to the individual projects, not to this library.
- **Outer edges use `--kt-border`; lines inside a component use the lighter `--kt-divider`.**
- **Color carries meaning, not decoration.** Green/red only for gain/loss or good/bad; charts and categories use
  the calm `--kt-series-*` palette; values and labels default to the text color.
- **No shadows on regular surfaces** (cards, tables, toolbars, controls, tabs). Edges come from 1px borders.
  Shadows are reserved for floating layers: popovers, modals, badges over images.
- **NEVER use colored side borders** (e.g. `border-left: 3px solid <color>` on cards, callouts, alerts,
  list items or nav items). Not in the library and not in the showcase. Borders are uniform hairlines on all
  sides. Show status with a badge, a tinted background, color or font weight.
- **Plain HTML + CSS + vanilla JS.** No npm dependencies, no frameworks, no CDNs, no web fonts. The only
  build is the CSS bundle (see "Build & distribution" below), which runs automatically in CI.
  Everything must work when opened over `file://` (so no `fetch()` of local files and no ES module imports).
- **Every library class starts with `kt-`. Every custom property starts with `--kt-`.**
- **Showcase-only styles use the `sc-` prefix** and live in `showcase/showcase.css`. Never put `sc-` rules in
  `css/`, and consuming projects never use `sc-` classes.
- **Components reference tokens only.** No raw hex values, px font sizes or ad-hoc shadows in
  `css/components/*`. If a value is missing, add a token to `css/tokens.css` (in both the light block and the
  dark block when it is a color).
- **Dark mode must work for everything.** It is triggered by `html[data-theme="dark"]`, with `body.dark-mode`
  kept as a legacy alias. Components get dark mode automatically through tokens.
- **Class naming:** BEM-ish. Block `.kt-card`, element `.kt-card__title`, modifier `.kt-card--padded`.
  Utilities are flat (`.kt-truncate`, `.kt-text-muted`).
- **State:** prefer ARIA attributes (`aria-current="page"`, `aria-pressed="true"`, `aria-sort`, `disabled`).
  Where a class is needed, use the `.is-*` form (`.is-active`, `.is-invalid`, `.is-clickable`) instead of
  `.active`.
- **Token and utility naming is unambiguous:** `--kt-text-*` and `.kt-text-*` are **colors** only. Font sizes are
  `--kt-fs-*` / `.kt-fs-*`, weights `--kt-weight-*` / `.kt-fw-*`, alignment `.kt-align-*`. Keep it that way.
- **Controls share one height** (`--kt-control-h`, 32px; `-sm` 26px, `-lg` 40px). Buttons, inputs, selects,
  segmented controls and nav tabs must line up in a row.
- **The base layer stays unopinionated.** No widths, display changes or margins on bare elements that would
  surprise a consumer. Opinions go in opt-in classes (e.g. `.kt-measure` instead of a global `p { max-width }`).
- **No `overflow: hidden` on containers that might hold popovers** (cards, toolbars).
- **Utilities stay `!important`** (so they can override component colors such as `.kt-kv dd`). Consequence for
  consumers, documented in README rule 6: a static utility on an element blocks runtime `el.style.*` changes.
  When migrating an app, never convert an inline default style into a utility if the app's JS later changes
  that property on the same element.
- **Density:** the root font size is 13.5px, and all sizes are `rem`. Mobile breakpoint: `max-width: 768px`.

## Structure

```
css/                   SOURCE — edit here
  kt.css               ENTRY POINT: only @imports, in layer order
  tokens.css           all design tokens (light + dark)
  base.css             reset + element defaults
  typography.css       headings, page header, text roles
  layout.css           container, .kt-grid (+ view modes), stack, cluster, split
  utilities.css        small helpers (imported LAST)
  components/          one file per component, alphabetical in kt.css
    badge.css          .kt-badge
    button.css         .kt-btn
    calendar.css       .kt-calendar (month grid)
    card.css           .kt-card, .kt-stat, .kt-media-card
    chart.css          .kt-chart-layout, .kt-readout, .kt-legend (around a chart)
    choice.css         .kt-choices, .kt-choice (single-answer quiz options with a round key)
    feedback.css       .kt-alert, .kt-spinner, .kt-loading, .kt-empty, .kt-toast
    form.css           .kt-input, .kt-select, .kt-textarea, .kt-field, .kt-check, .kt-toolbar, .kt-segmented
    kv.css             .kt-kv (key-value list)
    lanes.css          .kt-lanes (labelled rows: label column + wrapping content)
    modal.css          .kt-modal (overlay + dialog, .is-open)
    nav.css            .kt-nav (page tabs)
    progress.css       .kt-progress (tracks, stacked segments), .kt-bar-list
    table.css          .kt-table, .kt-table-wrap
    thumb.css          .kt-thumb (square image tile + overlays), .kt-thumb-grid
    tooltip.css        .kt-tooltip (data-tooltip, CSS only)
showcase/
  registry.js          SIDEBAR DEFINITION: sections → pages
  showcase.js          builds the top bar, sidebar, sub-section TOC, example title bars, theme toggle, pager
  showcase.css         sc- styles for the docs chrome
pages/
  _template.html       copy this to start a new page
  foundations/         colors, fonts, typography, layout
  components/          one page per component file
index.html             overview / getting started
README.md              guide for consuming projects (keep the catalog current)
scripts/build.mjs      bundles css/kt.css + its @imports into dist/ (no dependencies)
dist/                  GENERATED — kt.css (readable) and kt.min.css; never edit by hand
.github/workflows/build.yml   runs the build on every push to main and commits dist/
```

## How to add a new component (e.g. "buttons")

1. Create `css/components/button.css` with a header comment that shows the markup. Use tokens only.
2. Add `@import url("components/button.css");` to `css/kt.css` in the Components block (keep it alphabetical,
   and before `utilities.css`).
3. Copy `pages/_template.html` to `pages/components/buttons.html`.
4. Register the page in `showcase/registry.js` under the right section.
5. On the page, put each variant in its own `<section>` with an `<h2>`. Every `<h2>` automatically becomes a
   sub-section link in the sidebar.
6. Put each example in this wrapper:
   ```html
   <div class="sc-example" data-title="…">
       <div class="sc-preview">LIVE MARKUP</div>
   </div>
   ```
   There are **no "show code" panels**: the showcase is for the user to *see* elements, and agents read the
   page **source**. So the markup inside `.sc-preview` must be clean, minimal and copy-pasteable. Keep it to
   library classes, with demo-only inline styles kept to a minimum. Preview modifiers: `sc-preview--surface`
   (white background), `sc-preview--narrow` (300px), `sc-preview--center`. To show code as text (e.g. a `<link>` tag),
   use `<pre class="sc-snippet"><code>…</code></pre>`.
7. End every component page with a **Class reference** table
   (`<div class="kt-table-wrap sc-ref"><table class="kt-table">…`).
8. Add the component to the catalog table in `README.md`.
9. Check the page in light and dark mode (`?theme=dark`), and at phone width.

A new section (for example "Forms" or "Data display") is just a new `{ section, items }` entry in
`registry.js` and a matching folder under `pages/`.

## Build & distribution

- Consuming projects link **`https://koraytugay.github.io/kt-styles/dist/kt.min.css`** (one request).
- `dist/` is generated by `node scripts/build.mjs`. The `Build dist` GitHub Action runs it on every push to
  `main` that touches `css/` and commits the result, so after pushing, **pull before your next commit**
  (the bot may have added a "Build dist" commit).
- Running the build locally is optional (e.g. to commit `dist/` together with a change); the result is the same.
- The showcase pages link `css/kt.css` directly, so local edits show up immediately without building.
- The minifier is deliberately conservative (comments, whitespace, spaces after colons and around `{};,`).
  If you change it, verify that computed styles are identical between `css/kt.css` and `dist/kt.min.css`.

## Showcase JS features (showcase/showcase.js)

- `[data-token="--kt-x"]`: the element's text is set to the computed value of the token, and refreshed on theme toggle.
- `data-sc-target="#id"` on a `.kt-segmented` whose buttons carry `data-class="…"`: clicking a button swaps
  that class on the target. Use it for view-mode demos.
- Every `.kt-segmented` and `.kt-nav` inside a `.sc-preview` is made clickable automatically for demos. The
  library itself has no JS.
- `<h2 data-toc="Short label">`: overrides the heading's label in the sidebar.
- `?theme=dark` / `?theme=light` in the URL forces a theme.
- Prev/next links at the bottom of each page come from the order in the registry.

## Visual direction

Balanced contrast: a light grey page (`--kt-bg`) with white surfaces (10px radius) that stand out by background,
a medium-grey 1px edge (`--kt-border`), a lighter `--kt-divider` for lines inside a component, slightly darker
borders on controls (`--kt-border-strong`), dark text, **no shadows**. Neither washed out (near-invisible
borders) nor harsh (black borders everywhere),
near-black primary (inverted in dark mode), a single blue accent, bold small uppercase labels, compact density.

## Roadmap (candidates)

These come from a survey of the existing apps; each one appears in at least two of them:
Heatmap cells.
