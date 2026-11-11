#!/usr/bin/env node
/**
 * Renders a recorded terminal session (real output, ANSI colours) as a terminal window and
 * screenshots it at 1440 wide, deviceScaleFactor 2. The font shrinks until the whole recording
 * fits, so nothing is cut off. Convert the PNG with cwebp afterwards (see SKILL.md, Step 3).
 *
 * Record first, with colour, from inside the project folder:
 *   script -q /dev/null sh -c '<command>' | perl -pe 's/\^D\x08\x08//g; s/\x04\x08\x08//g; s/\r//g' > session.ansi
 * (macOS `script` writes a literal "^D" plus two backspaces at the start; the perl strips it.)
 *
 * Usage:
 *   node .claude/skills/add-project/render_terminal.mjs <session.ansi> <out-path-without-ext> "<window title>" "<command shown after $>" [height]
 * Height: 900 for a cover; any value up to 1080 for a gallery image.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/Users/ayushchougula/Desktop/Ayush/Projects/Vasoli/node_modules/');
const { chromium } = require('playwright');
const COLORS = { 33: '#e5c07b', 34: '#61afef', 92: '#7ee787', 95: '#d2a8ff', 97: '#f0f0f0', 31: '#ff7b72', 32: '#7ee787', 36: '#79c0ff' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function ansiToHtml(text) {
  let out = '', open = 0;
  for (const part of text.split(/(\x1b\[[0-9;]*m)/)) {
    const m = part.match(/^\x1b\[([0-9;]*)m$/);
    if (!m) { out += esc(part); continue; }
    const codes = m[1].split(';').filter(Boolean).map(Number);
    if (codes.length === 0 || codes.includes(0)) { out += '</span>'.repeat(open); open = 0; }
    const style = [];
    for (const c of codes) { if (c === 1) style.push('font-weight:700;color:#fff'); if (c === 2) style.push('opacity:.55'); if (COLORS[c]) style.push(`color:${COLORS[c]}`); }
    if (style.length) { out += `<span style="${style.join(';')}">`; open++; }
  }
  return out + '</span>'.repeat(open);
}
const [, , input, output, title, prompt, height = '900'] = process.argv;
let body = fs.readFileSync(input, 'utf8').replace(/\s+$/, '');
if (prompt) body = `\x1b[1m$ ${prompt}\x1b[0m\n` + body;
const html = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;height:100%;background:#15161c}
.bar{height:48px;display:flex;align-items:center;justify-content:center;position:relative;background:#1d1f27;border-bottom:1px solid #2a2d38;color:#9aa0ac;font:13px -apple-system,system-ui,sans-serif}
.dots{position:absolute;left:20px;display:flex;gap:9px}.dots i{width:13px;height:13px;border-radius:50%;background:#3a3d48}
pre{margin:0;padding:30px 44px;color:#d6d9e0;font:var(--fs,17px)/1.55 "SF Mono",Menlo,Consolas,monospace;white-space:pre}
</style><div class="bar"><div class="dots"><i></i><i></i><i></i></div>${esc(title)}</div><pre>${ansiToHtml(body)}</pre>`;
fs.writeFileSync(output + '.html', html);
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: Number(height) }, deviceScaleFactor: 2 });
await page.goto('file://' + output + '.html');
// Shrink the font until the whole recorded output fits the window: nothing is cut off.
for (let fs_ = 17; fs_ >= 11; fs_ -= 0.5) {
  await page.evaluate((v) => document.documentElement.style.setProperty('--fs', v + 'px'), fs_);
  const fits = await page.evaluate(() => document.querySelector('pre').getBoundingClientRect().bottom <= window.innerHeight - 8);
  if (fits) { console.log(output, 'font', fs_); break; }
}
await page.screenshot({ path: output + '.png' });
await browser.close();
