import { cn } from "@/lib/utils";
import React from "react";

interface SkeuomorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function SkeuomorphicCard({ children, className, hover = true, ...props }: SkeuomorphicCardProps) {
    return (
        <div
            className={cn(
                "relative bg-surface/90 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm",
                "border border-white/10",
                "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.4)]",
                hover && "hover:-translate-y-1 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_18px_35px_rgba(0,0,0,0.55)] hover:border-white/20",
                className
            )}
            {...props}
        >
            {/* Soft inner glow gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
