"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-350 ease-out",
        scrolled
          ? "border-cn-line bg-cn-bg/72 backdrop-blur-[18px] saturate-[1.4]"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="max-w-(--cn-maxw) mx-auto px-8 py-4 flex items-center justify-between gap-6">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-3 no-underline text-cn-text">
          <span className="w-8 h-8 rounded-[9px] bg-linear-to-br from-[#1a1a1e] to-[#0c0c0e] border border-cn-line-strong grid place-items-center overflow-hidden shrink-0 relative">
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_38%,(--cn-accent)_40%,(--cn-accent)_46%,transparent_48%,transparent_54%,(--cn-accent)_56%,(--cn-accent)_62%,transparent_64%)] opacity-[0.95]" />
          </span>
          <span className="font-display font-extrabold text-[19px] tracking-[-0.01em] uppercase leading-none">
            Circuit Nation
          </span>
        </a>

        {/* Desktop nav — hidden below 980px */}
        <nav className="hidden nav:flex items-center gap-8">
          {[["#about", "The Hub"], ["#globe", "Globe"], ["#amas", "AMAs"], ["#content", "Content"]].map(([href, label]) => (
            <a key={href} href={href}
              className="font-mono text-[12.5px] tracking-[0.1em] uppercase text-cn-muted no-underline transition-colors duration-200 hover:text-cn-text"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Button variant="cn-ghost" size="cn" asChild className="hidden nav:inline-flex">
            <a href="#content">Explore Content</a>
          </Button>
          <Button variant="cn-primary" size="cn" asChild>
            <a href="#join">
              <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
              Join the Community
            </a>
          </Button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav:hidden bg-white/4 border border-cn-line-strong text-cn-text rounded-[10px] px-4 py-2 font-mono text-[11px] tracking-[0.1em] uppercase cursor-pointer"
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cn-bg/95 backdrop-blur-[20px] border-t border-cn-line px-6 py-5 flex flex-col gap-4"
        >
          {[["#about", "The Hub"], ["#globe", "Globe"], ["#amas", "AMAs"], ["#content", "Content"], ["#join", "Join the Community"]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              className="font-mono text-[13px] tracking-[0.1em] uppercase text-cn-text no-underline"
            >{label}</a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
