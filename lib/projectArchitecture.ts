import type { Project } from '@/src/data/projects';

/**
 * Minimal shape needed to infer a project's system layers. `Project` satisfies it, and so do
 * legacy objects that still carry `architecture` / `tech` (e.g. the old ProjectEntry shape).
 */
export type ArchitectureSource = Pick<Project, 'title'> &
    Partial<Pick<Project, 'category' | 'summary' | 'description' | 'techStack' | 'tags' | 'architectureHighlights'>> & {
        architecture?: string;
        tech?: string[];
    };

export type LayerTone = 'yellow' | 'lilac' | 'coral' | 'sage' | 'note' | 'paper';

export type ProjectLayer = {
    key: 'interface' | 'trust' | 'services' | 'data' | 'models' | 'delivery';
    label: string;
    /** Paper-system tone; always rendered with dark ink text. */
    tone: LayerTone;
    terms: readonly string[];
};

// Ordered as a request travels: interface -> trust -> services -> data -> models -> delivery.
export const projectLayerDefinitions: readonly ProjectLayer[] = [
    {
        key: 'interface',
        label: 'Interface',
        tone: 'yellow',
        terms: ['react', 'next.js', 'vite', 'tailwind', 'chrome extension', 'frontend', 'monaco', 'streamlit', 'svg', 'cli', 'tui', 'ui'],
    },
    {
        key: 'trust',
        label: 'Security & identity',
        tone: 'sage',
        terms: ['oauth', 'oauth2', 'auth', 'jwt', 'owasp', 'security', 'cybersecurity', 'siem', 'solidity', 'gmail api'],
    },
    {
        key: 'services',
        label: 'API & services',
        tone: 'note',
        terms: ['node.js', 'fastapi', 'express', 'api', 'apis', 'rest apis', 'backend', 'go', 'celery', 'judge0'],
    },
    {
        key: 'data',
        label: 'Retrieval & data',
        tone: 'coral',
        terms: ['rag', 'retrieval', 'pinecone', 'faiss', 'postgres', 'postgresql', 'firebase', 'firestore', 'redis', 'vector', 'vector search', 'embeddings', 'data', 'etl', 'kafka', 'prisma', 'supabase', 'pandas', 'time series'],
    },
    {
        key: 'models',
        label: 'AI & models',
        tone: 'lilac',
        terms: ['ai', 'llm', 'llms', 'gemini', 'groq', 'openai', 'langchain', 'llama', 'agent', 'agents', 'agentic', 'nlp', 'yolov8', 'qwen3', 'colqwen2', 'pytorch', 'tts', 'sarima', 'deep learning', 'computer vision'],
    },
    {
        key: 'delivery',
        label: 'Delivery',
        tone: 'paper',
        terms: ['docker', 'aws', 'azure', 'gcp', 'vercel', 'github actions', 'ci/cd', 'deployment', 'cross-platform'],
    },
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whole-word matching so "ai" does not match "email" and "go" does not match "algorithm".
const layerMatchers = projectLayerDefinitions.map((layer) => ({
    layer,
    pattern: new RegExp(`(^|[^a-z0-9])(${layer.terms.map(escapeRegExp).join('|')})(?=$|[^a-z0-9])`, 'i'),
}));

/** Layers a project touches, inferred from its category, stack, tags and architecture notes. */
export function getProjectSystemLayers(project: ArchitectureSource): ProjectLayer[] {
    const haystack = [
        project.category,
        project.summary,
        project.description,
        project.architecture,
        ...(project.techStack ?? []),
        ...(project.tech ?? []),
        ...(project.tags ?? []),
        ...(project.architectureHighlights ?? []),
    ]
        .filter(Boolean)
        .join(' \n ')
        .toLowerCase();

    if (!haystack) return [];
    return layerMatchers.filter(({ pattern }) => pattern.test(haystack)).map(({ layer }) => layer);
}
