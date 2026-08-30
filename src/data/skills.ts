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

// ============================================================================
// SKILLS / EXPERTISE - Practical, grouped skill model
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
        name: "AI/LLM Systems",
        summary:
            "Building LLM-backed workflows with structured outputs, prompt iteration, evaluation, and practical guardrails.",
        skills: ["LangChain", "OpenAI", "Azure OpenAI", "Gemini", "Groq", "Hugging Face"],
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
        skills: ["Pinecone", "FAISS", "PostgreSQL", "Redis", "Pandas", "NumPy"],
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
        skills: ["AWS", "GCP", "Azure", "Docker", "GitHub Actions", "Vercel"],
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
        skills: ["Voice agents", "Conversation design", "Prompt routing", "Validation flows"],
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
            "Applying security fundamentals to web apps, auth, API handling, and AI-assisted security workflows.",
        skills: ["OWASP", "Postman", "Firebase Auth", "JWT", "Solidity", "Git"],
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
