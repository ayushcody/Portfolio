import {
    BrainCircuit,
    Database,
    Code2,
    Cpu,
    Cloud,
    ShieldCheck,
    Mic2,
    Server,
    type LucideIcon,
} from "lucide-react";

import type { Capability } from "./projectSchema";

// ============================================================================
// SKILL GROUPS - what each set of tools is for, aligned to project capabilities.
// /skills, the homepage toolkit, the hero specialties and /about read these.
// A tool is only shown when a visible project's stack or an experience entry
// mentions it (see getSkillGroups in lib/projects.ts), so this list may name
// candidates freely without overstating.
// ============================================================================

export type SkillGroup = {
    /** Anchor on /skills, e.g. /skills#voice-agents. */
    id: string;
    name: string;
    /** Projects carrying this capability are listed as proof. */
    capability?: Capability;
    /** Label for the hero specialties row; groups without one stay off the hero. */
    specialty?: string;
    /** One line: what Ayush uses these tools for. */
    use: string;
    /** Candidate tools, most used first. */
    tools: string[];
    /** Experience entry ids (src/data/experience.ts) where this work happens on the job. */
    roles?: string[];
};

export const skillGroups: SkillGroup[] = [
    {
        id: "voice-agents",
        name: "Voice agents",
        capability: "voice-agents",
        specialty: "Voice AI agents",
        use: "Phone and voice agents that understand the caller, speak naturally and act on the call.",
        tools: ["Retell", "Vapi", "ElevenLabs", "Dograh", "Gnani Prisma", "Gnani Timbre", "Vobiz", "Whisper", "Qwen3-TTS", "Kokoro-82M", "WhatsApp Business API"],
        roles: ["quensulting"],
    },
    {
        id: "agentic-workflows",
        name: "Agentic workflows",
        capability: "agentic-workflows",
        specialty: "Agentic workflows",
        use: "Multi-step LLM workflows that plan, call tools, hand work between agents and trigger real follow-ups.",
        tools: ["n8n", "LangGraph", "LangChain", "MCP", "A2A", "Gemini", "Groq", "Prompt engineering"],
        roles: ["quensulting", "persistent"],
    },
    {
        id: "rag",
        name: "RAG & retrieval",
        capability: "rag",
        specialty: "RAG systems",
        use: "Grounding answers in your own documents, with sources a person can open and check.",
        tools: ["Pinecone", "Qdrant", "Chroma", "ColQwen2", "RAG", "Llama-3.3-70b", "Gemini"],
        roles: ["persistent"],
    },
    {
        id: "llm-evaluation",
        name: "LLM evaluation & verification",
        capability: "llm-evaluation",
        specialty: "LLM evaluation pipelines",
        use: "Checking model output before anyone relies on it: scoring, validators, hallucination checks and drift monitoring.",
        tools: ["LLM evaluation", "Self-reflection scoring", "Rule-based validators", "Hallucination detection", "Drift monitoring", "Mistral Large"],
        roles: ["persistent"],
    },
    {
        id: "document-ai",
        name: "Document AI",
        capability: "document-ai",
        use: "Turning PDFs and scans into structured data, with every value traced back to the page.",
        tools: ["Docling", "ColQwen2", "Mistral OCR", "pdf.js", "Celery", "Gemini"],
    },
    {
        id: "local-inference",
        name: "Local inference",
        capability: "local-inference",
        use: "Running speech and language models on a laptop, measured, instead of renting a GPU.",
        tools: ["MLX", "PyTorch", "Whisper", "Qwen3-TTS", "Kokoro-82M"],
    },
    {
        id: "full-stack",
        name: "Full-stack product",
        capability: "full-stack",
        use: "The product around the model: interfaces, APIs, auth and data that hold up when a dependency fails.",
        tools: ["Next.js", "React", "TypeScript", "FastAPI", "Node.js", "Express", "Go", "Connect RPC", "PostgreSQL", "Supabase", "Prisma", "Firebase", "Firestore", "OAuth2", "Chrome Extension"],
        roles: ["syniris"],
    },
    {
        id: "languages-infrastructure",
        name: "Languages & infrastructure",
        use: "The languages I write every day and the plumbing that gets the work deployed and tested.",
        tools: ["Python", "TypeScript", "Go", "Google Cloud", "Celery", "CI workflows", "Postman", "API testing"],
        roles: ["persistent", "syniris"],
    },
];

// ============================================================================
// SKILLS / EXPERTISE - Practical, grouped skill model (résumé page and CMS)
// ============================================================================

export type SkillCategory = {
    name:
        | "AI/LLM Systems"
        | "Backend"
        | "Frontend"
        | "Data/Vector Search"
        | "Cloud/DevOps"
        | "Voice AI"
        | "Security"
        | string;
    summary: string;
    skills: string[];
    useCases: string[];
    featured?: boolean;
};

export type SkillCluster = SkillCategory & {
    // Backward compatibility for current components.
    category: string;
    icon: LucideIcon;
    description: string;
    /** Technology names - used to render logo chips or text fallbacks */
    technologies: string[];
    color: string;
    bg: string;
};

