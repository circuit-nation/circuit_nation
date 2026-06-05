"use client";
import { useInView } from "react-intersection-observer";
import { cn } from "~/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}

export function Reveal({ children, delay = 0, className, threshold = 0.15 }: RevealProps) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={cn("transition-[opacity,transform] duration-[800ms]", className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(26px)",
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
        transitionDelay: delay > 0 ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}
