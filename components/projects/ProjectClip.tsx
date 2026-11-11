import type { ProjectClip as Clip } from '@/src/data/projectSchema';
import '@/components/projects.css';

/**
 * A short real recording on a case study (for Vakya, a phone call). The video loads nothing until
 * it is played (preload="none"), so it costs a poster image on page load. Its subtitles are part of
 * the picture; the transcript below covers anyone who can't play or hear it.
 */
export function ProjectClip({ title, clip }: { title: string; clip: Clip }) {
    return (
        <section id="clip" className="case-showcase case-clip" aria-labelledby="case-clip-heading">
            <div className="case-showcase-head">
                <h2 id="case-clip-heading">{clip.label}</h2>
                <p>{clip.duration} · sound on.</p>
            </div>
            <figure className="shot shot--lead">
                <div className="case-clip-frame">
                    <video
                        controls
                        preload="none"
                        playsInline
                        poster={clip.poster}
                        width={clip.width}
                        height={clip.height}
                        style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
                        aria-label={`${title}: ${clip.label}, ${clip.duration}`}
                        aria-describedby="case-clip-caption"
                    >
                        <source src={clip.src} type="video/mp4" />
                        <a href={clip.src}>Download the clip</a>
                    </video>
                </div>
                <figcaption id="case-clip-caption">
                    <span className="shot-index" aria-hidden="true">▶</span>
                    <span>{clip.caption}</span>
                </figcaption>
            </figure>
            {clip.transcript?.length ? (
                <details className="case-clip-transcript">
                    <summary>Read the transcript</summary>
                    <dl>
                        {clip.transcript.map((line, index) => (
                            <div key={index}>
                                <dt>{line.speaker}</dt>
                                <dd>{line.text}</dd>
                            </div>
                        ))}
                    </dl>
                </details>
            ) : null}
        </section>
    );
}
