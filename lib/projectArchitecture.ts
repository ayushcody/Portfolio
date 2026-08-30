import type { ProjectEntry } from '@/config/portfolio';

export const projectLayerDefinitions = [
    {
        label: 'Interface',
        shortLabel: 'UI',
        tone: 'border-cyan/25 bg-cyan/10 text-cyan',
        dot: 'bg-cyan',
        terms: ['react', 'next.js', 'tailwind', 'chrome extension', 'frontend', 'monaco', 'streamlit'],
    },
    {
        label: 'Security & Identity',
        shortLabel: 'Trust',
        tone: 'border-lime/25 bg-lime/10 text-lime',
        dot: 'bg-lime',
        terms: ['oauth', 'auth', 'jwt', 'owasp', 'security', 'solidity', 'gmail api'],
    },
    {
        label: 'API & Services',
        shortLabel: 'API',
        tone: 'border-purple/25 bg-purple/10 text-purple',
        dot: 'bg-purple',
        terms: ['node.js', 'fastapi', 'api', 'backend', 'go', 'express'],
    },
    {
        label: 'Retrieval & Data',
        shortLabel: 'Data',
        tone: 'border-orange/25 bg-orange/10 text-orange',
        dot: 'bg-orange',
        terms: ['rag', 'retrieval', 'pinecone', 'faiss', 'postgres', 'firebase', 'redis', 'vector', 'data'],
    },
    {
        label: 'AI Orchestration',
        shortLabel: 'AI',
        tone: 'border-pink/25 bg-pink/10 text-pink',
        dot: 'bg-pink',
        terms: ['ai', 'llm', 'gemini', 'groq', 'openai', 'langchain', 'llama', 'agent', 'nlp', 'yolo'],
    },
    {
        label: 'Delivery',
        shortLabel: 'Ship',
        tone: 'border-white/15 bg-white/[0.06] text-white/75',
        dot: 'bg-white/70',
        terms: ['docker', 'aws', 'azure', 'gcp', 'vercel', 'github actions', 'ci/cd', 'deployment'],
    },
] as const;

export function getProjectSystemLayers(project: ProjectEntry) {
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
        .join(' ')
        .toLowerCase();

    return projectLayerDefinitions.filter((layer) => layer.terms.some((term) => haystack.includes(term))).slice(0, 6);
}
