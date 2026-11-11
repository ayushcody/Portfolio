#!/usr/bin/env node
/**
 * Builds src/data/projectMedia.ts from public/projects/<slug>/media.json.
 *
 * media.json:
 *   {
 *     "cover":   { "file": "cover.webp", "alt": "…" },                 // 16:10, 1600×1000
 *     "gallery": [{ "file": "01-name.webp", "alt": "…", "caption": "…" }],  // 1600 wide
 *     "noVisualReason": "…"                                            // only when there is no cover
 *   }
 *
 * A folder that still has the older shots.json ([{ file, alt, caption }]) is read as a gallery
 * with no cover. The generated module records each image's pixel size (read from the PNG, JPEG
 * or WebP header) so pages reserve space and never shift.
 *
 * Usage: npm run media
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const projectsDir = path.join(root, 'public', 'projects');
const outFile = path.join(root, 'src', 'data', 'projectMedia.ts');

const COVER = { width: 1600, height: 1000 };
const GALLERY_WIDTH = 1600;
const GALLERY_MAX_HEIGHT = 1200;
const SOFT_LIMIT_BYTES = 200 * 1024;

/** Width and height from a PNG IHDR chunk, a JPEG SOF marker or a WebP VP8/VP8L/VP8X chunk. */
function imageSize(file) {
    const buffer = fs.readFileSync(file);
    if (buffer.readUInt32BE(0) === 0x89504e47) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
        const chunk = buffer.toString('ascii', 12, 16);
        if (chunk === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
        if (chunk === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
        if (chunk === 'VP8L') {
            const bits = buffer.readUInt32LE(21);
            return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
        }
    }
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        let offset = 2;
        while (offset < buffer.length) {
            if (buffer[offset] !== 0xff) { offset += 1; continue; }
            const marker = buffer[offset + 1];
            const length = buffer.readUInt16BE(offset + 2);
            // SOF0–SOF15, except DHT (C4), JPG (C8) and DAC (CC).
            if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
                return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
            }
            offset += 2 + length;
        }
    }
    throw new Error(`Unsupported or corrupt image: ${file}`);
}

const problems = [];
const warnings = [];
const media = {};

function readImage(slug, entry, where, { needCaption }) {
    for (const key of ['file', 'alt', ...(needCaption ? ['caption'] : [])]) {
        if (!entry?.[key]?.trim()) problems.push(`${where}: missing ${key}`);
    }
    const file = path.join(projectsDir, slug, entry?.file ?? '');
    if (!entry?.file || !fs.existsSync(file)) {
        problems.push(`${where}: ${entry?.file} does not exist`);
        return null;
    }
    const bytes = fs.statSync(file).size;
    if (bytes > SOFT_LIMIT_BYTES) warnings.push(`${where}: ${entry.file} is ${Math.round(bytes / 1024)} KB (aim for ≤ ${SOFT_LIMIT_BYTES / 1024} KB)`);
    const image = { src: `/projects/${slug}/${entry.file}`, alt: entry.alt.trim(), ...imageSize(file) };
    if (entry.caption?.trim()) image.caption = entry.caption.trim();
    return image;
}

const slugs = fs.existsSync(projectsDir) ? fs.readdirSync(projectsDir).filter((name) => fs.statSync(path.join(projectsDir, name)).isDirectory()).sort() : [];

for (const slug of slugs) {
    const dir = path.join(projectsDir, slug);
    const mediaFile = path.join(dir, 'media.json');
    const shotsFile = path.join(dir, 'shots.json');

    if (fs.existsSync(mediaFile)) {
        const spec = JSON.parse(fs.readFileSync(mediaFile, 'utf8'));
        const entry = { gallery: [] };
        if (spec.cover) {
            const cover = readImage(slug, spec.cover, `${slug}/media.json cover`, { needCaption: false });
            if (cover && (cover.width !== COVER.width || cover.height !== COVER.height)) {
                problems.push(`${slug}/media.json cover: ${cover.width}×${cover.height}, expected ${COVER.width}×${COVER.height}`);
            }
            if (cover) entry.cover = cover;
        } else if (!spec.noVisualReason?.trim()) {
            problems.push(`${slug}/media.json: no cover and no noVisualReason`);
        }
        entry.gallery = (spec.gallery ?? [])
            .map((item, index) => {
                const image = readImage(slug, item, `${slug}/media.json gallery[${index}]`, { needCaption: true });
                if (image && image.width !== GALLERY_WIDTH) warnings.push(`${slug}/media.json gallery[${index}]: ${image.width} px wide, expected ${GALLERY_WIDTH}`);
                if (image && image.height > GALLERY_MAX_HEIGHT) warnings.push(`${slug}/media.json gallery[${index}]: ${image.height} px tall (aim for ≤ ${GALLERY_MAX_HEIGHT})`);
                return image;
            })
            .filter(Boolean);
        if (spec.noVisualReason?.trim()) entry.noVisualReason = spec.noVisualReason.trim();
        // Images left in the folder that media.json no longer points at are dead weight in public/.
        const referenced = new Set([spec.cover?.file, ...(spec.gallery ?? []).map((item) => item?.file)].filter(Boolean));
        for (const name of fs.readdirSync(dir)) {
            if (/\.(webp|png|jpe?g)$/i.test(name) && !referenced.has(name)) warnings.push(`${slug}: ${name} is not referenced by media.json`);
        }
        if (fs.existsSync(shotsFile)) warnings.push(`${slug}: shots.json is ignored because media.json exists`);
        media[slug] = entry;
    } else if (fs.existsSync(shotsFile)) {
        const list = JSON.parse(fs.readFileSync(shotsFile, 'utf8'));
        media[slug] = { gallery: list.map((item, index) => readImage(slug, item, `${slug}/shots.json[${index}]`, { needCaption: true })).filter(Boolean) };
        warnings.push(`${slug}: still on shots.json (no cover yet)`);
    }
}

if (warnings.length) console.warn(warnings.join('\n'));
if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
}

const body = `// Generated by scripts/build_project_media.mjs from public/projects/<slug>/media.json. Do not edit by hand.
import type { ProjectMediaSet } from "./projectSchema";

export const projectMedia: Record<string, ProjectMediaSet> = ${JSON.stringify(media, null, 4)};
`;
fs.writeFileSync(outFile, body);
console.log(`Wrote ${path.relative(root, outFile)}: ${Object.entries(media).map(([slug, entry]) => `${slug} (${entry.cover ? 'cover + ' : ''}${entry.gallery.length})`).join(', ') || 'no projects'}`);
