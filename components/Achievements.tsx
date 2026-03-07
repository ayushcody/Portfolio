'use client';

import { motion } from 'framer-motion';
import { Award, Trophy } from 'lucide-react';
import { SkeuomorphicCard } from './ui/SkeuomorphicCard';
import Image from 'next/image';

const achievements = [
    {
        id: "blackpearl",
        title: "Winner",
        event: "Black Pearl Cybersecurity Hackathon",
        icon: Trophy,
        color: "text-orange",
        bg: "bg-orange/10",
        // Using a generic unsplash placeholder since real photo is not provided in context
        // In reality, this would be an actual photo from the event
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "shodh",
        title: "Runner Up",
        event: "Shodh Hackathon",
        icon: Award,
        color: "text-purple",
        bg: "bg-purple/10",
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    }
];

export default function Achievements() {
    return (
        <section id="achievements" className="py-24 px-6 md:px-12 relative z-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Trophy className="text-orange w-6 h-6" />
                        <h2 className="text-sm font-bold tracking-widest text-orange uppercase">Awards & Recognition</h2>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Achievements</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                        >
                            <SkeuomorphicCard className="p-0 overflow-hidden group">
                                <div className="relative h-64 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-background/20 mix-blend-multiply z-10 transition-opacity group-hover:opacity-0" />
                                    <Image
                                        src={item.image}
                                        alt={item.event}
                                        fill
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                    {/* Glassmorphism gradient overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface via-surface/80 to-transparent z-10" />

                                    {/* Badge */}
                                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                        <span className="text-sm font-bold text-white">{item.title}</span>
                                    </div>
                                </div>

                                <div className="relative z-20 p-6 -mt-8">
                                    <h4 className="text-2xl font-bold text-white mb-2">{item.event}</h4>
                                    <p className="text-muted font-medium">
                                        Ranked among top teams out of hundreds of participants, building production-ready AI tools within 48 hours.
                                    </p>
                                </div>
                            </SkeuomorphicCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
