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
      className={cn(
        "transition-[opacity,transform] duration-800 ease-spring",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
