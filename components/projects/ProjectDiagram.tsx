import {
    ArrowRight,
    ArrowUpRight,
    AudioLines,
    BookOpen,
    Bot,
    Boxes,
    Braces,
    Check,
    FileSearch,
    FileText,
    FlaskConical,
    Gauge,
    GitBranch,
    LayoutPanelTop,
    Mail,
    Scale,
    Search,
    Sparkles,
    SquareTerminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Project } from '@/src/data/projects';
import '@/components/projects.css';

type DiagramProject = Pick<Project, 'id' | 'title' | 'category' | 'techStack'> & Partial<Pick<Project, 'shortTitle'>>;

/**
 * Background slot for a project illustration: 0 lilac, 1 coral, 2 sage, 3 yellow
 * (the `.project-visual-N` colors from the homepage).
 */
export type VisualTone = 0 | 1 | 2 | 3;

// The four homepage builds keep the colors they have on the homepage.
const toneById: Record<string, VisualTone> = {
    'email-digital-twin': 0,
    andhakaanun: 1,
    dsakarle: 2,
    'research-saathi': 3,
};

const toneByCategory: Record<string, VisualTone> = {
    'Agentic AI': 0,
    'Voice AI': 0,
    'RAG Systems': 1,
    Archive: 1,
    'Full-Stack Product': 2,
    Labs: 2,
    'AI Infrastructure': 3,
    'Developer Tooling': 3,
};

/** Stable tone for a project, independent of where it appears in a list. */
export function projectTone(project: Pick<Project, 'id' | 'category'>): VisualTone {
    const known = toneById[project.id] ?? toneByCategory[project.category];
    if (known !== undefined) return known;
    let hash = 0;
    for (const char of project.id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    return (hash % 4) as VisualTone;
}

const categoryIcons: Record<string, LucideIcon> = {
    'Agentic AI': Bot,
    'RAG Systems': FileSearch,
    'Voice AI': AudioLines,
    'AI Infrastructure': Gauge,
    'Full-Stack Product': LayoutPanelTop,
    'Developer Tooling': SquareTerminal,
    Labs: FlaskConical,
};

function EmailDiagram() {
    return <div className="email-diagram"><div className="diagram-sheet"><Mail size={25} /><span>Your writing style</span><div className="diagram-lines"><i /><i /><i /></div></div><ArrowRight className="diagram-arrow" /><div className="diagram-sheet draft-sheet"><Sparkles size={25} /><span>A draft that fits.</span><div className="diagram-lines"><i /><i /><i /></div><span className="diagram-check"><Check size={12} /> Ready to review</span></div></div>;
}

function LawDiagram() {
    return <div className="law-diagram"><Scale size={52} strokeWidth={1.5} /><div className="law-branches"><span>Prosecution</span><span>Defense</span></div><div className="law-source"><BookOpen size={15} /> Shared context. Cited sources.</div></div>;
}

function AlgorithmDiagram() {
    return <div className="algorithm-diagram"><div className="algorithm-bars">{[36, 60, 46, 82, 100, 118].map((height, i) => <span key={i} style={{ height }} className={i > 3 ? 'is-sorted' : ''}>{[2, 4, 3, 6, 8, 9][i]}</span>)}</div><div className="algorithm-caption"><Braces size={17} /><span>Understand the why.</span><span className="diagram-play"><ArrowRight size={15} /></span></div></div>;
}

function ResearchDiagram() {
    return <div className="research-diagram"><div className="research-input"><Search size={17} /> One good question</div><div className="research-agents"><span><FileText size={21} /> Retrieve</span><span><GitBranch size={21} /> Reason</span><span><Check size={21} /> Verify</span></div><div className="research-output">A connected answer <ArrowUpRight size={17} /></div></div>;
}

/** Generic editorial illustration: the project as a note, pinned to its first few technologies. */
function StackDiagram({ project }: { project: DiagramProject }) {
    const Icon = categoryIcons[project.category] ?? Boxes;
    const stack = project.techStack.filter(Boolean).slice(0, 3);
    return (
        <div className="stack-diagram">
            <div className="diagram-sheet stack-sheet">
                <Icon size={25} />
                <span>{project.shortTitle || project.title}</span>
                <div className="diagram-lines"><i /><i /><i /></div>
            </div>
            {stack.length > 0 ? (
                <>
                    <ArrowRight className="diagram-arrow" />
                    <ul className="stack-stickers">
                        {stack.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </>
            ) : null}
        </div>
    );
}

const diagramsById: Record<string, () => React.JSX.Element> = {
    'email-digital-twin': EmailDiagram,
    andhakaanun: LawDiagram,
    dsakarle: AlgorithmDiagram,
    'research-saathi': ResearchDiagram,
};

/**
 * Decorative diagram for a project, matched by id so a reordered list never pairs a project
 * with another project's illustration. Wrap it in an element with role="img" and a label.
 */
export function ProjectDiagram({ project }: { project: DiagramProject }) {
    const Diagram = diagramsById[project.id];
    return Diagram ? <Diagram /> : <StackDiagram project={project} />;
}
