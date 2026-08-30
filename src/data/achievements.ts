import { Trophy, Award, Medal, Star, type LucideIcon } from "lucide-react";

// ============================================================================
// ACHIEVEMENTS - Verified recognitions with gallery compatibility
// ============================================================================

export type Achievement = {
    title: string;
    date?: string;
    year?: string;
    type?: "Hackathon" | "Award" | "Certification" | "Open Source" | "Recognition" | "Other";
    context: string;
    outcome?: string;
    proofUrl?: string;
    featured?: boolean;

    // Backward compatibility.
    description?: string;
};

export type AchievementEntry = Achievement & {
    id: string;
    event: string;
    image?: string;
    imageAlt: string;
    proofLabel: string;
    icon: LucideIcon;
    color: string;
    bg: string;
};

export const achievementsData: AchievementEntry[] = [
    {
        id: "blackpearl",
        title: "Winner",
        event: "Black Pearl Cybersecurity Hackathon",
        date: "Nov 2025",
        year: "2025",
        type: "Hackathon",
        context:
            "A 24-hour cybersecurity hackathon focused on building security tools and demonstrating offensive/defensive security techniques.",
        outcome: "Won 1st place with a security-focused build.",
        featured: true,
        description:
            "Won a 24-hour cybersecurity hackathon focused on building security tools and demonstrating offensive/defensive security techniques.",
        imageAlt: "Ayush Chougula at the Black Pearl Cybersecurity Hackathon",
        proofLabel: "1st place • 24-hour build",
        icon: Trophy,
        color: "text-orange",
        bg: "bg-orange/10",
    },
    {
        id: "shodh",
        title: "Runner-Up",
        event: "Shodh 3-Day Hackathon",
        date: "Apr 2025",
        year: "2025",
        type: "Hackathon",
        context:
            "A 3-day innovation hackathon requiring a working prototype from ideation through presentation.",
        outcome: "Placed second with a working prototype.",
        featured: true,
        description:
            "Placed second in a 3-day innovation hackathon, building a working prototype from ideation to presentation.",
        imageAlt: "Ayush Chougula at Shodh 3-Day Hackathon",
        proofLabel: "Runner-up • 3-day prototype",
        icon: Award,
        color: "text-purple",
        bg: "bg-purple/10",
    },
    {
        id: "vois",
        title: "Top 50 Teams in India",
        event: "VOIS Hackathon",
        date: "Feb 2026",
        year: "2026",
        type: "Recognition",
        context:
            "A competitive national hackathon organized by Vodafone Intelligent Solutions.",
        outcome: "Selected among the top 50 teams nationally.",
        featured: true,
        description:
            "Selected among the top 50 teams nationally in a competitive hackathon organized by Vodafone Intelligent Solutions.",
        imageAlt: "Ayush Chougula VOIS Hackathon recognition",
        proofLabel: "Top 50 teams • National selection",
        icon: Medal,
        color: "text-cyan",
        bg: "bg-cyan/10",
    },
    {
        id: "dsa-bootcamp",
        title: "First Prize",
        event: "DSA CodeChef x GeeksForGeeks Bootcamp",
        date: "Apr 2024",
        year: "2024",
        type: "Award",
        context:
            "A DSA and competitive programming bootcamp co-organized by CodeChef and GeeksForGeeks.",
        outcome: "Won first place.",
        featured: false,
        description:
            "Won first place in a DSA and competitive programming bootcamp co-organized by CodeChef and GeeksForGeeks.",
        imageAlt: "Ayush Chougula DSA bootcamp first prize",
        proofLabel: "First prize • DSA/CP",
        icon: Star,
        color: "text-white",
        bg: "bg-white/10",
    },
];

export const featuredAchievements = achievementsData.filter((achievement) => achievement.featured);
