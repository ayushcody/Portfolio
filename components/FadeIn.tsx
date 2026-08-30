'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function FadeIn({ children, delay = 0, className = '', direction = 'up' }: FadeInProps) {
    const prefersReducedMotion = useReducedMotion();
    const offset = prefersReducedMotion ? 0 : 12;
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
            x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.28,
                ease: [0.25, 0.4, 0.25, 1] as const, // easeOutQuart-ish
                delay: prefersReducedMotion ? 0 : Math.min(delay, 0.12),
            },
        },
    };

    return (
        <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? "visible" : undefined}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
