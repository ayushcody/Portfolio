// Client-safe helpers for blog posts (lib/markdown.ts reads the filesystem and is server-only).
export type { BlogPostSummary } from './markdown';

/** "2026-06-01" -> "1 Jun 2026". Returns the raw value when it is not an ISO calendar date. */
export function formatPostDate(date: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return date;
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed);
}
