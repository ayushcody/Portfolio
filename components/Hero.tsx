import Link from 'next/link';
import FadeIn from './FadeIn';

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 max-w-7xl mx-auto">
            <div className="space-y-6">
                <FadeIn delay={0.1}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                        Ayush Chougula
                    </h1>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <div className="space-y-4 max-w-3xl">
                        <p className="text-2xl md:text-3xl lg:text-4xl text-muted font-light leading-snug">
                            I design systems that scale, build tools teams actually use, and ship products people love.
                        </p>

                        <div className="flex items-center gap-3 text-lg md:text-xl font-medium pt-2">
                            <span className="w-2 h-2 rounded-full bg-accent-2 animate-pulse" />
                            <span>Currently building @ Stealth Startup</span>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.5}>
                    <div className="pt-8">
                        <Link
                            href="#projects"
                            className="inline-flex items-center gap-2 border-2 border-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-foreground hover:text-background transition-all duration-300 group"
                        >
                            View selected work
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
