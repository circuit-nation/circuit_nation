export default function LandingFooter() {
  return (
    <footer className="border-t border-cn-line bg-cn-bg-2">
      <div className="border-t border-cn-line max-w-(--cn-maxw) mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs tracking-[0.08em] uppercase text-cn-muted-2">
        <span>
          © {new Date().getFullYear()} Circuit Nation - Built by fans, for fans.
        </span>
        <span>Not affiliated with any racing series or governing body.</span>
      </div>
    </footer>
  );
}
