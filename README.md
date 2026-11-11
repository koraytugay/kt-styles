# kt-styles

A generic, dependency-free CSS design system, plus a live showcase of every element.
All of my websites use it, so they share one look.

**If you are an agent building a website and were told to "use kt-styles", read this whole file.**

## 1. Include it

```html
<link rel="stylesheet" href="<path-to>/kt-styles/css/kt.css">
```

That one file imports everything else. There is no JS to include.

If the project's server can't reach this folder (for example, it serves only its own directory), symlink it
in (`ln -s ../../kt-styles/css vendor/kt-styles`) or copy `css/` into the project. Don't fork the styles.

## 2. Rules for consuming projects

1. **Use kt classes and `--kt-*` variables for all styling.** Before writing any CSS, look for an existing
   class (see the catalog below and the showcase pages).
2. **Don't create local look-alikes.** If an element you need is missing or not quite right, don't invent it
   inside the project. Stop and tell the user, so it gets added to kt-styles first, then used.
3. Project-specific layout glue is OK only when it's trivial (a width, a one-off gap), and it must use tokens
   (`var(--kt-space-4)`, `var(--kt-border)`…), never raw colors or pixel font sizes.
4. **Never use colored side borders** (e.g. `border-left: 3px solid …`). Show status with badges.
5. Dark mode: set `<html data-theme="dark">`. Every kt element supports it automatically.

## 3. Catalog

The authoritative reference is the **Class reference** table at the bottom of each page in `pages/`.
Each CSS file in `css/components/` also starts with a markup example in its header comment.

| Area | Page | Main classes |
|---|---|---|
| Colors & tokens | `pages/foundations/colors.html` | `--kt-bg`, `--kt-surface*`, `--kt-text*` (colors), `--kt-border*`, `--kt-primary`, `--kt-accent*`, `--kt-{success,warning,danger,info}[-soft,-text]`, `--kt-space-*`, `--kt-radius-*`, `--kt-shadow-*`, `--kt-control-h*` |
| Fonts | `pages/foundations/fonts.html` | `--kt-font-sans`, `--kt-font-mono`, `--kt-fs-*` (sizes), `--kt-weight-*`, `.kt-num`, `.kt-mono` |
| Typography | `pages/foundations/typography.html` | `h1–h6`, `.kt-page-header`, `.kt-section-title`, `.kt-display`, `.kt-lead`, `.kt-eyebrow`, `.kt-caption`, `.kt-list`, `.kt-text-*` (color), `.kt-fs-*` (size), `.kt-fw-*`, `.kt-align-*`, `.kt-truncate`, `.kt-clamp-2`, `.kt-measure` |
| Layout | `pages/foundations/layout.html` | `.kt-container`, `.kt-grid` (+ `--compact`, `--list`, `--2/3/4`), `.kt-stack`, `.kt-cluster`, `.kt-split`, `.kt-ml-auto`, `.kt-mt-*`, `.kt-mb-*`, `.kt-m-0` |
| Badges | `pages/components/badges.html` | `.kt-badge` (+ color / `--soft-*` / `--pill`) |
| Buttons | `pages/components/buttons.html` | `.kt-btn` (+ `--primary`, `--accent`, `--ghost`, `--danger`, `--sm`, `--lg`, `--pill`, `--icon`, `--block`) |
| Cards | `pages/components/cards.html` | `.kt-card`, `.kt-stat` (+ `--inset`), `.kt-stat-row`, `.kt-media-card` |
| Chart furniture | `pages/components/chart.html` | `.kt-chart-layout` (`__plot`), `.kt-readout` (+ `.is-active`, `__header`, `__title`, `__value`, `__sub`, `__section`, `__row`, `__footer`, `__empty`), `.kt-legend` (`__item`, `__swatch` + `--line`/`--dash`) |
| Feedback | `pages/components/feedback.html` | `.kt-alert` (+ tones), `.kt-spinner`, `.kt-loading`, `.kt-empty` |
| Forms | `pages/components/forms.html` | `.kt-input`, `.kt-select`, `.kt-textarea`, `.kt-field`, `.kt-check`, `.kt-segmented`, `.kt-toolbar` |
| Key-value list | `pages/components/key-value.html` | `.kt-kv`, `.kt-kv__row` |
| Modal | `pages/components/modal.html` | `.kt-modal` (+ `.is-open`, `--sm`, `--lg`, `--center`), `__dialog`, `__header`, `__title`, `__close`, `__body`, `__footer` |
| Progress | `pages/components/progress.html` | `.kt-progress` (+ `--sm`, `--lg`, tones), `.kt-progress__bar` (`--kt-progress-color`) |
| Navigation | `pages/components/navigation.html` | `.kt-nav`, `.kt-nav__link` (`aria-current="page"`), `.kt-nav__row` |
| Tables | `pages/components/tables.html` | `.kt-table-wrap`, `.kt-table` (+ `--hover`, `--compact`, `--sticky`), `.kt-num` cells, `th[aria-sort]` |

**State conventions:** use ARIA attributes (`aria-current`, `aria-pressed`, `aria-sort`, `disabled`) or `.is-*`
classes (`.is-active`, `.is-invalid`, `.is-clickable`). The library is CSS only, so your script toggles them.

## 4. Minimal page

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My page</title>
    <link rel="stylesheet" href="../kt-styles/css/kt.css">
</head>
<body>
    <div class="kt-container">
        <header class="kt-page-header">
            <h1 class="kt-page-title">My page</h1>
            <p class="kt-page-subtitle">Subtitle</p>
        </header>
        <div class="kt-stat-row">
            <div class="kt-stat"><div class="kt-stat__value">12</div><div class="kt-stat__label">Total</div></div>
        </div>
    </div>
</body>
</html>
```

## Browsing the showcase

Open `index.html` in a browser, or run `python3 -m http.server` in this folder. Contributors (people or agents
working on this repo itself) should read [CLAUDE.md](CLAUDE.md).
