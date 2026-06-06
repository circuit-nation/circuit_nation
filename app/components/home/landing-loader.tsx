"use client";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

export default function LandingLoader() {
  const [gone, setGone] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (unmounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-200 bg-cn-bg grid place-items-center transition-[opacity,visibility] duration-[600ms] ease-out",
        gone ? "opacity-0 invisible" : "opacity-100 visible"
      )}
      onTransitionEnd={() => { if (gone) setUnmounted(true); }}
    >
      <div className="text-center">
        <div className="font-display font-extrabold text-[clamp(38px,7vw,76px)] uppercase tracking-[-0.02em]">
          CIRCUIT <span className="text-cn-accent">NATION</span>
        </div>
        <div className="w-[min(360px,70vw)] h-1 bg-white/8 mx-auto mt-6 rounded-full overflow-hidden">
          <div className="block h-full w-0 bg-linear-to-r from-cn-accent-deep to-[#ff5a5a] shadow-[0_0_14px_(--cn-accent-glow)] animate-cn-load" />
        </div>
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-cn-muted-2 mt-4">
          Igniting the grid...
        </div>
      </div>
    </div>
  );
}
