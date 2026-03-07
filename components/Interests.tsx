import { BookOpen, Hammer, Coffee, Gamepad2, Mic2, MapPin } from 'lucide-react';
import FadeIn from './FadeIn';

const interests = [
    // ...
    {
        icon: BookOpen,
        title: "Reading",
        desc: "Currently: 'Creative Selection' by Ken Kocienda"
    },
    {
        icon: Hammer,
        title: "Side Project",
        desc: "Building a headless CMS for changelogs"
    },
    {
        icon: Coffee,
        title: "Ritual",
        desc: "Best ideas come during morning coffee runs"
    },
    {
        icon: Mic2,
        title: "Learning",
        desc: "Exploring WebGL and 3D interactions"
    },
    {
        icon: MapPin,
        title: "Recharge",
        desc: "Trail running on weekends"
    },
    {
        icon: Gamepad2,
        title: "Gaming",
        desc: "Playing indie games for UI inspiration"
    }
];

export default function Interests() {
    return (
        <section id="interests" className="py-24 px-6 md:px-12 bg-muted/5">
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Interests & Fun</h2>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {interests.map((item, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div
                                className="p-6 bg-background rounded-xl border border-muted/10 hover:border-accent-1/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4"
                            >
                                <div className="p-3 bg-muted/10 rounded-full text-foreground/70 group-hover:bg-accent-1 group-hover:text-white transition-colors duration-300">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
