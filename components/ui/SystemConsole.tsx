'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, Activity } from 'lucide-react';

const LOG_MESSAGES = [
    "> initializing ayush.systems()",
    "✓ 3 production applications shipped",
    "✓ 4–6 engineers led",
    "✓ 50–100 emails parsed for Persona Mail",
    "✓ 25+ DSA topics visualized",
    "✓ GenAI pipeline ready",
];

export function SystemConsole() {
    const [logs, setLogs] = useState<string[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const nextLogs = [...prev, LOG_MESSAGES[index % LOG_MESSAGES.length]];
                if (nextLogs.length > 5) nextLogs.shift();
                return nextLogs;
            });
            setIndex(prev => prev + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [index]);

    return (
        <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-cyan" />
                    <span className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">System Console</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-cyan/40" />
                </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 min-h-[160px] font-mono text-[11px] space-y-2">
                <AnimatePresence mode="popLayout">
                    {logs.map((log, i) => (
                        <motion.div
                            key={`${log}-${i}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2"
                        >
                            <span className="text-cyan mt-0.5"><ChevronRight className="w-3 h-3" /></span>
                            <span className={i === logs.length - 1 ? "text-white" : "text-muted"}>
                                {log}
                                {i === logs.length - 1 && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="inline-block w-1.5 h-3 bg-cyan ml-1 align-middle"
                                    />
                                )}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Terminal Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-muted">Core Engine: Active</span>
                </div>
                <div className="flex items-center gap-3">
                    <Activity className="w-3 h-3 text-purple/50" />
                    <span className="text-[9px] font-mono text-muted">74ms latency</span>
                </div>
            </div>
        </div>
    );
}
