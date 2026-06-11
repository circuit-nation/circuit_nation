"use client";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { Logo } from "../common/logo";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

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
      <div className="max-w-(--cn-maxw) mx-auto py-2 flex items-center justify-center gap-8 md:gap-12">
        <nav className="flex items-center gap-8">
          <Link
            to="/about"
            className="font-mono tracking-[0.1em] uppercase text-sm text-white/80 no-underline transition-colors duration-200 hover:text-cn-text"
          >
            About
          </Link>
        </nav>
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline text-cn-text"
        >
          <Logo className="size-12 md:size-24" />
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/about"
            className="font-mono tracking-[0.1em] uppercase text-sm text-white/80 no-underline transition-colors duration-200 hover:text-cn-text"
          >
            Connect
          </Link>
        </nav>
      </div>
    </header>
  );
}
