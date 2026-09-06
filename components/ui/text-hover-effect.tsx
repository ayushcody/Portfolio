"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// Adapted from Aceternity UI's Text Hover Effect:
// https://ui.aceternity.com/components/text-hover-effect
// Uses the existing Framer Motion dependency, unique SVG IDs and measured glyph
// bounds so longer names stay centered without stretching or clipping the font.
export function TextHoverEffect({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const id = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  const [bounds, setBounds] = useState({ x: -5, y: -105, width: 850, height: 140 });
  const cursorX = useMotionValue(420);
  const cursorY = useMotionValue(-35);
  const smoothX = useSpring(cursorX, { stiffness: 220, damping: 35 });
  const smoothY = useSpring(cursorY, { stiffness: 220, damping: 35 });

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !textRef.current) return;
      const box = textRef.current.getBBox();
      if (!box.width || !box.height) return;
      const padding = 3;
      setBounds({
        x: box.x - padding,
        y: box.y - padding,
        width: box.width + padding * 2,
        height: box.height + padding * 2,
      });
      cursorX.jump(box.x + box.width / 2);
      cursorY.jump(box.y + box.height / 2);
    };
    const frame = requestAnimationFrame(measure);
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [text, cursorX, cursorY]);

  function moveHighlight(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType === "touch") return;
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    cursorX.set(local.x);
    cursorY.set(local.y);
  }

  const textProps = {
    x: 0,
    y: 0,
    fontSize: 100,
    fontWeight: 400,
    fill: "none",
    strokeWidth: 1.1,
    vectorEffect: "non-scaling-stroke",
    letterSpacing: "-0.025em",
  };

  return (
    <svg
      ref={svgRef}
      className="footer-name-effect"
      viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
      style={{ aspectRatio: `${bounds.width} / ${bounds.height}` }}
      preserveAspectRatio="xMidYMid meet"
      onPointerEnter={moveHighlight}
      onPointerMove={moveHighlight}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={`${id}-color`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f4d738" />
          <stop offset="25%" stopColor="#ff916f" />
          <stop offset="50%" stopColor="#c8a2ff" />
          <stop offset="75%" stopColor="#55dcdf" />
          <stop offset="100%" stopColor="#c49aff" />
        </linearGradient>
        <motion.radialGradient
          id={`${id}-reveal`}
          gradientUnits="userSpaceOnUse"
          cx={reducedMotion ? cursorX : smoothX}
          cy={reducedMotion ? cursorY : smoothY}
          r={bounds.width * 0.22}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="35%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}>
          <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} fill={`url(#${id}-reveal)`} />
        </mask>
      </defs>
      <text ref={textRef} {...textProps} className="footer-name-outline">{text}</text>
      <text {...textProps} className="footer-name-touch" stroke={`url(#${id}-color)`} aria-hidden="true">{text}</text>
      <text {...textProps} className="footer-name-highlight" stroke={`url(#${id}-color)`} mask={`url(#${id}-mask)`} aria-hidden="true">{text}</text>
    </svg>
  );
}
