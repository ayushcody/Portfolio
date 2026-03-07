'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, Cpu, Database, Network, Mic2 } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import { ProjectModal } from './ui/ProjectModal';
import { cn } from '@/lib/utils';

const projectsData = [
    {
        id: "agentic-soc",
        title: "Agentic SOC",
        description: "Autonomous security operations center utilizing multi-agent reasoning to triage and remediate alerts.",
        problem: "Triaging thousands of daily security alerts leads to extreme alert fatigue and missed critical incidents among security analysts.",
        architecture: "A hierarchical multi-agent system where specialized agents (Analysis, Threat Intel, Remediation) collaborate using a central LLM orchestrator. Built with LangGraph, utilizing memory across sessions.",
        tech: ["Python", "LangChain", "OpenAI", "FastAPI"],
        highlights: [
            "Reduced median alert triage time by 85%",
            "Implements dynamic tool selection for retrieving internal logs",
            "Self-correcting agent loop for handling ambiguous alerts"
        ],
        github: "https://github.com/ayushcody",
        icon: Network,
        color: "text-red-400",
        bg: "bg-red-400/10"
    },
    {
        id: "research-saathi",
        title: "Research Saathi",
        description: "Advanced RAG system for analyzing and synthesizing complex academic papers.",
        problem: "Researchers spend countless hours literature reviewing and cross-referencing papers manually.",
        architecture: "Hybrid RAG approach combining dense vector retrieval with keyword search. Employs a cross-encoder reranker before feeding context to the generation model.",
        tech: ["Next.js", "Weaviate", "Mistral", "HuggingFace"],
        highlights: [
            "Processes PDF layouts perfectly using OCR-based chunking",
            "Citations are mathematically verified against original text",
            "Interactive graph view of paper references"
        ],
        github: "https://github.com/ayushcody",
        icon: Database,
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        id: "email-twin",
        title: "Email Digital Twin",
        description: "Personalized AI that drafts and manages emails mimicking exact personal tone.",
        problem: "Writing context-aware, tonally accurate replies to varying email threads is a high cognitive load task.",
        architecture: "Fine-tuned LoRA adapter on top of Llama-3, trained on thousands of sent items. Integrated via webhook directly into Gmail API.",
        tech: ["PyTorch", "Llama-3", "AWS Lambda", "Google API"],
        highlights: [
            "Achieved 92% approval rate on zero-shot drafts",
            "Privacy-first: runs entirely on local edge nodes",
            "Context-aware memory of previous conversations"
        ],
        github: undefined,
        icon: Code2,
        color: "text-purple",
        bg: "bg-purple/10"
    },
    {
        id: "synergy-learn",
        title: "Synergy Learn",
        description: "Adaptive reinforcement learning environment for personalized curriculum pacing.",
        problem: "One-size-fits-all education paths leave struggling students behind and bore advanced learners.",
        architecture: "A Knowledge Tracing model coupled with a Deep Q-Network that selects the optimal next piece of content to maximize retention.",
        tech: ["TensorFlow", "React", "PostgreSQL", "RLlib"],
        highlights: [
            "Dynamically scales difficulty based on real-time performance",
            "Visually maps user knowledge graph",
            "Micro-service design for scalable content delivery"
        ],
        github: "https://github.com/ayushcody",
        icon: Cpu,
        color: "text-cyan",
        bg: "bg-cyan/10"
    },
    {
        id: "voice-cloner",
        title: "Voice Cloner",
        description: "Zero-shot voice cloning pipeline capable of robust synthesis from 3-second samples.",
        problem: "Creating custom text-to-speech voices typically requires hours of clean studio recording data.",
        architecture: "A VITS-based end-to-end TTS model adapted with a speaker encoder network for few-shot conditioning.",
        tech: ["Python", "Librosa", "PyTorch", "Gradio"],
        highlights: [
            "Synthesizes natural speech from 3s noisy audio",
            "Real-time inference factor of 0.4x on consumer GPUs",
            "Web interface for easy demonstration and endpoint API"
        ],
        github: "https://github.com/ayushcody",
        icon: Mic2,
        color: "text-orange",
        bg: "bg-orange/10"
    }
];

export default function SelectedProjects() {
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    return (
        <section id="projects" className="py-24 px-6 md:px-12 relative z-10 w-full">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Code2 className="text-cyan w-6 h-6" />
                        <h2 className="text-sm font-bold tracking-widest text-cyan uppercase">Project Explorer</h2>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Selected Systems</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedProject(project)}
                            className="cursor-pointer group h-full"
                        >
                            <SkeuomorphicCard className="h-full flex flex-col relative overflow-hidden">
                                {/* Soft glowing edge */}
                                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500", project.bg)} />

                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-white/5", project.bg, project.color)}>
                                        <project.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        {project.tech.slice(0, 2).map(t => (
                                            <span key={t} className="px-2 py-1 text-[10px] font-mono font-bold rounded-md bg-white/5 border border-white/10 text-muted">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold text-white mb-2 relative z-10">{project.title}</h4>
                                <p className="text-muted text-sm leading-relaxed mb-8 flex-grow relative z-10">
                                    {project.description}
                                </p>

                                {/* Hover Reveal */}
                                <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between relative z-10">
                                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-muted group-hover:from-cyan group-hover:to-purple transition-all duration-300">
                                        Explore System
                                    </span>
                                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-white/20 transition-all duration-300">
                                        →
                                    </span>
                                </div>
                            </SkeuomorphicCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            <ProjectModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </section>
    );
}
