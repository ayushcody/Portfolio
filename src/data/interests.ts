import {
    Network,
    Database,
    BrainCircuit,
    ServerCrash,
    ShieldCheck,
    Cpu,
    Wrench,
    type LucideIcon,
} from "lucide-react";

// ============================================================================
// INTERESTS / SYSTEMS - Professional architecture focus areas
// ============================================================================

export type SystemEntry = {
    id: string;
    icon: LucideIcon;
    title: string;
    color: string;
    bg: string;
    desc: string;
    category?: "AI systems" | "Product engineering" | "Developer tooling" | "Security" | string;
    featured?: boolean;
};

export const systemsData: SystemEntry[] = [
    {
        id: "agentic",
        icon: Network,
        title: "Agentic AI Systems",
        color: "text-purple",
        bg: "bg-purple/10",
        desc: "Multi-step workflows with tool use, routing, validation, and review paths for practical automation.",
        category: "AI systems",
        featured: true,
    },
    {
        id: "rag",
        icon: Database,
        title: "RAG Architectures",
        color: "text-cyan",
        bg: "bg-cyan/10",
        desc: "Retrieval systems using embeddings, vector databases, grounding, and fallback behavior for more reliable generation.",
        category: "AI systems",
        featured: true,
    },
    {
        id: "voice-agents",
        icon: BrainCircuit,
        title: "Voice Agents",
        color: "text-orange",
        bg: "bg-orange/10",
        desc: "Conversation flows that collect structured information, handle uncertain answers, and keep user intent clear.",
        category: "AI systems",
        featured: true,
    },
    {
        id: "infra",
        icon: ServerCrash,
        title: "AI Infrastructure",
        color: "text-white",
        bg: "bg-white/10",
        desc: "Backend services, provider integrations, model-serving paths, and evaluation loops behind AI products.",
        category: "AI systems",
        featured: true,
    },
    {
        id: "fullstack",
        icon: Cpu,
        title: "Full-Stack AI Products",
        color: "text-purple",
        bg: "bg-purple/10",
        desc: "User-facing products with real APIs, auth, data state, deployment constraints, and integrated AI behavior.",
        category: "Product engineering",
        featured: true,
    },
    {
        id: "developer-tooling",
        icon: Wrench,
        title: "Developer Tooling",
        color: "text-orange",
        bg: "bg-orange/10",
        desc: "Small tools and systems that improve local development workflows, safety, and engineering speed.",
        category: "Developer tooling",
        featured: false,
    },
    {
        id: "security",
        icon: ShieldCheck,
        title: "Security Engineering",
        color: "text-cyan",
        bg: "bg-cyan/10",
        desc: "Threat modeling, secure API design, RBAC implementation, and AI-assisted security workflows.",
        category: "Security",
        featured: false,
    },
];
