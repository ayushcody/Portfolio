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

const email = "ayushchougula@gmail.com";
const github = "https://github.com/ayushcody";
const linkedin = "https://linkedin.com/in/ayushchougula";
const resumePath = "/resume";

export const profile: Profile = {
    fullName: "Ayush Chougula",
    initials: "AC",
    headline: "AI Systems Engineer",
    role: "AI Systems Engineer",
    shortBio:
        "Production-focused AI systems and full-stack engineer building practical GenAI products, RAG workflows, and backend-heavy applications.",
    longBio:
        "I build production-grade AI systems across agentic workflows, RAG pipelines, voice AI, and AI infrastructure. My work sits at the intersection of product engineering and applied AI: real APIs, auth, data flows, validation paths, deployment constraints, and user-facing interfaces that make AI behavior easier to trust.",
    location: "Pune, Maharashtra, India",
    timezone: "Asia/Kolkata",
    email,
    availability:
        "Open to AI engineering internships, full-stack roles, and product engineering opportunities.",
    preferredRoles: [
        "AI Engineering Intern",
        "Full-Stack Engineer Intern",
        "AI Systems / Agentic AI Developer",
        "Backend / Product Engineering roles",
    ],
    currentFocus: [
        "Agentic AI workflows",
        "RAG systems",
        "Voice AI agents",
        "AI infrastructure",
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
        "I'm looking for AI engineering, GenAI, full-stack, backend, cloud, and product engineering internship opportunities where I can contribute to useful, production-minded systems.",
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
