import { ThumbsDown, ThumbsUp } from 'lucide-react';

/*
 * Original, text-first meme panels for blog posts, written in Markdown as a fenced block:
 *
 *   ```meme
 *   format: nah-yeah
 *   nah: Paste the whole manual into the prompt
 *   yeah: Retrieve the three paragraphs that answer the question
 *   ```
 *
 * Formats: stonks (title, caption), nah-yeah (nah, yeah), versus (left, right, optional
 * leftLabel/rightLabel) and dialogue (any "Speaker: line" pairs, in order).
 * Every panel is real text, so it stays readable to screen readers, search and copy-paste.
 */

type Line = { key: string; value: string };

function parse(source: string): { format: string; lines: Line[] } {
    const lines: Line[] = [];
    let format = 'dialogue';
    for (const raw of source.split('\n')) {
        const match = raw.match(/^\s*([^:]+?)\s*:\s*(.*)$/);
        if (!match) continue;
        const [, key, value] = match;
        if (key.toLowerCase() === 'format') format = value.trim().toLowerCase();
        else lines.push({ key, value: value.trim() });
    }
    return { format, lines };
}

const field = (lines: Line[], key: string) => lines.find((line) => line.key.toLowerCase() === key.toLowerCase())?.value ?? '';

function StonksChart() {
    return (
        <svg className="meme-stonks-chart" viewBox="0 0 240 120" aria-hidden="true">
            <path d="M0 30H240M0 60H240M0 90H240" className="meme-stonks-grid" />
            <polyline points="6,104 46,96 78,100 112,78 140,84 170,50 196,56 228,14" className="meme-stonks-line" />
            <path d="M228 14l-18 2 10 13z" className="meme-stonks-head" />
        </svg>
    );
}

export function MemeCard({ source }: { source: string }) {
    const { format, lines } = parse(source);

    if (format === 'stonks') {
        return (
            <figure className="meme meme--stonks">
                {field(lines, 'title') ? <p className="meme-stonks-title">{field(lines, 'title')}</p> : null}
                <div className="meme-stonks-board">
                    <StonksChart />
                    <strong className="meme-stonks-word">stonks</strong>
                </div>
                {field(lines, 'caption') ? <figcaption>{field(lines, 'caption')}</figcaption> : null}
            </figure>
        );
    }

    if (format === 'nah-yeah') {
        return (
            <figure className="meme meme--nah-yeah">
                <div className="meme-row meme-row--nah">
                    <span className="meme-verdict"><ThumbsDown size={22} aria-hidden="true" /> Nah</span>
                    <p>{field(lines, 'nah')}</p>
                </div>
                <div className="meme-row meme-row--yeah">
                    <span className="meme-verdict"><ThumbsUp size={22} aria-hidden="true" /> Yeah</span>
                    <p>{field(lines, 'yeah')}</p>
                </div>
            </figure>
        );
    }

    if (format === 'versus') {
        return (
            <figure className="meme meme--versus">
                <div className="meme-versus-grid">
                    <div>
                        <span className="meme-versus-label">{field(lines, 'leftLabel') || 'Expectation'}</span>
                        <p>{field(lines, 'left')}</p>
                    </div>
                    <div>
                        <span className="meme-versus-label">{field(lines, 'rightLabel') || 'Reality'}</span>
                        <p>{field(lines, 'right')}</p>
                    </div>
                </div>
            </figure>
        );
    }

    return (
        <figure className="meme meme--dialogue">
            <dl>
                {lines.map((line, index) => (
                    <div key={`${line.key}-${index}`}>
                        <dt>{line.key}:</dt>
                        <dd>{line.value || <span className="meme-silence">…</span>}</dd>
                    </div>
                ))}
            </dl>
        </figure>
    );
}
