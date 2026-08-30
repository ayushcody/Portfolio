'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const offset = prefersReducedMotion ? 0 : 12;

  const directions = {
    up: { y: offset, x: 0 },
    down: { y: -offset, x: 0 },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, ...directions[direction] }}
      animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{
        duration: prefersReducedMotion ? 0 : Math.min(duration, 0.32),
        delay: prefersReducedMotion ? 0 : Math.min(delay, 0.12),
        ease: [0.21, 0.47, 0.32, 0.98], // Custom premium easing curve
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
