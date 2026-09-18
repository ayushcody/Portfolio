// ============================================================================
// EXPERIENCE - Verified career timeline and backward-compatible UI data
// ============================================================================

export type ExperienceItem = {
    id?: string;
    company: string;
    /** Company logo: https URL or /public path. A styled initials mark renders when empty or broken. */
    companyLogo?: string;
    /** Editorial headline for the timeline chapter. */
    chapterTitle?: string;
    /** Short label for the chapter guide. */
    progressionLabel?: string;
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

// Reconciled with the supplied master resume; downloadable PDF remains separate.
export const experiencesData: ExperienceEntry[] = [
    {
        "id": "quensulting",
        "chapterTitle": "Let the systems talk.",
        "company": "Quensulting AI LLP",
        "role": "AI Voice Agents & Automation Engineer",
        "period": "May 2026 – Present",
        "type": "Current role",
        "location": "Pune, India · Remote",
        "progressionLabel": "Voice & automation",
        "color": "cyan",
        "shortSummary": "Connecting conversations to action: voice agents, backend services, and business workflows in one end-to-end system.",
        "responsibilities": [
            "Build and deploy Retell and Vapi voice agents, shaping call flows, intent recognition, and turn-taking; extend voice tooling with Dograh.",
            "Connect calls to CRMs, backend services, and follow-up actions through n8n, including handoffs to WhatsApp Business.",
            "Integrate ElevenLabs speech synthesis and build FastAPI services for call routing, session state, and persistence."
        ],
        "techStack": [
            "Retell",
            "Vapi",
            "Dograh",
            "ElevenLabs",
            "n8n",
            "FastAPI",
            "WhatsApp Business API"
        ],
        "featured": true,
        "impact": [
            "Build and deploy Retell and Vapi voice agents, shaping call flows, intent recognition, and turn-taking; extend voice tooling with Dograh.",
            "Connect calls to CRMs, backend services, and follow-up actions through n8n, including handoffs to WhatsApp Business.",
            "Integrate ElevenLabs speech synthesis and build FastAPI services for call routing, session state, and persistence."
        ],
        "contributions": [
            "Build and deploy Retell and Vapi voice agents, shaping call flows, intent recognition, and turn-taking; extend voice tooling with Dograh.",
            "Connect calls to CRMs, backend services, and follow-up actions through n8n, including handoffs to WhatsApp Business.",
            "Integrate ElevenLabs speech synthesis and build FastAPI services for call routing, session state, and persistence."
        ],
        "bullets": [
            "Build and deploy Retell and Vapi voice agents, shaping call flows, intent recognition, and turn-taking; extend voice tooling with Dograh.",
            "Connect calls to CRMs, backend services, and follow-up actions through n8n, including handoffs to WhatsApp Business.",
            "Integrate ElevenLabs speech synthesis and build FastAPI services for call routing, session state, and persistence."
        ],
        "tech": [
            "Retell",
            "Vapi",
            "Dograh",
            "ElevenLabs",
            "n8n",
            "FastAPI",
            "WhatsApp Business API"
        ],
        "description": "Connecting conversations to action: voice agents, backend services, and business workflows in one end-to-end system."
    },
    {
        "id": "persistent",
        "chapterTitle": "Make AI accountable.",
        "company": "Persistent Systems Inc.",
        "role": "GenAI Intern",
        "period": "Sep 2025 – Apr 2026",
        "type": "Internship",
        "location": "Pune, India",
        "progressionLabel": "Applied GenAI",
        "color": "purple",
        "shortSummary": "Building AI workflows is one half of the job. Measuring whether their answers hold up is the other.",
        "responsibilities": [
            "Designed and deployed agentic LLM workflows using embedding-based RAG, structured prompts, and Gemini on Google Cloud.",
            "Built evaluation pipelines combining self-reflection scoring, rule-based validators, hallucination detection, and model drift monitoring.",
            "Developed Persona Mail to model writing style from email history; refined token usage, latency, and prompt versions using measured feedback."
        ],
        "techStack": [
            "Python",
            "RAG",
            "Gemini",
            "Google Cloud",
            "LLM evaluation",
            "Prompt engineering"
        ],
        "featured": true,
        "impact": [
            "Designed and deployed agentic LLM workflows using embedding-based RAG, structured prompts, and Gemini on Google Cloud.",
            "Built evaluation pipelines combining self-reflection scoring, rule-based validators, hallucination detection, and model drift monitoring.",
            "Developed Persona Mail to model writing style from email history; refined token usage, latency, and prompt versions using measured feedback."
        ],
        "contributions": [
            "Designed and deployed agentic LLM workflows using embedding-based RAG, structured prompts, and Gemini on Google Cloud.",
            "Built evaluation pipelines combining self-reflection scoring, rule-based validators, hallucination detection, and model drift monitoring.",
            "Developed Persona Mail to model writing style from email history; refined token usage, latency, and prompt versions using measured feedback."
        ],
        "bullets": [
            "Designed and deployed agentic LLM workflows using embedding-based RAG, structured prompts, and Gemini on Google Cloud.",
            "Built evaluation pipelines combining self-reflection scoring, rule-based validators, hallucination detection, and model drift monitoring.",
            "Developed Persona Mail to model writing style from email history; refined token usage, latency, and prompt versions using measured feedback."
        ],
        "tech": [
            "Python",
            "RAG",
            "Gemini",
            "Google Cloud",
            "LLM evaluation",
            "Prompt engineering"
        ],
        "description": "Building AI workflows is one half of the job. Measuring whether their answers hold up is the other."
    },
    {
        "id": "syniris",
        "chapterTitle": "Own the whole product.",
        "company": "Syniris Technologies",
        "role": "Web Development Intern",
        "period": "Jun 2025 – Aug 2025",
        "type": "Internship",
        "location": "Remote",
        "progressionLabel": "Full-stack delivery",
        "color": "orange",
        "shortSummary": "Taking a notes and deadline platform from interface to deployment, with access control and reliability built in.",
        "responsibilities": [
            "Developed and deployed the full-stack platform, owning frontend and backend implementation.",
            "Implemented Firebase authentication and role-based access control for appropriately scoped user access.",
            "Established CI-based code review and production monitoring, and validated APIs with manual and functional Postman testing."
        ],
        "techStack": [
            "Firebase Auth",
            "Role-based access",
            "Postman",
            "CI workflows",
            "API testing"
        ],
        "featured": true,
        "impact": [
            "Developed and deployed the full-stack platform, owning frontend and backend implementation.",
            "Implemented Firebase authentication and role-based access control for appropriately scoped user access.",
            "Established CI-based code review and production monitoring, and validated APIs with manual and functional Postman testing."
        ],
        "contributions": [
            "Developed and deployed the full-stack platform, owning frontend and backend implementation.",
            "Implemented Firebase authentication and role-based access control for appropriately scoped user access.",
            "Established CI-based code review and production monitoring, and validated APIs with manual and functional Postman testing."
        ],
        "bullets": [
            "Developed and deployed the full-stack platform, owning frontend and backend implementation.",
            "Implemented Firebase authentication and role-based access control for appropriately scoped user access.",
            "Established CI-based code review and production monitoring, and validated APIs with manual and functional Postman testing."
        ],
        "tech": [
            "Firebase Auth",
            "Role-based access",
            "Postman",
            "CI workflows",
            "API testing"
        ],
        "description": "Taking a notes and deadline platform from interface to deployment, with access control and reliability built in."
    },
    {
        "id": "nexus",
        "chapterTitle": "Build with a team.",
        "company": "Nexus",
        "role": "Project Lead — Internship",
        "period": "Mar 2025 – May 2025",
        "type": "Internship",
        "location": "Remote",
        "progressionLabel": "Team leadership",
        "color": "purple",
        "shortSummary": "Helping 4–6 engineers move three applications forward together: Nexus Connect, Nexus AI, and Nexus Campus.",
        "responsibilities": [
            "Led sprint planning, task breakdown, and backlog management across three concurrent production applications.",
            "Maintained code review standards and responsible handling of API keys and secrets.",
            "Coordinated QA, deployment cycles, and stakeholder updates on timelines, blockers, and scope."
        ],
        "techStack": [
            "Sprint planning",
            "Code review",
            "Release coordination",
            "Quality assurance"
        ],
        "featured": true,
        "impact": [
            "Led sprint planning, task breakdown, and backlog management across three concurrent production applications.",
            "Maintained code review standards and responsible handling of API keys and secrets.",
            "Coordinated QA, deployment cycles, and stakeholder updates on timelines, blockers, and scope."
        ],
        "contributions": [
            "Led sprint planning, task breakdown, and backlog management across three concurrent production applications.",
            "Maintained code review standards and responsible handling of API keys and secrets.",
            "Coordinated QA, deployment cycles, and stakeholder updates on timelines, blockers, and scope."
        ],
        "bullets": [
            "Led sprint planning, task breakdown, and backlog management across three concurrent production applications.",
            "Maintained code review standards and responsible handling of API keys and secrets.",
            "Coordinated QA, deployment cycles, and stakeholder updates on timelines, blockers, and scope."
        ],
        "tech": [
            "Sprint planning",
            "Code review",
            "Release coordination",
            "Quality assurance"
        ],
        "description": "Helping 4–6 engineers move three applications forward together: Nexus Connect, Nexus AI, and Nexus Campus."
    },
    {
        "id": "acs",
        "chapterTitle": "Learn the weak points.",
        "company": "Association for Cyber Security",
        "role": "DevSec Intern",
        "period": "Sep 2024 – Feb 2025",
        "type": "Internship",
        "location": "Pune, India",
        "progressionLabel": "Security foundations",
        "color": "cyan",
        "shortSummary": "An early foundation in asking where a system can fail, through hands-on exposure to web and blockchain security.",
        "responsibilities": [
            "Conducted web application threat modeling to identify attack surfaces and map mitigation strategies.",
            "Performed introductory smart contract security assessments for applications with blockchain integration.",
            "Carried out web application security testing, building practical exposure across both domains."
        ],
        "techStack": [
            "Threat modeling",
            "Web security testing",
            "Smart contracts · introductory"
        ],
        "featured": false,
        "impact": [
            "Conducted web application threat modeling to identify attack surfaces and map mitigation strategies.",
            "Performed introductory smart contract security assessments for applications with blockchain integration.",
            "Carried out web application security testing, building practical exposure across both domains."
        ],
        "contributions": [
            "Conducted web application threat modeling to identify attack surfaces and map mitigation strategies.",
            "Performed introductory smart contract security assessments for applications with blockchain integration.",
            "Carried out web application security testing, building practical exposure across both domains."
        ],
        "bullets": [
            "Conducted web application threat modeling to identify attack surfaces and map mitigation strategies.",
            "Performed introductory smart contract security assessments for applications with blockchain integration.",
            "Carried out web application security testing, building practical exposure across both domains."
        ],
        "tech": [
            "Threat modeling",
            "Web security testing",
            "Smart contracts · introductory"
        ],
        "description": "An early foundation in asking where a system can fail, through hands-on exposure to web and blockchain security."
    }
];
