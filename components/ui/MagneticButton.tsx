'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  intensity = 0.12,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [supportsHover, setSupportsHover] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setSupportsHover(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const enabled = supportsHover && !prefersReducedMotion;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    const safeIntensity = Math.min(intensity, 0.14);

    setPosition({ x: middleX * safeIntensity, y: middleY * safeIntensity });
  };

  const reset = () => {
    if (!enabled) return;
    setPosition({ x: 0, y: 0 });
  };

  if (!enabled) {
    return (
      <div ref={ref} className={cn('relative inline-flex', className)} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.18 }}
      className={cn('relative inline-flex', className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
