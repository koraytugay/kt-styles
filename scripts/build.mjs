// Bundles css/kt.css and everything it @imports into single files:
//   dist/kt.css      readable, one file
//   dist/kt.min.css  comments and whitespace removed
//
// Usage: node scripts/build.mjs        (no dependencies; runs in CI on every push)
// Never edit dist/ by hand — edit css/ and rebuild.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entry = join(root, 'css', 'kt.css');

const IMPORT_RE = /@import\s+url\(\s*["']?([^"')]+)["']?\s*\)\s*;/g;

function inline(file, seen = new Set()) {
    if (seen.has(file)) throw new Error(`Circular @import: ${file}`);
    seen.add(file);
    const css = readFileSync(file, 'utf8');
    return css.replace(IMPORT_RE, (_, rel) => {
        const target = resolve(dirname(file), rel);
        const label = target.slice(root.length + 1);
        return `\n/* ---- ${label} ---- */\n` + inline(target, seen);
    });
}

// Conservative minifier: drop comments, collapse whitespace, trim around
// braces/semicolons/commas and after colons. Never touches spaces *before* a
// colon (that would change selectors like "a :hover") or inside calc().
function minify(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{};,])\s*/g, '$1')
        .replace(/:\s+/g, ':')
        .replace(/;}/g, '}')
        .trim();
}

const banner = `/*! kt-styles · generated from css/kt.css by scripts/build.mjs — do not edit */\n`;
const bundled = banner + inline(entry).trim() + '\n';

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'kt.css'), bundled);
writeFileSync(join(root, 'dist', 'kt.min.css'), banner + minify(bundled.slice(banner.length)) + '\n');

const kb = f => (readFileSync(join(root, 'dist', f)).length / 1024).toFixed(1) + ' KB';
console.log(`dist/kt.css ${kb('kt.css')} · dist/kt.min.css ${kb('kt.min.css')}`);
