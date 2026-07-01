import { cn } from "~/lib/utils";

interface SectionEyebrowProps {
  label: string;
  className?: string;
}

export function SectionEyebrow({ label, className }: SectionEyebrowProps) {
  return (
    <span
      className={cn(
        "font-mono text-sm font-medium tracking-widest uppercase text-cn-muted inline-flex items-center gap-3",
        className,
      )}
    >
      <span className="w-8 h-px bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)] shrink-0" />
      {label}
    </span>
  );
}
