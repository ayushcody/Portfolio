import {
    Mail,
    Scale,
    BookOpen,
    Code2,
    GraduationCap,
    ShieldCheck,
    BadgeDollarSign,
    Microscope,
    Sprout,
    TerminalSquare,
    type LucideIcon,
} from "lucide-react";

// ============================================================================
// PROJECTS - Verified project data and backward-compatible portfolio entries
// ============================================================================

export type ProjectStatus = "Live" | "Prototype" | "Case Study" | "Archived";

export type ProjectCategory =
    | "Agentic AI"
    | "RAG Systems"
    | "Voice AI"
    | "AI Infrastructure"
    | "Full-Stack Product"
    | "Developer Tooling"
    | "Labs"
    | "Archive";

// Every link is optional; empty links are never rendered. Editable in /admin.
export type ProjectLinkSet = {
    /** Deployed / production URL. Rendered as the primary action. */
    live?: string;
    github?: string;
    /** Loom walkthrough (https://www.loom.com/share/...). */
    loom?: string;
    documentation?: string;
    caseStudy?: string;
    /** Legacy fields kept for existing content. */
    demo?: string;
    video?: string;
};

export type ProjectVisuals = {
    /** Hero image for the case study (16:10). URL or /public path. */
    thumbnail?: string;
    thumbnailAlt?: string;
    /** Optional gallery (16:10). */
    screenshots?: string[];
};

export type Project = {
    id: string;
    title: string;
    shortTitle?: string;
    category: ProjectCategory | string;
    year?: string;
    status: ProjectStatus;
    featured: boolean;
    showOnHome: boolean;
    archived: boolean;
    /** Left out of the site entirely (not even the archive), e.g. while the code can't be shared. */
    hidden?: boolean;
    priority: number;

    summary: string;
    oneLine?: string;
    problem?: string;
    solution?: string;
    myRole?: string;

    techStack: string[];
    tags: string[];

    architectureHighlights: string[];
    features?: string[];
    impact: string[];
    challenges: string[];
    learnings: string[];
    nextSteps?: string[];

    links: ProjectLinkSet;
    visuals?: ProjectVisuals;

    // Backward compatibility for existing components.
    description?: string;
    stack?: string[];
    github?: string;
    live?: string;
};

export type LegacyProjectFields = {
    proofPoint: string;
    architecture: string;
    tech: string[];
    highlights: string[];
    demo: string;
    icon: LucideIcon;
    color: string;
    bg: string;
};

// Current components and Firebase mapping still use this lighter shape.
export type ProjectEntry = Pick<Project, "id" | "title" | "category"> &
    Partial<Project> &
    LegacyProjectFields & {
        description: string;
        problem: string;
        github?: string;
    };

type PortfolioProject = Project & LegacyProjectFields & {
    description: string;
    problem: string;
};

function project(project: PortfolioProject): PortfolioProject {
    return {
        ...project,
        description: project.description ?? project.summary,
        stack: project.stack ?? project.techStack,
        github: project.links.github,
        live: project.links.live,
        demo: project.links.demo ?? "",
        tech: project.tech ?? project.techStack,
        highlights: project.highlights ?? project.architectureHighlights,
    };
}

