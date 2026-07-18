"use client";
import { useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { Logo } from "../common/logo";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

const SCROLL_DELTA = 8;
const HIDE_AFTER = 50;

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const delta = latest - previous;

    setScrolled(latest > 30);

    if (latest <= HIDE_AFTER) {
      setHidden(false);
    } else if (delta > SCROLL_DELTA) {
      setHidden(true);
    } else if (delta < -SCROLL_DELTA) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  const isHidden = !reduceMotion && hidden;

  return (
    <motion.header
      initial={false}
      animate={{ y: isHidden ? "-100%" : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={isHidden}
      inert={isHidden}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-350 ease-out",
        isHidden && "pointer-events-none",
        scrolled
          ? "border-cn-line bg-cn-bg/72 backdrop-blur-[18px] saturate-[1.4]"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="max-w-(--cn-maxw) mx-auto py-2 flex items-center justify-center gap-8 md:gap-12">
        <nav className="flex items-center gap-8">
          <Link
            to="/#about"
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
            to="mailto:circuitnation4u@gmail.com"
            className="font-mono tracking-[0.1em] uppercase text-sm text-white/80 no-underline transition-colors duration-200 hover:text-cn-text"
          >
            Connect
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
