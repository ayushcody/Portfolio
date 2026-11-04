// Post tags are stored lowercase-kebab-case in front matter (e.g. "ai-engineering"); this is how they read on the page.
const TAG_LABELS: Record<string, string> = {
    genai: 'GenAI',
    rag: 'RAG',
    mcp: 'MCP',
    mlx: 'MLX',
    'ai-engineering': 'AI Engineering',
    'local-ai': 'Local AI',
    'developer-tools': 'Developer Tools',
    nodejs: 'Node.js',
};

/** "ai-engineering" -> "AI Engineering"; unknown tags are title-cased word by word. */
export function tagLabel(tag: string): string {
    return TAG_LABELS[tag] ?? tag.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
