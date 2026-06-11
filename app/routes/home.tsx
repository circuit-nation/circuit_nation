import type { Route } from "./+types/home";
import LandingNav from "~/components/home/nav";
import LandingHero from "~/components/home/hero";
import LandingGlobe from "~/components/home/globe";
import LandingWhat from "~/components/home/what";
import LandingProof from "~/components/home/proof";
import LandingAMAs from "~/components/home/amas";
import LandingCollab from "~/components/home/collab";
import LandingPosts from "~/components/home/posts";
import LandingVideos from "~/components/home/videos";
import LandingTestimonials from "~/components/home/testimonials";
import LandingSocialWall from "~/components/home/social-wall";
import LandingJoin from "~/components/home/join";
import LandingFooter from "~/components/home/footer";
import LandingLoader from "~/components/home/loader";
import { RaceMarquee } from "~/components/home/race-marquee";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Circuit Nation | Your Ultimate Hub to Everything Motorsports" },
    {
      name: "description",
      content:
        "Formula 1, MotoGP, sim racing and the engineering obsession behind it all — gathered into one home for the fans who never miss lights-out.",
    },
  ];
}

export default function Home() {
  return (
    <div
      style={{
        background: "var(--cn-bg)",
        color: "var(--cn-text)",
        fontFamily: "var(--cn-body)",
        fontSize: 17,
        lineHeight: 1.6,
        WebkitFontSmoothing: "antialiased",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient atmosphere */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(1100px 600px at 78% -8%,rgba(255,45,45,0.16),transparent 60%),radial-gradient(900px 700px at 10% 8%,rgba(255,45,45,0.06),transparent 55%),radial-gradient(1000px 900px at 50% 120%,rgba(255,45,45,0.05),transparent 60%)",
        }}
      />
      {/* Film grain */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.05,
          mixBlendMode: "screen",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/*<LandingLoader />*/}
      <LandingNav />
      <RaceMarquee />
      <LandingHero />
      <LandingGlobe />
      <LandingWhat />
      {/*<LandingProof />*/}
      {/*<LandingAMAs />*/}
      {/*<LandingCollab />*/}
      <LandingPosts />
      <LandingVideos />
      <LandingTestimonials />
      <LandingSocialWall />
      <LandingJoin />
      <LandingFooter />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
