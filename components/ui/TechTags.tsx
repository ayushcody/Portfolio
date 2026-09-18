import { cn } from "@/lib/utils";

/** The one tag style used for technologies across cards, timelines and case studies. */
export function TechTags({ items, label = "Technologies", max, className }: { items: string[]; label?: string; max?: number; className?: string }) {
  const visible = items.filter(Boolean).slice(0, max);
  if (visible.length === 0) return null;

  return (
    <ul className={cn("tag-list", className)} aria-label={label}>
      {visible.map((item) => (
        <li key={item} className="tag">{item}</li>
      ))}
    </ul>
  );
}