export const projectsData: PortfolioProject[] = [
    project({
        id: "email-digital-twin",
        title: "Email Digital Twin",
        shortTitle: "Email Twin",
        category: "Agentic AI",
        status: "Prototype",
        featured: true,
        showOnHome: true,
        archived: false,
        priority: 1,
        summary:
            "Analyzes sent-email history to model tone, formality, and structure, then generates reply drafts that mirror the user's communication style.",
        oneLine: "AI-powered email persona and draft engine for Gmail workflows.",
        problem:
            "Generic AI email replies rarely match a person's actual writing habits, creating drafts that require heavy editing before they feel usable.",
        solution:
            "A Chrome Extension and Node.js backend authorize Gmail access, analyze sent-mail writing signals, and generate multiple draft styles with Gemini.",
        myRole:
            "Designed the product flow, OAuth-backed email analysis path, backend integration, and prompt structure for reply generation.",
        techStack: ["Chrome Extension", "Node.js", "OAuth2", "Gmail API", "Gemini", "NLP"],
        tags: ["AI email", "Gmail API", "Persona modeling", "Prompting"],
        architecture:
            "Chrome Extension with a Node.js backend. OAuth2 authorizes Gmail access, sent mail is analyzed for behavioral writing signals, and Gemini generates Formal, Concise, Casual, and Context-Adjusted variants.",
        architectureHighlights: [
            "OAuth2-backed Gmail integration",
            "Recursive MIME extraction and PII-safe writing-persona analysis",
            "Multiple draft variants for different reply contexts",
        ],
        features: [
            "Email history analysis",
            "Tone and formality modeling",
            "Formal, concise, casual, and context-adjusted drafts",
        ],
        impact: [
            "Built a working prototype for personalized AI email drafting.",
            "Integrated real Gmail API access instead of relying on pasted sample text.",
            "Made generated drafts easier to compare by producing multiple variants.",
        ],
        challenges: [
            "Keeping AI-generated replies useful without overstating persona accuracy.",
            "Handling private email data through an explicit OAuth-based flow.",
        ],
        learnings: [
            "Personalized AI products need clear user control and fallback paths.",
            "Prompt quality improves when generation is grounded in concrete behavior signals.",
        ],
        nextSteps: ["Add stronger privacy controls and explicit local/remote processing boundaries."],
        links: { github: "https://github.com/ayushcody/emailDigitalTwin", loom: "https://www.loom.com/share/31e147285d0546b7a64b4f1d5365c26d" },
        description:
            "Analyzes sent-email history to model tone, formality, and structure, then generates reply drafts that mirror the user's actual communication style.",
        proofPoint: "Chrome Extension · OAuth2 Gmail API · 4 draft variants · Gemini LLM",
        tech: ["Chrome Extension", "Node.js", "OAuth2", "Gmail API", "Gemini", "NLP"],
        highlights: [
            "Builds a behavioral model from sent-email history",
            "Generates four reply variants instead of one generic draft",
            "Uses real Gmail API integration rather than pasted sample text",
        ],
        demo: "",
        icon: Mail,
        color: "text-purple",
        bg: "bg-purple/10",
    }),
    project({
        id: "andhakaanun",
        title: "AndhaKaanun",
        category: "RAG Systems",
        status: "Case Study",
        featured: true,
        showOnHome: true,
        archived: false,
        priority: 2,
        summary:
            "Generates dual-perspective prosecution and defense arguments from incident descriptions, grounded in Indian law and citation-aware retrieval.",
        oneLine: "Jurisdiction-aware AI legal reasoning platform using Indian-law retrieval.",
        problem:
            "Most legal AI tools give broad answers without jurisdictional grounding, explicit opposing arguments, or enough context to refine weak legal claims.",
        solution:
            "A RAG pipeline retrieves Indian-law context, passes it into an LLM reasoning flow, and asks follow-up questions when facts are missing.",
        myRole:
            "Designed the RAG flow, legal context framing, dual-perspective output structure, and missing-facts interaction model.",
        techStack: ["RAG", "Pinecone", "Groq", "Llama-3.3-70b", "Indian Law", "FastAPI"],
        tags: ["RAG", "Legal AI", "Pinecone", "Grounded generation"],
        architecture:
            "Incident descriptions enter a RAG pipeline backed by Pinecone. Retrieved Indian-law context is passed to Groq/Llama-3.3-70b to produce prosecution and defense reasoning, followed by an interactive engine that asks for missing legal facts.",
        architectureHighlights: [
            "Vector retrieval over Indian-law context",
            "Separate prosecution and defense reasoning paths",
            "Follow-up question loop for missing legal facts",
        ],
        features: [
            "Incident intake",
            "Citation-aware retrieval context",
            "Dual argument generation",
            "Missing fact prompts",
        ],
        impact: [
            "Built a case-study-ready RAG architecture for jurisdiction-aware legal reasoning.",
            "Improved output usefulness by forcing both sides of the argument to be represented.",
        ],
        challenges: [
            "Avoiding broad legal claims without enough retrieval context.",
            "Separating legal reasoning support from legal advice.",
        ],
        learnings: [
            "RAG systems need domain-specific guardrails and uncertainty handling.",
            "Opposing-perspective generation can expose weak or missing assumptions.",
        ],
        links: { github: "https://github.com/ayushcody/andhakaanun" },
        description:
            "Generates dual-perspective prosecution and defense arguments from incident descriptions, grounded in Indian law and citation-aware retrieval.",
        proofPoint: "Indian law RAG · IPC grounding · Pinecone · Groq/Llama-3.3-70b",
        tech: ["RAG", "Pinecone", "Groq", "Llama-3.3-70b", "Indian Law", "FastAPI"],
        highlights: [
            "Produces both prosecution and defense argument structures",
            "Grounds outputs in IPC-oriented retrieval context",
            "Follow-up engine identifies missing facts that affect legal reasoning",
        ],
        demo: "",
        icon: Scale,
        color: "text-cyan",
        bg: "bg-cyan/10",
    }),
    project({
        id: "dsakarle",
        title: "DSAKarle",
        category: "Full-Stack Product",
        status: "Prototype",
        featured: true,
        showOnHome: true,
        archived: false,
        priority: 3,
        summary:
            "Step-by-step DSA walkthroughs where JSON state objects drive synchronized SVG animation, variable tracing, and code highlighting.",
        oneLine: "Interactive algorithm visualization platform for learning DSA execution.",
        problem:
            "Traditional DSA learning resources are static and fail to convey how algorithms execute step-by-step on real data structures.",
        solution:
            "A JSON-driven stepper engine synchronizes SVG visuals, code highlights, variable state, and searchable lesson content.",
        myRole:
            "Built the Next.js architecture, content schema, visualization state model, and search/indexing flow.",
        techStack: ["Next.js", "TypeScript", "Framer Motion", "Fuse.js", "Zod", "Shiki"],
        tags: ["Education", "Visualization", "Algorithms", "TypeScript"],
        architecture:
            "Next.js app with a JSON-driven stepper engine. Each algorithm is defined as discrete validated state objects that synchronize SVG visualizations, code highlighting, and variable tracing.",
        architectureHighlights: [
            "Validated JSON state model for algorithm steps",
            "Synchronized SVG visualization and code highlighting",
            "Build-time search index for fast content lookup",
        ],
        features: ["Algorithm steppers", "Variable tracing", "Code highlighting", "Search"],
        impact: [
            "Built a structured learning product for visualizing algorithms step by step.",
            "Used schema validation to make complex educational content easier to maintain.",
            "Authored 25+ DSA topics with 300+ micro-steps.",
        ],
        challenges: [
            "Keeping visual state, code state, and explanatory content synchronized.",
            "Designing reusable state objects across different algorithm families.",
        ],
        learnings: [
            "Interactive education products benefit from treating content as typed data.",
            "Schema-first content makes future algorithm additions less fragile.",
        ],
        links: { github: "https://github.com/ayushcody/dsakarle" },
        description:
            "Step-by-step DSA walkthroughs where JSON state objects drive synchronized SVG animation, variable tracing, and code highlighting.",
        proofPoint: "25+ topics · 300+ micro-steps · Build-time search index",
        tech: ["Next.js", "TypeScript", "Framer Motion", "Fuse.js", "Zod", "Shiki"],
        highlights: [
            "Build-time Fuse.js indexing moves search preparation out of the browser",
            "Zod schema validation keeps algorithm content consistent",
            "SVG animation and code highlighting stay in sync through each state",
        ],
        demo: "",
        icon: Code2,
        color: "text-white",
        bg: "bg-white/10",
    }),
    project({
        id: "research-saathi",
        title: "Research Saathi",
        category: "RAG Systems",
        year: "2026",
        status: "Case Study",
        featured: true,
        showOnHome: true,
        archived: false,
        priority: 4,
        summary: "A research assistant that turns a question and a set of PDFs or web pages into a grounded answer, then checks every claim in it against the retrieved evidence.",
        oneLine: "Grounded research answers, with every claim checked against the sources.",
        problem: "Research workflows often fragment across PDFs, notes, web searches, and summaries, making citation tracking and factual grounding difficult.",
        solution: "A LangGraph pipeline plans the research, ingests PDFs and URLs, indexes them, retrieves evidence, writes an answer using only that evidence, and runs a separate verifier over each claim.",
        myRole: "Designed the workflow, the evidence-only synthesis and verification prompts, the retrieval fallback, and run storage.",
        techStack: ["Python", "LangGraph", "Gemini", "Chroma", "SQLite", "Streamlit"],
        tags: ["Research assistant", "RAG", "Verification", "LangGraph"],
        architecture: "A fixed LangGraph pipeline runs plan, ingest, index, retrieve, synthesize and verify in order. Sources are chunked and embedded into Chroma; when vector search is unavailable, retrieval falls back to keyword search over the chunks stored in SQLite. Every run, plan, source and verdict is saved, so a run can be reopened from History.",
        architectureHighlights: ["Planner, synthesizer and verifier as separate model calls", "Evidence labels (S1, S2, …) shared by the answer and the verifier", "Keyword search over SQLite when vector search fails"],
        features: ["PDF and URL ingestion", "Five output formats, from summary to interview prep", "Claim-by-claim verification", "Saved run history"],
        impact: ["Each claim gets a verdict (supported, weak support or unsupported) with the evidence labels it relied on.", "Runs are stored, so any answer can be traced back to its sources later."],
        challenges: ["Keeping the model inside the retrieved evidence instead of its own knowledge.", "Keeping retrieval working when the embeddings service fails."],
        learnings: ["A verifier is more useful when it flags problems than when it quietly rewrites the answer.", "Stored runs are only useful when source provenance is preserved."],
        nextSteps: ["Fix the embeddings call so vector search runs instead of the keyword fallback.", "Reuse already-ingested URLs instead of returning an empty answer on a repeat run."],
        links: {},
        description: "A research assistant that turns a question and a set of PDFs or web pages into a grounded answer, then checks every claim in it against the retrieved evidence.",
        proofPoint: "LangGraph pipeline · Evidence-only answers · Claim verifier",
        tech: ["Python", "LangGraph", "Gemini", "Chroma", "SQLite", "Streamlit"],
        highlights: ["Planner, synthesizer and verifier as separate model calls", "Evidence labels (S1, S2, …) shared by the answer and the verifier", "Keyword search over SQLite when vector search fails"],
        demo: "",
        icon: BookOpen,
        color: "text-orange",
        bg: "bg-orange/10",
    }),
    project({
        id: "synergylearn",
        title: "SynergyLearn",
        category: "Full-Stack Product",
        status: "Prototype",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 5,
        summary:
            "End-to-end learning platform with sandboxed code execution, in-browser IDE, AI hints, real-time progress tracking, and gamification.",
        oneLine: "Full-stack AI learning platform with IDE, code execution, and progress sync.",
        problem:
            "Learning platforms often separate lessons, coding, feedback, and progress tracking into disconnected experiences.",
        solution:
            "A React and Firebase platform combines auth, progress tracking, Monaco editing, Judge0 execution, and Gemini hints.",
        myRole:
            "Worked across frontend, backend integrations, auth, progress state, and AI hinting flows.",
        techStack: ["React", "Firebase", "Gemini", "Judge0", "Monaco Editor", "Firestore"],
        tags: ["Learning platform", "AI hints", "Code execution", "Firebase"],
        architecture:
            "React frontend with Firebase Auth and Firestore progress tracking. Monaco powers the IDE, Judge0 executes code in a sandbox, and Gemini provides contextual hints with graceful fallbacks for external dependency failures.",
        architectureHighlights: [
            "Firebase Auth and Firestore progress sync",
            "Monaco IDE with Judge0 sandbox execution",
            "Gemini hints with graceful dependency fallbacks",
        ],
        features: ["In-browser IDE", "AI hints", "Progress sync", "Gamified learning"],
        impact: [
            "Integrated lessons, code execution, hints, and progress into one product flow.",
            "Improved reliability through fallback handling around external AI and execution APIs.",
        ],
        challenges: [
            "Handling external service failures without breaking the learning session.",
            "Keeping coding feedback useful without over-relying on AI hints.",
        ],
        learnings: [
            "Full-stack AI products need reliable non-AI fallbacks.",
            "Progress and feedback loops are central to learning-product UX.",
        ],
        links: { github: "https://github.com/ayushcody/Learning", loom: "https://www.loom.com/share/f8bde39155014a3e8241c6cbc84ec5cb" },
        description:
            "End-to-end learning platform with sandboxed code execution, in-browser IDE, AI hints, real-time progress tracking, and gamification.",
        proofPoint: "Judge0 sandbox · Monaco IDE · Gemini hints · Firebase progress sync",
        tech: ["React", "Firebase", "Gemini", "Judge0", "Monaco Editor", "Firestore"],
        highlights: [
            "Graceful fallbacks for AI, code execution, and video APIs",
            "Real-time learning progress with streaks and badges",
            "Integrated IDE experience with sandboxed execution",
        ],
        demo: "",
        icon: GraduationCap,
        color: "text-purple",
        bg: "bg-purple/10",
    }),
    project({
        id: "agentic-soc",
        title: "Ragnarok SIEM Triage",
        category: "AI Infrastructure",
        year: "2025",
        status: "Case Study",
        featured: true,
        showOnHome: false,
        archived: false,
        priority: 7,
        summary: "A SIEM alert-triage service built with teammates in 24 hours: it scores incoming security alerts, explains every score, and suggests a first response.",
        oneLine: "Explainable alert scoring for a SIEM, built in 24 hours. Won 1st place.",
        problem: "Security teams face noisy alert queues where triage, prioritization, and remediation planning consume valuable response time.",
        solution: "A FastAPI service scores each alert from rule severity, threat-intelligence hits, burst counts, asset criticality, MITRE technique risk and suspicious-command patterns, explains the score, and suggests whether to block the source IP or enrich the alert.",
        myRole: "Team project at the Black Pearl hackathon. I helped design the triage flow and the security workflow around it; the service code lives in a teammate's repository.",
        techStack: ["Python", "FastAPI", "SIEM", "MITRE ATT&CK", "Threat intelligence"],
        tags: ["Cybersecurity", "SIEM", "Hackathon", "Explainability"],
        architecture: "Alerts are posted to /score, which combines weighted signals into a priority and a suggested action. /why/{dedup_key} returns the reasons behind any score, and /metrics exposes counters. The team's design places the service between Wazuh alerts and TheHive cases, with MISP for threat intelligence.",
        architectureHighlights: ["Weighted, explainable alert scoring", "Per-alert explanations through /why", "Suggested first response: block the IP or enrich the alert"],
        features: ["Alert scoring", "Score explanations", "Suggested response"],
        impact: ["Built in 24 hours with teammates.", "Won 1st place at the Black Pearl Cybersecurity Hackathon."],
        challenges: ["Producing a score an analyst can trust: every point has to be explainable.", "Scoping a full SOC pipeline down to what could work in 24 hours."],
        learnings: ["Explainable heuristics beat opaque scores when an analyst makes the final call.", "Security tooling needs clear escalation and review boundaries."],
        links: {},
        description: "A SIEM alert-triage service built with teammates in 24 hours: it scores incoming security alerts, explains every score, and suggests a first response.",
        proofPoint: "Black Pearl 24-hour Cybersecurity Hackathon · 1st place",
        tech: ["Python", "FastAPI", "SIEM", "MITRE ATT&CK", "Threat intelligence"],
        highlights: ["Weighted, explainable alert scoring", "Per-alert explanations through /why", "Suggested first response: block the IP or enrich the alert"],
        demo: "",
        icon: ShieldCheck,
        color: "text-orange",
        bg: "bg-orange/10",
    }),
    project({
        id: "vasoli",
        title: "Vasoli",
        category: "Full-Stack Product",
        year: "2026",
        status: "Prototype",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 8,
        summary: "A personal-finance app for salaried people in India that answers one question: how much can I still spend before payday?",
        oneLine: "Payday-aware budgeting: one honest number for what is safe to spend before salary day.",
        problem: "Budget apps show where money went. Salaried people mostly need to know what is safe to spend before the next payday, after bills, savings goals and a safety reserve.",
        solution: "Vasoli combines recorded balances, recurring bills, goals and a payday plan into one spending-room estimate, imports bank statements through a server-checked preview, and says which inputs could change the number.",
        myRole: "Built the product: the Next.js app, the Go backend and its PostgreSQL schema, and the payday forecast.",
        techStack: ["Go", "Connect RPC", "PostgreSQL", "Supabase", "Next.js", "TypeScript"],
        tags: ["FinTech", "Personal finance", "Forecasting"],
        architecture: "A Next.js 14 frontend talks to a Go backend over Connect RPC. The backend uses sqlc for typed queries against PostgreSQL on Supabase, verifies Supabase JWTs, and computes the payday forecast in integer paise so rounding never drifts. An optional Gemini assistant, Marco, answers questions about your own data.",
        architectureHighlights: ["Payday forecast computed in integer paise on the server", "Bank-statement import with balance checks and duplicate detection", "Bills linked to the accounts that pay them"],
        features: ["Spending room until payday", "CSV statement import with review", "Recurring bills and goals", "Receipt vault"],
        impact: ["Running as an invite-only private pilot.", "Statement imports check opening and closing balances before anything is saved."],
        challenges: ["Giving one number without hiding its assumptions.", "Importing messy bank statements without double-counting manual entries."],
        learnings: ["Money math belongs in integers on the server, not floats in the browser.", "A forecast earns trust when it says what it doesn't know."],
        links: {"github": "https://github.com/ayushcody/Vasoli"},
        description: "A personal-finance app for salaried people in India that answers one question: how much can I still spend before payday?",
        proofPoint: "Go · Connect RPC · PostgreSQL · Integer-paise forecasting",
        tech: ["Go", "Connect RPC", "PostgreSQL", "Supabase", "Next.js", "TypeScript"],
        highlights: ["Payday forecast computed in integer paise on the server", "Bank-statement import with balance checks and duplicate detection", "Bills linked to the accounts that pay them"],
        demo: "",
        icon: BadgeDollarSign,
        color: "text-cyan",
        bg: "bg-cyan/10",
    }),
    project({
        id: "breast-cancer-detection",
        hidden: true,
        title: "Breast Cancer Detection",
        category: "Labs",
        status: "Prototype",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 9,
        summary:
            "YOLOv8 object detection workflow trained on medical imagery, covering preprocessing, augmentation, training, and precision-recall optimization.",
        oneLine: "Medical image detection workflow using YOLOv8 and evaluation-focused training.",
        problem:
            "Medical image detection models require careful data preparation and evaluation to avoid misleading performance claims.",
        solution:
            "A YOLOv8 training pipeline handles preprocessing, augmentation, model training, and precision-recall focused evaluation.",
        myRole:
            "Built the computer vision workflow from data preparation through model training and evaluation review.",
        techStack: ["YOLOv8", "Python", "Computer Vision", "Deep Learning", "Model Eval"],
        tags: ["Computer vision", "Medical imaging", "Model evaluation", "YOLOv8"],
        architecture:
            "A YOLOv8 training pipeline preprocesses medical images, applies automated augmentation, trains detection models, and evaluates outputs with precision-recall focused metrics.",
        architectureHighlights: [
            "Image preprocessing and augmentation",
            "YOLOv8 model training workflow",
            "Precision-recall focused evaluation",
        ],
        features: ["Detection training", "Augmentation", "Model evaluation"],
        impact: [
            "Built an end-to-end computer vision workflow for medical imagery experimentation.",
            "Kept evaluation framing focused on precision-recall tradeoffs instead of unsupported headline claims.",
        ],
        challenges: [
            "Avoiding overconfident medical-model claims.",
            "Treating dataset quality and evaluation as core model concerns.",
        ],
        learnings: [
            "High-stakes ML projects need cautious language and careful validation.",
            "Evaluation choices matter as much as model architecture.",
        ],
        links: { github: "https://github.com/ayushcody/breast_cancer_detection" },
        description:
            "YOLOv8 object detection workflow trained on medical imagery, covering preprocessing, augmentation, training, and precision-recall optimization.",
        proofPoint: "YOLOv8 · Medical imagery · Augmentation · Precision-recall tuning",
        tech: ["YOLOv8", "Python", "Computer Vision", "Deep Learning", "Model Eval"],
        highlights: [
            "End-to-end detection lifecycle from data prep to evaluation",
            "Automated augmentation for model robustness",
            "Focuses on precision-recall tradeoffs, not just headline accuracy",
        ],
        demo: "",
        icon: Microscope,
        color: "text-purple",
        bg: "bg-purple/10",
    }),
    project({
        id: "crop-price-forecasting",
        hidden: true,
        title: "Crop Price Forecasting",
        category: "Labs",
        status: "Prototype",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 10,
        summary:
            "SARIMA-based forecasting model for crop prices using time series analysis and feature engineering on real agricultural datasets.",
        oneLine: "Agricultural time-series forecasting workflow with interpretable modeling.",
        problem:
            "Farmers and agricultural stakeholders need interpretable price forecasts built from real market data, not opaque predictions.",
        solution:
            "A data science pipeline cleans agricultural price history, engineers temporal features, trains SARIMA models, and produces future estimates.",
        myRole:
            "Built the forecasting workflow across cleaning, feature engineering, model training, and output interpretation.",
        techStack: ["Python", "SARIMA", "Time Series", "Pandas", "Forecasting"],
        tags: ["Forecasting", "Data science", "Time series", "Agriculture"],
        architecture:
            "A data science pipeline cleans agricultural price history, engineers temporal features, trains SARIMA forecasting models, and produces actionable future price estimates.",
        architectureHighlights: [
            "Agricultural price-history cleaning",
            "Temporal feature engineering",
            "SARIMA-based forecasting",
        ],
        features: ["Data cleaning", "Feature engineering", "Forecast generation"],
        impact: [
            "Built a practical forecasting workflow using interpretable time-series methods.",
            "Demonstrated data preparation and modeling on real agricultural datasets.",
        ],
        challenges: [
            "Handling noisy market data without overstating forecast certainty.",
            "Choosing interpretable modeling over opaque prediction for this use case.",
        ],
        learnings: [
            "Forecasting projects need uncertainty-aware communication.",
            "Classical models remain useful when interpretability matters.",
        ],
        links: {},
        description:
            "SARIMA-based forecasting model for crop prices using time series analysis and feature engineering on real agricultural datasets.",
        proofPoint: "SARIMA · Time series modeling · Feature engineering · Forecasting",
        tech: ["Python", "SARIMA", "Time Series", "Pandas", "Forecasting"],
        highlights: [
            "Uses classical time series modeling for interpretability",
            "Covers raw-data cleaning through forecast generation",
            "Demonstrates practical feature engineering on real datasets",
        ],
        demo: "",
        icon: Sprout,
        color: "text-orange",
        bg: "bg-orange/10",
    }),
    project({
        id: "killit",
        title: "Killit",
        category: "Developer Tooling",
        status: "Prototype",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 11,
        summary:
            "Node.js CLI and programmable API that finds and safely terminates zombie processes occupying local development ports.",
        oneLine: "Safety-aware cross-platform port killer for local development workflows.",
        problem:
            "Developers often kill port-hogging processes manually, risking accidental termination of important system or database processes.",
        solution:
            "A zero-dependency Node.js CLI detects listeners through native OS tools, classifies process safety, and offers an interactive TUI before termination.",
        myRole:
            "Built the CLI behavior, safety classification approach, cross-platform detection flow, and programmable API surface.",
        techStack: ["Node.js", "CLI", "TUI", "Cross-Platform", "Process Management"],
        tags: ["Developer tooling", "CLI", "Node.js", "DX"],
        architecture:
            "A zero-dependency Node.js CLI detects listeners through native OS tools, classifies process safety with a 3-tier engine, and offers an interactive TUI before termination.",
        architectureHighlights: [
            "Native OS listener detection",
            "Three-tier process safety classification",
            "CLI and programmable API usage",
        ],
        features: ["Port detection", "Safety classification", "Interactive TUI", "API mode"],
        impact: [
            "Built a developer tool focused on safer local process management.",
            "Reduced risk in a common workflow by classifying processes before termination.",
        ],
        challenges: [
            "Supporting different OS-level process discovery tools.",
            "Designing safe defaults for a potentially destructive command.",
        ],
        learnings: [
            "Developer tools need strong guardrails around destructive actions.",
            "Cross-platform CLIs work best with layered detection fallbacks.",
        ],
        links: { github: "https://github.com/ayushcody/killit" },
        description:
            "Node.js CLI and programmable API that finds and safely terminates zombie processes occupying local development ports.",
        proofPoint: "Zero dependencies · 3-tier safety engine · macOS/Linux/Windows/Docker",
        tech: ["Node.js", "CLI", "TUI", "Cross-Platform", "Process Management"],
        highlights: [
            "Safety classification helps prevent dangerous process kills",
            "Falls back across lsof, ss, netstat, and /proc/net/tcp",
            "Works as both a CLI tool and programmable API",
        ],
        demo: "",
        icon: TerminalSquare,
        color: "text-white",
        bg: "bg-white/10",
    }),
    project({
        id: "documind",
        title: "DocuMind",
        category: "RAG Systems",
        year: "2026",
        status: "Case Study",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 12,
        summary: "A document AI pipeline that parses pages into verified blocks, extracts fields against your own schema, and cites every value back to the exact region of the page.",
        oneLine: "Document extraction where every value points to the region of the page it came from.",
        problem: "Extraction models return confident values with no way to see where they came from, so reviewers end up re-reading the whole document.",
        solution: "DocuMind parses each page into layout blocks, checks each block against the original, extracts fields against a user-defined JSON schema, and links every value to its source region for human review.",
        myRole: "Built the pipeline end to end: parsing and verification, schema-based extraction, the review flow, and the Next.js interface.",
        techStack: ["Python", "FastAPI", "Celery", "Docling", "ColQwen2", "Qdrant", "PostgreSQL", "Next.js"],
        tags: ["Document AI", "Citations", "Human review"],
        architecture: "FastAPI accepts documents and Celery workers process them. Docling turns each page into blocks with coordinates, and a verifier re-renders every block and compares it with the original crop using SSIM, layout overlap and CLIP similarity. Fields are extracted against a JSON schema with validators, each linked to its source block. ColQwen2 page embeddings in Qdrant handle visual retrieval across documents.",
        architectureHighlights: ["Block-level verification against the source page", "Schema-based extraction with validators and source links", "Reviewer decisions stored apart from model output"],
        features: ["Layout parsing with page coordinates", "Block verification", "Schema-based field extraction", "Human review with region citations", "Visual retrieval with ColQwen2"],
        impact: ["Every extracted value can be traced to a region of the page.", "Blocks that don't match the source are flagged for review instead of passed through."],
        challenges: ["Making confidence honest: uncalibrated scores are labelled as uncalibrated.", "Keeping reviewer corrections separate from the original machine output."],
        learnings: ["A citation is only useful if it points to a region a person can check.", "Comparing output against the source catches errors an extractor will not admit."],
        links: {"github": "https://github.com/ayushcody/DocuMint"},
        description: "A document AI pipeline that parses pages into verified blocks, extracts fields against your own schema, and cites every value back to the exact region of the page.",
        proofPoint: "Docling · Block verifier · Schema extraction · Region citations",
        tech: ["Python", "FastAPI", "Celery", "Docling", "ColQwen2", "Qdrant", "PostgreSQL", "Next.js"],
        highlights: ["Block-level verification against the source page", "Schema-based extraction with validators and source links", "Reviewer decisions stored apart from model output"],
        demo: "",
        icon: BookOpen,
        color: "text-purple",
        bg: "bg-purple/10",
    }),
    project({
        id: "voice-cloning",
        title: "Voice Cloning Pipeline",
        category: "Voice AI",
        year: "2026",
        status: "Case Study",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 13,
        summary: "A local voice-cloning app: record a short clip in the browser, type what it should say, and get speech in that voice from Qwen3-TTS running on a Mac.",
        oneLine: "Voice cloning from a short browser recording, running locally on Apple silicon.",
        problem: "Trying voice cloning usually means a cloud API and uploading someone's voice. This keeps the whole loop on one laptop.",
        solution: "A React frontend records reference audio, and a FastAPI endpoint builds a voice prompt for Qwen3-TTS 0.6B on Apple's MPS backend and returns the generated speech.",
        myRole: "Built the app: in-browser recording, the FastAPI cloning endpoint, and local inference setup on Apple silicon.",
        techStack: ["Python", "FastAPI", "Qwen3-TTS", "PyTorch (MPS)", "React", "Web Audio"],
        tags: ["Voice AI", "TTS", "Local inference"],
        architecture: "The browser records reference audio with MediaRecorder and draws the live microphone waveform. A FastAPI endpoint takes the clip, the text and an optional transcript, builds a voice prompt for Qwen3-TTS 0.6B on Apple's MPS backend, and returns a WAV with the inference time in a response header. Without a transcript it uses the faster speaker-embedding-only mode.",
        architectureHighlights: ["One FastAPI endpoint for cloning", "Transcript-guided or speaker-embedding-only modes", "Local inference on Apple silicon"],
        features: ["In-browser recording with a live waveform", "Optional reference transcript", "WAV playback and download"],
        impact: ["Runs entirely on a laptop, with no cloud TTS calls.", "Reports inference time with every generated clip."],
        challenges: ["The transcript has to match the reference clip, or the model speaks the leftover words.", "Structured text such as email addresses and phone numbers still needs normalizing before synthesis."],
        learnings: ["Cloning quality depends on a clean reference clip and an accurate transcript.", "Local models make experimenting cheap, but setup details such as audio codecs decide whether it runs at all."],
        nextSteps: ["Normalize emails, phone numbers and dates before synthesis.", "Add torchcodec to requirements so fresh installs work."],
        links: {},
        description: "A local voice-cloning app: record a short clip in the browser, type what it should say, and get speech in that voice from Qwen3-TTS running on a Mac.",
        proofPoint: "Qwen3-TTS 0.6B · FastAPI · Apple MPS",
        tech: ["Python", "FastAPI", "Qwen3-TTS", "PyTorch (MPS)", "React", "Web Audio"],
        highlights: ["One FastAPI endpoint for cloning", "Transcript-guided or speaker-embedding-only modes", "Local inference on Apple silicon"],
        demo: "",
        icon: Microscope,
        color: "text-purple",
        bg: "bg-purple/10",
    }),
    project({
        id: "hushh",
        title: "Hushh Personal Agent",
        category: "Agentic AI",
        year: "2026",
        status: "Case Study",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 14,
        summary: "A consent-first personal AI agent: a central agent routes requests to specialist agents for finance and creator work, and the server checks stored consent before any of them reads your data.",
        oneLine: "A personal AI agent that asks before it reads: consent is enforced by the server, not the prompt.",
        problem: "Personal AI agents need access to sensitive data, but consent written into a prompt is a suggestion, not a control.",
        solution: "A personal agent routes each request to a specialist found through A2A agent cards. Before any data is read, the API checks the user's stored consent for that category, and every consent change is recorded with its history.",
        myRole: "Built the proof of concept: the orchestrator and specialist agents, the consent API and its history, and the React interface.",
        techStack: ["TypeScript", "Express", "React", "LangChain", "Gemini", "Prisma", "MCP", "A2A"],
        tags: ["Agents", "Consent", "Personal AI"],
        architecture: "A React 19 and Vite frontend talks to an Express API written in TypeScript. The orchestrator classifies each request and hands it to Kai (finance) or Nav (creator) through A2A agent cards. Kai uses Gemini only to extract the intent and numbers, then answers with arithmetic over a saved finance snapshot and names the snapshot it used. Payments follow AP2-style signed mandates that need human approval; signatures and payment rails are simulated. Data lives in SQLite through Prisma and libSQL.",
        architectureHighlights: ["Consent checked in the API against stored records", "Specialist agents discovered through A2A agent cards", "The model extracts; plain arithmetic decides"],
        features: ["Consent-gated agent handoff", "Per-category consent with history", "Kai, a finance assistant", "Nav, creator data controls"],
        impact: ["Revoked consent blocks a request before any data is read.", "Every finance answer names the snapshot it was computed from."],
        challenges: ["Keeping the model away from the arithmetic so answers stay correct.", "Making consent enforceable rather than a line in a prompt."],
        learnings: ["Consent belongs in the data layer, not the prompt.", "Letting the model extract and code compute keeps finance answers checkable."],
        links: {},
        description: "A consent-first personal AI agent: a central agent routes requests to specialist agents for finance and creator work, and the server checks stored consent before any of them reads your data.",
        proofPoint: "Consent-gated agents · A2A · Gemini extraction",
        tech: ["TypeScript", "Express", "React", "LangChain", "Gemini", "Prisma", "MCP", "A2A"],
        highlights: ["Consent checked in the API against stored records", "Specialist agents discovered through A2A agent cards", "The model extracts; plain arithmetic decides"],
        demo: "",
        icon: ShieldCheck,
        color: "text-purple",
        bg: "bg-purple/10",
    }),
]
    .filter((item) => !item.hidden)
    .sort((a, b) => a.priority - b.priority);

export const featuredProjects = projectsData.filter((item) => item.featured);
export const homeProjects = projectsData.filter((item) => item.showOnHome);
export const archivedProjects = projectsData.filter((item) => item.archived);
