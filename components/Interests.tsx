'use client';

import { motion } from 'framer-motion';
import { Network, Database, BrainCircuit, ServerCrash, Mic2, ShieldCheck, Cpu } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';

const systems = [
    {
        id: "agentic",
        icon: Network,
        title: "Agentic AI Systems",
        color: "text-purple",
        bg: "bg-purple/10",
        desc: "Autonomous agents capable of multi-step reasoning, tool use, and self-correction to solve complex workflows."
    },
    {
        id: "rag",
        icon: Database,
        title: "RAG Architectures",
        color: "text-cyan",
        bg: "bg-cyan/10",
        desc: "Advanced retrieval systems using vector databases, hybrid search, and reranking pipelines for grounded LLM generation."
    },
    {
        id: "pipelines",
        icon: BrainCircuit,
        title: "LLM Pipelines",
        color: "text-orange",
        bg: "bg-orange/10",
        desc: "End-to-end inference optimization, prompt engineering architectures, and evaluation frameworks for language models."
    },
    {
        id: "infra",
        icon: ServerCrash,
        title: "AI Infrastructure",
        color: "text-white",
        bg: "bg-white/10",
        desc: "Scalable deployment architectures, model parallel inference, and high-throughput streaming endpoints."
    },
    {
        id: "voice",
        icon: Mic2,
        title: "Voice AI",
        color: "text-purple",
        bg: "bg-purple/10",
        desc: "Real-time speech-to-text, zero-shot voice cloning, and low-latency voice synthesis pipelines."
    },
    {
        id: "security",
        icon: ShieldCheck,
        title: "AI Security",
        color: "text-cyan",
        bg: "bg-cyan/10",
        desc: "Adversarial testing, prompt injection prevention, and red-teaming enterprise AI applications."
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Interests() {
    return (
        <section id="interests" className="py-24 px-6 md:px-12 relative z-10 w-full">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Cpu className="text-purple w-6 h-6" />
                        <h2 className="text-sm font-bold tracking-widest text-purple uppercase">Architecture Focus</h2>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Systems I Build</h3>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {systems.map((sys) => (
                        <motion.div key={sys.id} variants={itemAnim} className="h-full">
                            <SkeuomorphicCard className="h-full group flex flex-col justify-between">
                                <div>
                                    <div className={`w-12 h-12 rounded-xl ${sys.bg} ${sys.color} flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                                        <sys.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3">{sys.title}</h4>
                                    <p className="text-muted leading-relaxed text-sm">
                                        {sys.desc}
                                    </p>
                                </div>
                                {/* Visual module indicator at the bottom */}
                                <div className="mt-8 flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === 0 ? sys.bg : 'bg-surface-hover'} group-hover:bg-white/20`}
                                            style={{ transitionDelay: `${i * 100}ms` }}
                                        />
                                    ))}
                                </div>
                            </SkeuomorphicCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