export const skillCategories: SkillCategory[] = [
    {
        name: "Languages",
        summary: "Languages used across AI pipelines, web applications, and data-processing projects.",
        skills: ["Python", "JavaScript", "TypeScript", "Go", "C", "C++", "SQL", "Java (beginner)"],
        useCases: ["AI and automation pipelines", "Typed web applications", "Fintech data processing", "Data structures and algorithms"],
    },
    {
        name: "Machine Learning",
        summary: "Applied projects in visual document understanding, computer vision, and time-series forecasting.",
        skills: ["PyTorch", "TensorFlow", "Scikit-Learn", "YOLOv8", "ColQwen2", "SARIMA"],
        useCases: ["Model training and fine-tuning", "Dataset preprocessing and augmentation", "Precision-recall evaluation", "Crop price forecasting"],
    },

    {
        name: "AI/LLM Systems",
        summary:
            "Building LLM-backed workflows with structured outputs, prompt iteration, evaluation, and practical guardrails.",
        skills: ["LangChain", "RAG", "Gemini", "OpenAI API", "Claude API", "Groq", "LLM evaluation"],
        useCases: [
            "Agentic workflows",
            "Prompt versioning and regression checks",
            "Structured generation for product features",
            "LLM-backed assistants and automation",
        ],
        featured: true,
    },
    {
        name: "Backend",
        summary:
            "Designing APIs, services, auth flows, and data pipelines that support real product behavior.",
        skills: ["Node.js", "FastAPI", "Go", "REST APIs", "JWT", "PostgreSQL"],
        useCases: [
            "AI product backends",
            "Secure API surfaces",
            "ETL and event-processing services",
            "Integration layers for third-party APIs",
        ],
        featured: true,
    },
    {
        name: "Frontend",
        summary:
            "Building usable product interfaces with typed React stacks, responsive layouts, and AI feature surfaces.",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Monaco Editor", "Shiki"],
        useCases: [
            "Portfolio and product UIs",
            "Interactive learning tools",
            "AI workflow dashboards",
            "Developer-facing interfaces",
        ],
        featured: true,
    },
    {
        name: "Data/Vector Search",
        summary:
            "Working with retrieval, embeddings, vector storage, model evaluation, and practical data workflows.",
        skills: ["Pinecone", "Embeddings", "PostgreSQL", "MongoDB", "Firestore", "Prisma"],
        useCases: [
            "RAG pipelines",
            "Citation-aware retrieval",
            "Research assistants",
            "Forecasting and ML data preparation",
        ],
        featured: true,
    },
    {
        name: "Cloud/DevOps",
        summary:
            "Deploying and maintaining projects with CI/CD, managed hosting, containers, and cloud-provider services.",
        skills: ["AWS", "GCP", "Azure", "Docker (fundamentals)", "GitHub Actions", "Vercel"],
        useCases: [
            "Production-minded deployments",
            "CI/CD workflows",
            "Environment setup",
            "Cloud-backed product prototypes",
        ],
        featured: false,
    },
    {
        name: "Voice AI",
        summary:
            "Designing voice-agent flows with practical conversation paths, validation, and fallback behavior.",
        skills: ["Retell", "Vapi", "Dograh", "ElevenLabs", "n8n", "WhatsApp Business API", "Qwen3"],
        useCases: [
            "Structured data collection through calls",
            "Fallback handling for repeated or unclear answers",
            "Voice-first AI product prototypes",
        ],
        featured: true,
    },
    {
        name: "Security",
        summary:
            "Practical exposure to web security testing and threat modeling, with introductory smart contract assessment experience.",
        skills: ["Threat modeling", "Postman", "Firebase Auth", "JWT", "Smart contracts (introductory)", "Git"],
        useCases: [
            "Threat modeling",
            "Role-based access control",
            "Secure API handling",
            "SIEM and alert-triage prototypes",
        ],
        featured: false,
    },
];

const iconByName: Record<SkillCategory["name"], LucideIcon> = {
    "AI/LLM Systems": BrainCircuit,
    Backend: Server,
    Frontend: Code2,
    "Data/Vector Search": Database,
    "Cloud/DevOps": Cloud,
    "Voice AI": Mic2,
    Security: ShieldCheck,
};

const themeByName: Record<SkillCategory["name"], { color: string; bg: string }> = {
    "AI/LLM Systems": { color: "text-purple", bg: "bg-purple/10" },
    Backend: { color: "text-cyan", bg: "bg-cyan/10" },
    Frontend: { color: "text-white", bg: "bg-white/10" },
    "Data/Vector Search": { color: "text-orange", bg: "bg-orange/10" },
    "Cloud/DevOps": { color: "text-cyan", bg: "bg-cyan/10" },
    "Voice AI": { color: "text-purple", bg: "bg-purple/10" },
    Security: { color: "text-orange", bg: "bg-orange/10" },
};

export const skillsData: SkillCluster[] = skillCategories.map((skill) => ({
    ...skill,
    category: skill.name,
    icon: iconByName[skill.name] ?? Cpu,
    description: skill.summary,
    technologies: skill.skills,
    color: themeByName[skill.name]?.color ?? "text-white",
    bg: themeByName[skill.name]?.bg ?? "bg-white/10",
}));

// ============================================================================
// INTERESTS / SYSTEMS - What Ayush focuses on architecturally
// ============================================================================

export { systemsData } from "./interests";
