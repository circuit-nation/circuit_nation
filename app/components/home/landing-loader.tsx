"use client";
import { useState, useEffect } from "react";

export default function LandingLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-cn-bg grid place-items-center transition-[opacity,visibility] duration-[600ms] ease-out"
      style={{ opacity: gone ? 0 : 1, visibility: gone ? "hidden" : "visible" }}
    >
      <div className="text-center">
        <div className="font-display font-extrabold text-[clamp(38px,7vw,76px)] uppercase tracking-[-0.02em]">
          CIRCUIT <span className="text-cn-accent">NATION</span>
        </div>
        <div className="w-[min(360px,70vw)] h-[3px] bg-white/[0.08] mx-auto mt-[22px] rounded-full overflow-hidden">
          <div className="block h-full w-0 bg-gradient-to-r from-cn-accent-deep to-[#ff5a5a] shadow-[0_0_14px_var(--cn-accent-glow)] animate-cn-load" />
        </div>
        <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-cn-muted-2 mt-4">
          Igniting the grid...
        </div>
      </div>
    </div>
  );
}
