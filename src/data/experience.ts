// ============================================================================
// EXPERIENCE - Verified career timeline and backward-compatible UI data
// ============================================================================

export type ExperienceItem = {
    company: string;
    role: string;
    period: string;
    type?: string;
    location?: string;
    shortSummary: string;
    responsibilities: string[];
    impact: string[];
    techStack: string[];
    featured: boolean;

    // Backward compatibility.
    description?: string;
    bullets?: string[];
};

export type ExperienceEntry = ExperienceItem & {
    id: string;
    contributions: string[];
    tech: string[];
    /** Progression label shown on the roadmap connector */
    progressionLabel: string;
    /** Color accent for this entry */
    color: "cyan" | "purple" | "orange" | "white";
};

export const experiencesData: ExperienceEntry[] = [
    {
        id: "persistent",
        company: "Persistent Systems Inc.",
        role: "GenAI Engineer Intern",
        period: "Sep 2025 - Apr 2026",
        type: "Internship",
        location: "Pune, India",
        shortSummary:
            "Building agentic LLM workflows, RAG pipelines, and evaluation patterns for enterprise AI product work.",
        responsibilities: [
            "Built agentic LLM workflows with structured outputs and evaluation loops",
            "Developed Persona Mail, an email digital twin using OAuth2 and Gmail API integration",
            "Implemented prompt versioning, regression testing, and optimization pipelines",
        ],
        impact: [
            "Improved AI workflow reliability through structured outputs, validation paths, and regression-style prompt checks.",
            "Connected AI behavior to real product surfaces such as email analysis and draft generation.",
            "Worked across backend APIs, LLM orchestration, retrieval patterns, and evaluation concerns.",
        ],
        techStack: ["Python", "LangChain", "FastAPI", "Pinecone", "Azure OpenAI", "PostgreSQL"],
        featured: true,
        description:
            "Building agentic LLM workflows, RAG pipelines, and evaluation frameworks for enterprise AI products. Developed Persona Mail - an email digital twin powered by OAuth2 and Gmail API integration.",
        bullets: [
            "Built agentic LLM workflows with structured outputs and evaluation loops",
            "Developed Persona Mail: an email digital twin parsing 50-100 emails via OAuth2/Gmail API",
            "Implemented prompt versioning, regression testing, and optimization pipelines",
        ],
        contributions: [
            "Built agentic LLM workflows with structured outputs and evaluation loops",
            "Developed Persona Mail: an email digital twin parsing 50-100 emails via OAuth2/Gmail API",
            "Implemented prompt versioning, regression testing, and optimization pipelines",
        ],
        tech: ["Python", "LangChain", "FastAPI", "Pinecone", "Azure OpenAI", "PostgreSQL"],
        progressionLabel: "GenAI",
        color: "white",
    },
    {
        id: "syniris",
        company: "Syniris Technologies",
        role: "Full-Stack Web Development Intern",
        period: "Jun 2025 - Aug 2025",
        type: "Internship",
        location: "Remote",
        shortSummary:
            "Built a full-stack notes and deadline management platform with auth, APIs, validation, and testing.",
        responsibilities: [
            "Developed a notes/deadline platform with Firebase Auth and role-based access control",
            "Designed and documented REST APIs with input validation and error handling",
            "Performed end-to-end API testing with Postman and wrote integration test suites",
        ],
        impact: [
            "Connected frontend workflows to authenticated backend behavior for a practical productivity product.",
            "Improved API reliability through validation, documented endpoints, and testing workflows.",
            "Worked across frontend, backend, authentication, and QA responsibilities.",
        ],
        techStack: ["React", "Node.js", "Firebase", "REST APIs", "Postman", "Tailwind CSS"],
        featured: true,
        description:
            "Built a full-stack notes and deadline management platform with role-based access control, REST API design, and end-to-end testing.",
        bullets: [
            "Developed a notes/deadline platform with Firebase Auth and role-based access control",
            "Designed and documented REST APIs with input validation and error handling",
            "Performed end-to-end API testing with Postman and wrote integration test suites",
        ],
        contributions: [
            "Developed a notes/deadline platform with Firebase Auth and role-based access control",
            "Designed and documented REST APIs with input validation and error handling",
            "Performed end-to-end API testing with Postman and wrote integration test suites",
        ],
        tech: ["React", "Node.js", "Firebase", "REST APIs", "Postman", "Tailwind CSS"],
        progressionLabel: "Full-Stack",
        color: "orange",
    },
    {
        id: "nexus",
        company: "Nexus",
        role: "Software Engineering Project Lead",
        period: "Mar 2025 - May 2025",
        type: "Project leadership",
        location: "Remote",
        shortSummary:
            "Led a small engineering team across production application builds, sprint planning, review, and delivery.",
        responsibilities: [
            "Led a cross-functional team of 4-6 engineers across 3 production applications",
            "Established sprint planning workflows, coding standards, and CI/CD pipelines",
            "Drove architecture decisions and conducted thorough code reviews",
        ],
        impact: [
            "Created clearer delivery workflows through sprint planning, code review, and shared engineering standards.",
            "Helped the team move from implementation tasks to shipped application outcomes.",
            "Practiced technical leadership across architecture, review, and release concerns.",
        ],
        techStack: ["React", "Node.js", "TypeScript", "GitHub Actions", "Vercel"],
        featured: true,
        description:
            "Led a team of 4-6 engineers to design, build, and ship 3 production applications. Owned sprint planning, code reviews, and architecture decisions.",
        bullets: [
            "Led a cross-functional team of 4-6 engineers across 3 production applications",
            "Established sprint planning workflows, coding standards, and CI/CD pipelines",
            "Drove architecture decisions and conducted thorough code reviews",
        ],
        contributions: [
            "Led a cross-functional team of 4-6 engineers across 3 production applications",
            "Established sprint planning workflows, coding standards, and CI/CD pipelines",
            "Drove architecture decisions and conducted thorough code reviews",
        ],
        tech: ["React", "Node.js", "TypeScript", "GitHub Actions", "Vercel"],
        progressionLabel: "Leadership",
        color: "purple",
    },
    {
        id: "acs",
        company: "Association for Cyber Security",
        role: "DevSec Intern",
        period: "Sep 2024 - Feb 2025",
        type: "Internship",
        location: "Pune, India",
        shortSummary:
            "Built a security-first foundation through threat modeling, secure web practices, and blockchain security research.",
        responsibilities: [
            "Conducted threat modeling and vulnerability assessments for web applications",
            "Researched smart contract security patterns and blockchain-based authentication",
            "Implemented secure coding practices across internal tools and documentation",
        ],
        impact: [
            "Strengthened practical security judgment across web, API, and blockchain-oriented systems.",
            "Applied secure coding and vulnerability assessment practices to development workflows.",
            "Built early experience connecting security research with implementation decisions.",
        ],
        techStack: ["Solidity", "OWASP", "Python", "Git", "Linux"],
        featured: false,
        description:
            "Built a security-first development foundation through hands-on threat modeling, blockchain security research, and secure web application development.",
        bullets: [
            "Conducted threat modeling and vulnerability assessments for web applications",
            "Researched smart contract security patterns and blockchain-based authentication",
            "Implemented secure coding practices across internal tools and documentation",
        ],
        contributions: [
            "Conducted threat modeling and vulnerability assessments for web applications",
            "Researched smart contract security patterns and blockchain-based authentication",
            "Implemented secure coding practices across internal tools and documentation",
        ],
        tech: ["Solidity", "OWASP", "Python", "Git", "Linux"],
        progressionLabel: "DevSec",
        color: "cyan",
    },
];
