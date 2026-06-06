"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { Logo } from "../common/logo";
import { MenuIcon } from "lucide-react";

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
      <div className="max-w-(--cn-maxw) mx-auto px-8 py-2 flex items-center justify-between gap-6">
        {/* Desktop nav — hidden below 980px */}
        <nav className="hidden nav:flex items-center gap-8">
          {[
            ["#about", "The Hub"],
            ["#globe", "Globe"],
            ["#amas", "AMAs"],
            ["#content", "Content"],
          ].map(([href, label]) => (
            <Link
              key={href}
              to={href}
              className="font-mono text-xs tracking-[0.1em] uppercase text-cn-muted no-underline transition-colors duration-200 hover:text-cn-text"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline text-cn-text"
        >
          <Logo className="size-16 md:size-24" />
        </Link>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <Button
            variant="cn-primary"
            size="cn"
            className="nav:not-hidden"
            asChild
          >
            <Link to="#join">
              <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
              Join the Community
            </Link>
          </Button>
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav:hidden"
            aria-label="Menu"
            variant="cn-ghost"
          >
            <MenuIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cn-bg/95 backdrop-blur-[20px] border-t border-cn-line px-6 py-5 flex flex-col gap-4"
        >
          {[
            ["#about", "The Hub"],
            ["#globe", "Globe"],
            ["#amas", "AMAs"],
            ["#content", "Content"],
            ["#join", "Join the Community"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm tracking-[0.1em] uppercase text-cn-text no-underline"
            >
              {label}
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
