import {
    Mail,
    Scale,
    BookOpen,
    Code2,
    GraduationCap,
    ClipboardCheck,
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

export type ProjectLinkSet = {
    github?: string;
    live?: string;
    demo?: string;
    caseStudy?: string;
    video?: string;
};

export type ProjectVisuals = {
    thumbnail?: string;
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
        links: { github: "https://github.com/ayushcody/emailDigitalTwin" },
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
        status: "Case Study",
        featured: true,
        showOnHome: true,
        archived: false,
        priority: 4,
        summary:
            "Multi-agent research pipeline combining vector retrieval and reasoning agents for structured, cited knowledge extraction from documents and the web.",
        oneLine: "Multi-agent RAG research assistant for grounded knowledge synthesis.",
        problem:
            "Research workflows often fragment across PDFs, notes, web searches, and summaries, making citation tracking and factual grounding difficult.",
        solution:
            "Retrieval agents gather grounded context from documents and web sources while reasoning agents synthesize structured answers.",
        myRole:
            "Designed the agent workflow, retrieval/fallback behavior, and knowledge persistence approach.",
        techStack: ["Python", "RAG", "Agents", "Vector Search", "Embeddings", "Web Search"],
        tags: ["Research assistant", "Agents", "RAG", "Knowledge base"],
        architecture:
            "Documents and web sources are embedded into a vector store, retrieval agents collect grounded context, reasoning agents synthesize the answer, and fallback web-search agents fill missing context when local retrieval is weak.",
        architectureHighlights: [
            "Retrieval agents with reasoning-agent synthesis",
            "Fallback web-search behavior for weak local context",
            "Persistent knowledge base for reusable findings",
        ],
        features: ["Document retrieval", "Web fallback", "Grounded synthesis", "Knowledge persistence"],
        impact: [
            "Designed a research workflow that keeps retrieval and reasoning responsibilities explicit.",
            "Reduced hallucination risk through grounding and fallback search patterns.",
        ],
        challenges: [
            "Balancing local retrieval with external search without mixing weak context into final answers.",
            "Maintaining traceability from generated answers back to source material.",
        ],
        learnings: [
            "Agentic RAG systems need clear routing decisions before synthesis.",
            "Persistent knowledge bases are most useful when source provenance is preserved.",
        ],
        links: {},
        description:
            "Multi-agent research pipeline combining vector retrieval and reasoning agents for structured, cited knowledge extraction from documents and the web.",
        proofPoint: "Multi-agent RAG · Web fallback agents · Persistent knowledge base",
        tech: ["Python", "RAG", "Agents", "Vector Search", "Embeddings", "Web Search"],
        highlights: [
            "Combines retrieval agents with reasoning agents",
            "Uses grounding and fallback search to reduce hallucinations",
            "Persists useful findings into a reusable knowledge base",
        ],
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
        links: {},
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
        id: "llm-evaluation-framework",
        title: "LLM Evaluation Framework",
        shortTitle: "LLM Eval Framework",
        category: "AI Infrastructure",
        status: "Case Study",
        featured: true,
        showOnHome: false,
        archived: false,
        priority: 6,
        summary:
            "Evaluation system for benchmarking LLM response quality across prompt versions using self-reflection scoring and rule-based validators.",
        oneLine: "Prompt and response quality evaluation workflow for LLM iteration.",
        problem:
            "Prompt improvements are hard to trust when changes are judged manually and regressions are not measured across a consistent test set.",
        solution:
            "A prompt-versioned pipeline runs outputs through model-graded scoring, deterministic validators, and structured report generation.",
        myRole:
            "Designed the evaluation loop, validator structure, prompt comparison flow, and report format.",
        techStack: ["LLM Eval", "Python", "Prompt Testing", "Validators", "Reports"],
        tags: ["Evaluation", "Prompt testing", "Reliability", "AI infrastructure"],
        architecture:
            "A prompt-versioned evaluation pipeline runs model outputs through self-reflection scoring, deterministic validators, and report generation so changes can be compared like an MLOps monitoring workflow.",
        architectureHighlights: [
            "Prompt-versioned test runs",
            "Model-graded and rule-based evaluation checks",
            "Structured report output for comparison",
        ],
        features: ["Prompt A/B tests", "Hallucination checks", "Report generation"],
        impact: [
            "Made prompt iteration more systematic by comparing changes across repeatable checks.",
            "Reduced reliance on manual review alone by combining validators with model-graded scoring.",
        ],
        challenges: [
            "Avoiding false confidence from model-graded evaluation.",
            "Choosing deterministic checks that match real product risk.",
        ],
        learnings: [
            "LLM quality work needs regression testing, not just better prompts.",
            "Evaluation reports are more useful when tied to prompt versions.",
        ],
        links: {},
        description:
            "Evaluation system for benchmarking LLM response quality across prompt versions using self-reflection scoring and rule-based validators.",
        proofPoint: "Prompt A/B tests · Hallucination checks · Structured eval reports",
        tech: ["LLM Eval", "Python", "Prompt Testing", "Validators", "Reports"],
        highlights: [
            "Benchmarks hallucination risk across prompt versions",
            "Combines model-graded and rule-based checks",
            "Generates structured reports for prompt iteration",
        ],
        demo: "",
        icon: ClipboardCheck,
        color: "text-cyan",
        bg: "bg-cyan/10",
    }),
    project({
        id: "agentic-soc",
        title: "Agentic SOC",
        category: "Agentic AI",
        status: "Case Study",
        featured: true,
        showOnHome: false,
        archived: false,
        priority: 7,
        summary:
            "Full-stack SIEM platform that ingests security alerts and uses agentic LLM workflows for triage, remediation suggestions, and orchestration.",
        oneLine: "AI-driven SIEM alert triage platform built under hackathon constraints.",
        problem:
            "Security teams face noisy alert queues where triage, prioritization, and remediation planning consume valuable response time.",
        solution:
            "Security alerts enter an agentic triage layer that classifies severity, reasons about likely causes, and proposes remediation steps for analyst review.",
        myRole:
            "Helped design and build the AI triage flow, security workflow framing, and full-stack prototype behavior.",
        techStack: ["SIEM", "Agentic AI", "LLM Workflows", "Cybersecurity", "Full Stack"],
        tags: ["Cybersecurity", "Agentic workflows", "SIEM", "Hackathon"],
        architecture:
            "Security alerts flow into a triage layer where agentic LLM workflows classify severity, reason about likely causes, suggest remediation steps, and coordinate follow-up actions.",
        architectureHighlights: [
            "Alert ingestion and severity classification",
            "Agentic reasoning over likely causes",
            "Remediation suggestions for analyst review",
        ],
        features: ["Alert triage", "Severity classification", "Remediation suggestions"],
        impact: [
            "Built a working security-tool prototype under 24-hour hackathon constraints.",
            "Won 1st place at the Black Pearl Cybersecurity Hackathon, as represented in existing portfolio data.",
        ],
        challenges: [
            "Designing useful AI assistance while keeping analysts in control.",
            "Making security reasoning legible in a short-build context.",
        ],
        learnings: [
            "Agentic security tools need clear escalation and review boundaries.",
            "Triage workflows benefit from concise reasoning traces.",
        ],
        links: {},
        description:
            "Full-stack SIEM platform that ingests security alerts and uses agentic LLM workflows for triage, remediation suggestions, and orchestration.",
        proofPoint: "Black Pearl 24-hour Cybersecurity Hackathon · 1st place",
        tech: ["SIEM", "Agentic AI", "LLM Workflows", "Cybersecurity", "Full Stack"],
        highlights: [
            "Automates first-pass alert triage and prioritization",
            "Generates remediation suggestions for analyst review",
            "Built under hackathon constraints and won 1st place",
        ],
        demo: "",
        icon: ShieldCheck,
        color: "text-orange",
        bg: "bg-orange/10",
    }),
    project({
        id: "vasoli",
        title: "Vasoli",
        category: "AI Infrastructure",
        status: "Prototype",
        featured: false,
        showOnHome: false,
        archived: false,
        priority: 8,
        summary:
            "High-throughput ETL pipeline in Go using Kafka for real-time event streaming and PostgreSQL for structured financial transaction storage.",
        oneLine: "Go, Kafka, and PostgreSQL ETL pipeline for financial transaction workflows.",
        problem:
            "Financial transaction systems need reliable ingestion, transformation, and storage without losing security or fault tolerance.",
        solution:
            "Go services expose secured API endpoints, stream transaction events through Kafka, transform payloads, and persist structured records in PostgreSQL.",
        myRole:
            "Built backend pipeline components across API design, streaming, transformation, and persistence concerns.",
        techStack: ["Go", "Kafka", "PostgreSQL", "JWT", "ETL", "REST APIs"],
        tags: ["Backend", "ETL", "Kafka", "FinTech"],
        architecture:
            "Go services expose JWT-secured API endpoints, stream transaction events through Kafka, transform payloads through ETL workers, and persist structured records in PostgreSQL.",
        architectureHighlights: [
            "JWT-secured REST ingestion endpoints",
            "Kafka-backed event streaming",
            "PostgreSQL persistence for structured transaction data",
        ],
        features: ["Event ingestion", "ETL workers", "JWT-secured APIs"],
        impact: [
            "Built a backend-heavy prototype for financial data ingestion and transformation.",
            "Practiced fault-tolerant pipeline design around event streaming and persistence.",
        ],
        challenges: [
            "Keeping transaction payload flow reliable across service boundaries.",
            "Designing secure ingestion without adding unnecessary complexity.",
        ],
        learnings: [
            "Streaming pipelines need simple contracts between producers, workers, and storage.",
            "Backend reliability starts with clear payload validation and failure handling.",
        ],
        links: { github: "https://github.com/ayushcody/Vasoli" },
        description:
            "High-throughput ETL pipeline in Go using Kafka for real-time event streaming and PostgreSQL for structured financial transaction storage.",
        proofPoint: "Go services · Kafka streaming · PostgreSQL · JWT-secured APIs",
        tech: ["Go", "Kafka", "PostgreSQL", "JWT", "ETL", "REST APIs"],
        highlights: [
            "Kafka-backed real-time event streaming pipeline",
            "JWT-secured API surface for transaction ingestion",
            "Fault-tolerant design for financial data workflows",
        ],
        demo: "",
        icon: BadgeDollarSign,
        color: "text-cyan",
        bg: "bg-cyan/10",
    }),
    project({
        id: "breast-cancer-detection",
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
        "id": "documind",
        "title": "DocuMind",
        "category": "RAG Systems",
        "summary": "Visual document retrieval with answers cited to the exact region of the source page.",
        "techStack": [
                "FastAPI",
                "Celery",
                "ColQwen2",
                "Python"
        ],
        "architecture": "ColQwen2 handles layout-aware document retrieval. Celery ingests and indexes documents asynchronously, with FastAPI coordinating the pipeline.",
        "features": [
                "Visual and layout-aware document understanding",
                "Bounding-box citations back to source regions",
                "Asynchronous document ingestion and indexing"
        ],
        "year": "2025",
        "status": "Case Study",
        "featured": false,
        "showOnHome": false,
        "archived": false,
        "priority": 12,
        "oneLine": "Visual document retrieval with answers cited to the exact region of the source page.",
        "description": "Visual document retrieval with answers cited to the exact region of the source page.",
        "problem": "",
        "solution": "ColQwen2 handles layout-aware document retrieval. Celery ingests and indexes documents asynchronously, with FastAPI coordinating the pipeline.",
        "myRole": "Built the application and its core pipeline.",
        "tags": [
                "FastAPI",
                "Celery",
                "ColQwen2"
        ],
        "architectureHighlights": [
                "Visual and layout-aware document understanding",
                "Bounding-box citations back to source regions",
                "Asynchronous document ingestion and indexing"
        ],
        "impact": [
                "Visual and layout-aware document understanding",
                "Bounding-box citations back to source regions",
                "Asynchronous document ingestion and indexing"
        ],
        "challenges": [],
        "learnings": [],
        "links": {},
        "proofPoint": "FastAPI · Celery · ColQwen2",
        "tech": [
                "FastAPI",
                "Celery",
                "ColQwen2",
                "Python"
        ],
        "highlights": [
                "Visual and layout-aware document understanding",
                "Bounding-box citations back to source regions",
                "Asynchronous document ingestion and indexing"
        ],
        "demo": "",
        "color": "text-purple",
        "bg": "bg-purple/10"
,
        icon: BookOpen
    }),
    project({
        "id": "voice-cloning",
        "title": "Voice Cloning Pipeline",
        "category": "Voice AI",
        "summary": "A Qwen3 voice-cloning and text-to-speech pipeline tuned for clear pronunciation of emails, numbers, and dates.",
        "techStack": [
                "Qwen3",
                "PyTorch",
                "TTS",
                "Audio processing"
        ],
        "architecture": "A Qwen3-based speech pipeline uses structured prompt formatting to improve pronunciation of email addresses, numeric identifiers, and dates.",
        "features": [
                "Voice cloning and text-to-speech generation",
                "Prompt formatting for structured data pronunciation",
                "Inference tuning for low-latency use"
        ],
        "year": "2025",
        "status": "Case Study",
        "featured": false,
        "showOnHome": false,
        "archived": false,
        "priority": 13,
        "oneLine": "A Qwen3 voice-cloning and text-to-speech pipeline tuned for clear pronunciation of emails, numbers, and dates.",
        "description": "A Qwen3 voice-cloning and text-to-speech pipeline tuned for clear pronunciation of emails, numbers, and dates.",
        "problem": "",
        "solution": "A Qwen3-based speech pipeline uses structured prompt formatting to improve pronunciation of email addresses, numeric identifiers, and dates.",
        "myRole": "Built the application and its core pipeline.",
        "tags": [
                "Qwen3",
                "PyTorch",
                "TTS"
        ],
        "architectureHighlights": [
                "Voice cloning and text-to-speech generation",
                "Prompt formatting for structured data pronunciation",
                "Inference tuning for low-latency use"
        ],
        "impact": [
                "Voice cloning and text-to-speech generation",
                "Prompt formatting for structured data pronunciation",
                "Inference tuning for low-latency use"
        ],
        "challenges": [],
        "learnings": [],
        "links": {},
        "proofPoint": "Qwen3 · PyTorch · TTS",
        "tech": [
                "Qwen3",
                "PyTorch",
                "TTS",
                "Audio processing"
        ],
        "highlights": [
                "Voice cloning and text-to-speech generation",
                "Prompt formatting for structured data pronunciation",
                "Inference tuning for low-latency use"
        ],
        "demo": "",
        "color": "text-purple",
        "bg": "bg-purple/10"
,
        icon: Microscope
    }),
    project({
        "id": "hushh",
        "title": "Hushh",
        "category": "Full-Stack Product",
        "summary": "A full-stack application built with a Vite-powered React frontend and a Node.js API backed by PostgreSQL.",
        "techStack": [
                "React",
                "Vite",
                "Node.js",
                "Express",
                "Prisma",
                "Supabase"
        ],
        "architecture": "React and Vite provide the frontend. An Express backend uses Prisma to access Supabase-hosted PostgreSQL.",
        "features": [
                "React frontend with Vite",
                "Node.js and Express service layer",
                "Prisma ORM over Supabase PostgreSQL"
        ],
        "year": "2025",
        "status": "Case Study",
        "featured": false,
        "showOnHome": false,
        "archived": false,
        "priority": 14,
        "oneLine": "A full-stack application built with a Vite-powered React frontend and a Node.js API backed by PostgreSQL.",
        "description": "A full-stack application built with a Vite-powered React frontend and a Node.js API backed by PostgreSQL.",
        "problem": "",
        "solution": "React and Vite provide the frontend. An Express backend uses Prisma to access Supabase-hosted PostgreSQL.",
        "myRole": "Built the application and its core pipeline.",
        "tags": [
                "React",
                "Vite",
                "Node.js"
        ],
        "architectureHighlights": [
                "React frontend with Vite",
                "Node.js and Express service layer",
                "Prisma ORM over Supabase PostgreSQL"
        ],
        "impact": [
                "React frontend with Vite",
                "Node.js and Express service layer",
                "Prisma ORM over Supabase PostgreSQL"
        ],
        "challenges": [],
        "learnings": [],
        "links": {},
        "proofPoint": "React · Vite · Node.js",
        "tech": [
                "React",
                "Vite",
                "Node.js",
                "Express",
                "Prisma",
                "Supabase"
        ],
        "highlights": [
                "React frontend with Vite",
                "Node.js and Express service layer",
                "Prisma ORM over Supabase PostgreSQL"
        ],
        "demo": "",
        "color": "text-purple",
        "bg": "bg-purple/10"
,
        icon: Code2
    }),
].sort((a, b) => a.priority - b.priority);

export const featuredProjects = projectsData.filter((item) => item.featured);
export const homeProjects = projectsData.filter((item) => item.showOnHome);
export const archivedProjects = projectsData.filter((item) => item.archived);
