import { cn } from "~/lib/utils";

interface SectionEyebrowProps {
  label: string;
  className?: string;
}

export function SectionEyebrow({ label, className }: SectionEyebrowProps) {
  return (
    <span className={cn(
      "font-mono text-[12px] font-medium tracking-[0.26em] uppercase text-cn-muted inline-flex items-center gap-[10px]",
      className
    )}>
      <span className="w-[26px] h-px bg-cn-accent shadow-[0_0_8px_var(--cn-accent-glow)] shrink-0" />
      {label}
    </span>
  );
}
