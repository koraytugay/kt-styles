/* ==========================================================================
   Showcase registry — the ONE place that defines the sidebar navigation.

   To add a page:
     1. Copy pages/_template.html to pages/<section>/<name>.html
     2. Add an entry below under the right section.
   Sub-sections (the indented links under the active page) are generated
   automatically from every <h2> inside the page's <main>.

   Paths are relative to the kt-styles root.
   ========================================================================== */
window.KT_REGISTRY = [
    {
        section: 'Getting Started',
        items: [
            { title: 'Overview', path: 'index.html' },
        ],
    },
    {
        section: 'Foundations',
        items: [
            { title: 'Colors', path: 'pages/foundations/colors.html' },
            { title: 'Fonts', path: 'pages/foundations/fonts.html' },
            { title: 'Typography', path: 'pages/foundations/typography.html' },
            { title: 'Layout', path: 'pages/foundations/layout.html' },
        ],
    },
    {
        section: 'Components',
        items: [
            { title: 'Badges', path: 'pages/components/badges.html' },
            { title: 'Buttons', path: 'pages/components/buttons.html' },
            { title: 'Cards', path: 'pages/components/cards.html' },
            { title: 'Feedback', path: 'pages/components/feedback.html' },
            { title: 'Forms', path: 'pages/components/forms.html' },
            { title: 'Key-value list', path: 'pages/components/key-value.html' },
            { title: 'Navigation', path: 'pages/components/navigation.html' },
            { title: 'Tables', path: 'pages/components/tables.html' },
        ],
    },
];
