/* ==========================================================================
   Showcase runtime — builds the docs chrome around every page.
   Load in <head> AFTER registry.js, without defer (so the theme is applied
   before first paint and there is no light/dark flash).

   Features
   - Theme: html[data-theme], persisted in localStorage, defaults to OS.
   - Shell: top bar + sidebar (from KT_REGISTRY) wrapped around <main>.
   - Sub-sections: every <h2> in <main> becomes an "on this page" link
     under the active sidebar item, with scroll-spy.
   - Examples: .sc-example > .sc-preview gets a title bar. No code panels:
     the page source IS the reference (agents read the HTML directly).
   - Tokens: [data-token="--kt-x"] elements display the variable's value.
   - Switchers: any element with data-sc-target="#id" whose buttons carry
     data-class swaps that class on the target (Grid / Compact / List demos).
   - Prev / next pager at the bottom of each page.
   ========================================================================== */
(function () {
    'use strict';

    const ROOT = new URL('../', document.currentScript.src);
    const THEME_KEY = 'kt-theme';

    /* ---------------- Theme (runs immediately) ---------------- */
    function storedTheme() {
        try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    }
    function systemTheme() {
        return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    const urlTheme = new URLSearchParams(location.search).get('theme');   // ?theme=dark for screenshots / links
    applyTheme(urlTheme || storedTheme() || systemTheme());

    function toggleTheme() {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
        refreshTokens();
    }

    /* ---------------- Helpers ---------------- */
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

    function h(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (k === 'class') el.className = v;
            else if (k === 'html') el.innerHTML = v;
            else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
            else el.setAttribute(k, v);
        }
        for (const c of [].concat(children)) {
            if (c != null) el.append(c);
        }
        return el;
    }

    function slugify(text) {
        return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    }

    function samePage(url) {
        const a = new URL(url, location.href);
        const strip = p => p.replace(/index\.html$/, '');
        return strip(a.pathname) === strip(location.pathname);
    }

    /* ---------------- Shell: top bar + sidebar ---------------- */
    function buildShell() {
        const main = $('main');
        if (!main) return;
        main.classList.add('sc-main');

        const registry = window.KT_REGISTRY || [];
        const flat = registry.flatMap(s => s.items.map(i => ({ ...i, section: s.section })));
        const current = flat.find(i => samePage(new URL(i.path, ROOT)));

        // Top bar
        const menuBtn = h('button', { class: 'sc-icon-btn sc-menu-btn', 'aria-label': 'Toggle navigation', onclick: () => document.body.classList.toggle('sc-nav-open') }, '☰');
        const themeBtn = h('button', { class: 'sc-icon-btn', 'aria-label': 'Toggle dark mode', title: 'Toggle dark mode', onclick: toggleTheme },
            [h('span', { class: 'sc-theme-light' }, '☀️'), h('span', { class: 'sc-theme-dark' }, '🌙')]);
        const topbar = h('header', { class: 'sc-topbar' }, [
            menuBtn,
            h('a', { class: 'sc-brand', href: new URL('index.html', ROOT).href }, [
                h('span', { class: 'sc-brand-mark' }, 'kt'),
                h('span', {}, 'kt-styles'),
            ]),
            h('span', { class: 'sc-topbar-spacer' }),
            current ? h('span', { class: 'sc-crumb' }, `${current.section} / ${current.title}`) : null,
            themeBtn,
        ]);

        // Sidebar
        const nav = h('nav', { class: 'sc-sidebar', 'aria-label': 'Showcase navigation' });
        for (const section of registry) {
            const list = h('ul', { class: 'sc-nav-list' });
            for (const item of section.items) {
                const href = new URL(item.path, ROOT).href;
                const active = item === current || (current && current.path === item.path);
                const link = h('a', { class: 'sc-nav-link' + (active ? ' active' : ''), href }, item.title);
                const li = h('li', {}, link);
                const toc = active ? buildToc(main) : null;
                if (toc) li.append(toc);
                list.append(li);
            }
            nav.append(h('div', { class: 'sc-nav-section' }, [
                h('div', { class: 'sc-nav-heading' }, section.section),
                list,
            ]));
        }

        // Pager
        if (current) {
            const idx = flat.indexOf(current);
            const prev = flat[idx - 1];
            const next = flat[idx + 1];
            const pager = h('nav', { class: 'sc-pager' }, [
                prev ? h('a', { class: 'sc-pager-link', href: new URL(prev.path, ROOT).href }, [h('span', { class: 'kt-eyebrow' }, '← Previous'), h('span', {}, prev.title)]) : h('span'),
                next ? h('a', { class: 'sc-pager-link sc-pager-link--next', href: new URL(next.path, ROOT).href }, [h('span', { class: 'kt-eyebrow' }, 'Next →'), h('span', {}, next.title)]) : h('span'),
            ]);
            main.append(pager);
        }

        const scrim = h('div', { class: 'sc-scrim', onclick: () => document.body.classList.remove('sc-nav-open') });
        const shell = h('div', { class: 'sc-shell' }, [nav, scrim]);
        main.parentNode.insertBefore(shell, main);
        shell.append(main);
        document.body.prepend(topbar);

        // Keep the active link visible in a long sidebar
        const activeLink = $('.sc-nav-link.active', nav);
        if (activeLink) activeLink.scrollIntoView({ block: 'nearest' });
    }

    /* ---------------- "On this page" from <h2> ---------------- */
    function buildToc(main) {
        const headings = $$('h2', main).filter(el => !el.closest('.sc-preview'));
        const toc = h('ul', { class: 'sc-toc' });
        for (const hd of headings) {
            const label = hd.dataset.toc || hd.textContent.trim();
            if (!hd.id) {
                let id = slugify(label), n = 2;
                while (document.getElementById(id)) id = `${slugify(label)}-${n++}`;
                hd.id = id;
            }
            // Anchor link on the heading itself
            hd.append(h('a', { class: 'sc-anchor', href: '#' + hd.id, 'aria-label': 'Link to section' }, '#'));
            toc.append(h('li', {}, h('a', { class: 'sc-toc-link', href: '#' + hd.id, onclick: () => document.body.classList.remove('sc-nav-open') }, label)));
        }
        if (!headings.length) return null;

        // Scroll-spy
        if ('IntersectionObserver' in window) {
            const links = new Map($$('.sc-toc-link', toc).map(a => [a.getAttribute('href').slice(1), a]));
            const visible = new Set();
            const obs = new IntersectionObserver(entries => {
                entries.forEach(e => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
                const firstVisible = headings.find(hd => visible.has(hd.id));
                if (firstVisible) {
                    links.forEach(a => a.classList.remove('active'));
                    links.get(firstVisible.id).classList.add('active');
                }
            }, { rootMargin: '-60px 0px -60% 0px' });
            headings.forEach(hd => obs.observe(hd));
        }
        return toc;
    }

    /* ---------------- Examples ---------------- */
    function buildExamples() {
        $$('.sc-example').forEach(ex => {
            ex.prepend(h('div', { class: 'sc-example-bar' },
                h('span', { class: 'sc-example-title' }, ex.dataset.title || 'Example')));
        });
    }

    /* ---------------- Token values ---------------- */
    function refreshTokens() {
        const styles = getComputedStyle(document.documentElement);
        $$('[data-token]').forEach(el => {
            const value = styles.getPropertyValue(el.dataset.token).trim();
            el.textContent = value || '—';
        });
    }

    /* ---------------- Class switchers ---------------- */
    function buildSwitchers() {
        // <div class="kt-segmented" data-sc-target="#id"><button data-class="…">…</button></div>
        $$('[data-sc-target]').forEach(sw => {
            const target = $(sw.dataset.scTarget);
            if (!target) return;
            const buttons = $$('button[data-class]', sw);
            const all = buttons.map(b => b.dataset.class).filter(Boolean);
            buttons.forEach(btn => btn.addEventListener('click', () => {
                all.forEach(c => target.classList.remove(c));
                if (btn.dataset.class) target.classList.add(btn.dataset.class);
                buttons.forEach(b => {
                    b.classList.toggle('is-active', b === btn);
                    b.setAttribute('aria-pressed', String(b === btn));
                });
            }));
        });
    }

    /* Make segmented controls inside demos clickable (library CSS has no JS) */
    function wireDemoSegmented() {
        $$('.sc-preview .kt-segmented, .sc-preview .kt-nav').forEach(group => {
            const items = $$(':scope > button, :scope > a', group);
            items.forEach(item => item.addEventListener('click', e => {
                if (item.tagName === 'A') e.preventDefault();
                items.forEach(i => {
                    const on = i === item;
                    i.classList.toggle('is-active', on);
                    if (i.tagName === 'BUTTON') i.setAttribute('aria-pressed', String(on));
                    else on ? i.setAttribute('aria-current', 'page') : i.removeAttribute('aria-current');
                });
            }));
        });
    }

    /* ---------------- Boot ---------------- */
    document.addEventListener('DOMContentLoaded', () => {
        buildExamples();     // before shell, so preview h2s are already wrapped
        buildShell();
        buildSwitchers();
        wireDemoSegmented();
        refreshTokens();
        if (location.hash) {
            const target = document.getElementById(location.hash.slice(1));
            if (target) target.scrollIntoView();
        }
    });
})();
