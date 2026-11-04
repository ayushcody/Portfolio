/** Turns a Loom or YouTube share link into an embeddable player URL; null for anything else. */
export function videoEmbed(href: string): { src: string; provider: 'Loom' | 'YouTube' } | null {
    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return null;
    }

    const host = url.hostname.replace(/^www\./, '');

    if (host === 'loom.com') {
        const id = url.pathname.match(/^\/share\/([a-zA-Z0-9]+)/)?.[1];
        return id ? { src: `https://www.loom.com/embed/${id}`, provider: 'Loom' } : null;
    }

    const youtubeId =
        host === 'youtu.be' ? url.pathname.slice(1) :
        host === 'youtube.com' && url.pathname === '/watch' ? url.searchParams.get('v') :
        null;

    return youtubeId && /^[\w-]{6,}$/.test(youtubeId)
        ? { src: `https://www.youtube-nocookie.com/embed/${youtubeId}`, provider: 'YouTube' }
        : null;
}
