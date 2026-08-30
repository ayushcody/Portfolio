'use client';

import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';

import { systemsData } from '@/config/portfolio';

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
        <section id="interests" className="relative z-10 w-full overflow-hidden px-6 py-24 md:px-12">
            <div className="pointer-events-none absolute right-0 top-16 -z-10 h-72 w-72 rounded-full bg-pink/8 blur-[110px]" />
            <div className="pointer-events-none absolute left-0 bottom-10 -z-10 h-64 w-64 rounded-full bg-lime/6 blur-[110px]" />
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
                    <h3 className="bg-gradient-to-r from-white via-purple to-cyan bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">Systems I Build</h3>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {systemsData.map((sys) => (
                        <motion.div key={sys.id} variants={itemAnim} className="h-full">
                            <SkeuomorphicCard className="group flex h-full flex-col justify-between overflow-hidden">
                                <div className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-[56px] opacity-25 ${sys.bg.replace('/10', '/100')}`} />
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
