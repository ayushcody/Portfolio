"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";

// Adapted from Aceternity UI's Text Hover Effect:
// https://ui.aceternity.com/components/text-hover-effect
// Uses unique SVG IDs and measured glyph bounds so longer names stay centered without stretching or
// clipping the font. The pointer-following mask is driven by one requestAnimationFrame loop that only
// runs while the highlight is moving, writes straight to the gradient (no React renders per frame),
// and stays static on touch devices (see signature-footer.css).

// Same feel as the previous Framer Motion spring (stiffness 220, damping 35, mass 1).
const STIFFNESS = 220;
const DAMPING = 35;
const STEP = 1 / 120;

type Spring = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  lastTime: number;
  frame: number;
  pointer: { x: number; y: number } | null;
};

export function TextHoverEffect({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const reducedMotionRef = useRef(false);
  const springRef = useRef<Spring>({ x: 420, y: -35, vx: 0, vy: 0, targetX: 420, targetY: -35, lastTime: 0, frame: 0, pointer: null });
  const id = useId().replace(/:/g, "");
  const [bounds, setBounds] = useState({ x: -5, y: -105, width: 850, height: 140 });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    const spring = springRef.current;
    return () => {
      query.removeEventListener("change", update);
      cancelAnimationFrame(spring.frame);
      spring.frame = 0;
    };
  }, []);

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
      // Rest the highlight at the center of the name; the gradient's JSX cx/cy match this.
      const spring = springRef.current;
      spring.x = spring.targetX = box.x + box.width / 2;
      spring.y = spring.targetY = box.y + box.height / 2;
      spring.vx = spring.vy = 0;
    };
    const frame = requestAnimationFrame(measure);
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [text]);

  function paint(x: number, y: number) {
    const gradient = gradientRef.current;
    if (!gradient) return;
    gradient.setAttribute("cx", x.toFixed(2));
    gradient.setAttribute("cy", y.toFixed(2));
  }

  function tick(time: number) {
    const spring = springRef.current;
    spring.frame = 0;

    // Convert the latest pointer position once per frame, however many events arrived.
    if (spring.pointer) {
      const matrix = svgRef.current?.getScreenCTM();
      if (matrix) {
        const inverse = matrix.inverse();
        const { x, y } = spring.pointer;
        spring.targetX = inverse.a * x + inverse.c * y + inverse.e;
        spring.targetY = inverse.b * x + inverse.d * y + inverse.f;
      }
      spring.pointer = null;
    }

    if (reducedMotionRef.current) {
      spring.x = spring.targetX;
      spring.y = spring.targetY;
      spring.vx = spring.vy = 0;
      spring.lastTime = 0;
      paint(spring.x, spring.y);
      return;
    }

    let elapsed = spring.lastTime ? Math.min((time - spring.lastTime) / 1000, 0.1) : 1 / 60;
    spring.lastTime = time;
    while (elapsed > 0) {
      const dt = Math.min(STEP, elapsed);
      spring.vx += (STIFFNESS * (spring.targetX - spring.x) - DAMPING * spring.vx) * dt;
      spring.vy += (STIFFNESS * (spring.targetY - spring.y) - DAMPING * spring.vy) * dt;
      spring.x += spring.vx * dt;
      spring.y += spring.vy * dt;
      elapsed -= dt;
    }

    const settled =
      Math.abs(spring.targetX - spring.x) < 0.2 &&
      Math.abs(spring.targetY - spring.y) < 0.2 &&
      Math.abs(spring.vx) < 0.2 &&
      Math.abs(spring.vy) < 0.2;

    if (settled) {
      spring.x = spring.targetX;
      spring.y = spring.targetY;
      spring.vx = spring.vy = 0;
      spring.lastTime = 0;
    } else {
      spring.frame = requestAnimationFrame(tick);
    }
    paint(spring.x, spring.y);
  }

  function moveHighlight(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType === "touch") return;
    const spring = springRef.current;
    spring.pointer = { x: event.clientX, y: event.clientY };
    if (!spring.frame) spring.frame = requestAnimationFrame(tick);
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
        <radialGradient
          ref={gradientRef}
          id={`${id}-reveal`}
          gradientUnits="userSpaceOnUse"
          cx={bounds.x + bounds.width / 2}
          cy={bounds.y + bounds.height / 2}
          r={bounds.width * 0.22}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="35%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
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
