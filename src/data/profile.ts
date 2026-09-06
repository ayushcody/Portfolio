// ============================================================================
// PROFILE - Single source of truth for personal info and positioning
// ============================================================================

export type ProfileLink = {
    label: string;
    href: string;
    external?: boolean;
};

export type Profile = {
    fullName: string;
    initials: string;
    headline: string;
    role: string;
    shortBio: string;
    longBio: string;
    location?: string;
    timezone?: string;
    email?: string;
    availability?: string;
    preferredRoles: string[];
    currentFocus: string[];
    engineeringStyle: string[];
    education?: {
        degree?: string;
        institution?: string;
        status?: string;
        cgpa?: string;
        location?: string;
    };
    links: {
        github?: string;
        linkedin?: string;
        email?: string;
        resume?: string;
        portfolio?: string;
    };
    ctas: {
        primary: string;
        secondary: string;
    };
    credibility: string[];

    // Backward compatibility for current components.
    name: string;
    firstName: string;
    lastName: string;
    title: string;
    tagline: string;
    heroDescription: string;
    contactDescription: string;
    github: string;
    githubHandle: string;
    linkedin: string;
    linkedinHandle: string;
    locationShort: string;
    profilePhoto: string;
    resumePath: string;
};

const email = "ayushchougula1@gmail.com";
const github = "https://github.com/ayushcody";
const linkedin = "https://linkedin.com/in/ayushchougula";
const resumePath = "/resume";

export const profile: Profile = {
    fullName: "Ayush Chougula",
    initials: "AC",
    headline: "AI Systems Engineer",
    role: "AI Systems Engineer",
    shortBio:
        "Computer Science undergraduate building agentic AI, RAG, evaluation pipelines, and voice automation, backed by hands-on full-stack engineering.",
    longBio:
        "I study Computer Science at MIT ADT University and build AI products alongside internships and freelance work. At Quensulting, I connect voice agents to business workflows. Previously at Persistent Systems, I built agentic RAG workflows, LLM evaluation pipelines, and Persona Mail. I care about the whole product: APIs, interfaces, data, and the fallback paths that keep it useful.",
    location: "Pune, Maharashtra, India",
    timezone: "Asia/Kolkata",
    email,
    availability:
        "Open to freelance projects, AI engineering opportunities, and full-time AI / software engineering roles for 2027.",
    preferredRoles: [
        "AI Engineer · 2027 graduate roles",
        "Software Engineer · 2027 graduate roles",
        "AI Systems / Agentic AI Developer",
        "Freelance AI & full-stack projects",
    ],
    currentFocus: [
        "Agentic AI workflows",
        "RAG systems",
        "Voice AI agents",
        "LLM evaluation & hallucination detection",
        "Full-stack AI products",
    ],
    engineeringStyle: [
        "Product-first engineering",
        "Clean system architecture",
        "Practical AI integration",
        "Performance and reliability focus",
    ],
    education: {
        degree: "B.Tech Computer Science & Engineering",
        institution: "MIT ADT University",
        status: "Aug 2023 - Jul 2027",
        cgpa: "8.3 / 10",
        location: "Pune, India",
    },
    links: {
        github,
        linkedin,
        email: `mailto:${email}`,
        resume: resumePath,
        portfolio: "https://ayushchougula.in",
    },
    ctas: {
        primary: "View proof of work",
        secondary: "Open resume",
    },
    credibility: [
        "GenAI engineering internship experience",
        "Built RAG, agentic AI, evaluation, and full-stack AI projects",
        "Hackathon recognition across cybersecurity, innovation, and DSA",
        "Comfortable across frontend, backend, cloud, data, and security layers",
    ],

    // Backward-compatible aliases.
    name: "Ayush Chougula",
    firstName: "Ayush",
    lastName: "Chougula",
    title: "AI Systems Engineer",
    tagline: "Agentic AI • RAG • Voice AI • Full-Stack Products",
    heroDescription:
        "I build production-grade AI systems across agentic workflows, RAG pipelines, voice AI, and AI infrastructure.",
    contactDescription:
        "I’m open to freelance builds and AI or software engineering roles for 2027. Let’s talk about useful AI systems, voice automation, and full-stack products.",
    github,
    githubHandle: "ayushcody",
    linkedin,
    linkedinHandle: "in/ayushchougula",
    locationShort: "Pune, India",
    profilePhoto: "/profile.png",
    resumePath,
};

export const profileLinks: ProfileLink[] = [
    { label: "GitHub", href: github, external: true },
    { label: "LinkedIn", href: linkedin, external: true },
    { label: "Email", href: `mailto:${email}` },
    { label: "Resume", href: resumePath },
];
