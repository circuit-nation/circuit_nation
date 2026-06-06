export default function LandingFooter() {
  return (
    <footer className="border-t border-cn-line bg-cn-bg-2">
      <div className="max-w-(--cn-maxw) mx-auto px-8 pt-[70px] pb-[50px] grid [grid-template-columns:1.5fr_1fr_1fr_1fr] max-nav:[grid-template-columns:1fr_1fr] max-[620px]:grid-cols-1 gap-10">
        <div>
          <a href="#top" className="flex items-center gap-3 no-underline text-cn-text mb-[18px]">
            <span className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#1a1a1e] to-[#0c0c0e] border border-cn-line-strong grid place-items-center overflow-hidden shrink-0 relative">
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_38%,var(--cn-accent)_40%,var(--cn-accent)_46%,transparent_48%,transparent_54%,var(--cn-accent)_56%,var(--cn-accent)_62%,transparent_64%)] opacity-[0.95]" />
            </span>
            <span className="font-display font-extrabold text-[19px] tracking-[-0.01em] uppercase leading-none">Circuit Nation</span>
          </a>
          <p className="text-cn-muted max-w-[300px] text-[14.5px]">
            Your ultimate hub to everything motorsports. Built by fans, for fans — across every series, every weekend.
          </p>
        </div>

        {[
          { heading: "Community", links: ["Discord", "Reddit", "Sim league", "Watch parties"] },
          { heading: "Content", links: ["Latest posts", "Videos", "AMAs", "Newsletter"] },
          { heading: "Follow", links: ["YouTube", "Instagram", "X / Twitter", "TikTok"] },
        ].map(col => (
          <div key={col.heading}>
            <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-cn-muted-2 mb-[18px]">{col.heading}</h4>
            {col.links.map(l => (
              <a
                key={l}
                href="#"
                className="block text-cn-muted no-underline text-[14.5px] py-[6px] transition-colors duration-200 hover:text-cn-text"
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-cn-line max-w-(--cn-maxw) mx-auto px-8 py-6 flex justify-between items-center gap-5 flex-wrap font-mono text-[11.5px] tracking-[0.08em] uppercase text-cn-muted-2">
        <span>© 2026 Circuit Nation — Built by fans, for fans.</span>
        <span>Not affiliated with any racing series or governing body.</span>
      </div>
    </footer>
  );
}
