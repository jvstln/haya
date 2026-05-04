export function Bento() {
  const onMove = (e) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const cardProps = { onMouseMove: onMove };

  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">02 · The product</div>
          <h2>
            Not just a scan. <em>A second pair of eyes.</em>
          </h2>
          <p className="section-sub">
            Six tools, one continuous loop — Haya watches every screen ship,
            flags every regression, and writes the fix before your team opens a
            ticket.
          </p>
        </div>

        <div className="bento">
          {/* Auto-scan: large card */}
          <div className="bento-card col-3 row-2" {...cardProps}>
            <div className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 12h18M12 3v18" />
              </svg>
            </div>
            <h3>Continuous design audit</h3>
            <p>
              Haya re-scans every page after every deploy. Heuristic violations,
              accessibility regressions, and pattern drift surface in real time
              — not at the next quarterly review.
            </p>
            <div className="anim-area">
              <div className="scanner-mini">
                <div className="blocks">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i}></div>
                  ))}
                </div>
                <div className="scan"></div>
              </div>
            </div>
          </div>

          {/* Cursor heatmap */}
          <div className="bento-card col-3" {...cardProps}>
            <div className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3l7.07 19 2.51-7.42L20 12.07 3 3z" />
              </svg>
            </div>
            <h3>Cursor & rage-click replay</h3>
            <p>
              Watch real sessions hit the dead-ends Haya predicted. Filter by
              severity, replay in 2x.
            </p>
            <div className="anim-area cursor-trail">
              <svg viewBox="0 0 300 60" preserveAspectRatio="none">
                <path
                  className="path"
                  d="M10,30 Q60,5 110,30 T210,30 Q260,55 290,20"
                />
                <path
                  className="cursor"
                  transform="translate(10,30)"
                  d="M0,0 L0,12 L4,9 L7,15 L9,14 L6,8 L11,8 Z"
                />
              </svg>
            </div>
          </div>

          {/* Visual diff / replays */}
          <div className="bento-card col-3" {...cardProps}>
            <div className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 22h8M12 18v4" />
              </svg>
            </div>
            <h3>Visual regression</h3>
            <p>
              Pixel-level diffs across every breakpoint, every release. Catch
              the ghost-shifted button before QA does.
            </p>
            <div className="anim-area shot-stack">
              <div className="shot"></div>
              <div className="shot"></div>
              <div className="shot"></div>
            </div>
          </div>

          {/* Auto-fix list */}
          <div className="bento-card col-2" {...cardProps}>
            <div className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3>One-click fixes</h3>
            <p>Ship code-aware patches as PRs.</p>
            <div className="anim-area fix-list">
              <div className="fix-item">
                <span className="check">✓</span> button.aria-label
              </div>
              <div className="fix-item">
                <span className="check">✓</span> input/autocomplete
              </div>
              <div className="fix-item">
                <span className="check">✓</span> focus-visible ring
              </div>
            </div>
          </div>

          {/* Marketplace */}
          <div className="bento-card col-2" {...cardProps}>
            <div className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <h3>Pattern library</h3>
            <p>Pre-vetted components across 200+ shipped products.</p>
            <div className="anim-area market-grid">
              <div className="market-card"></div>
              <div className="market-card"></div>
              <div className="market-card"></div>
              <div className="market-card"></div>
              <div className="market-card"></div>
              <div className="market-card"></div>
            </div>
          </div>

          {/* x402 / agent payments */}
          <div className="bento-card col-2" {...cardProps}>
            <div className="icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <h3>Agentic workflows</h3>
            <p>Connect Haya to your CI, Linear, or Slack. It triages itself.</p>
            <div className="anim-area">
              <div className="x402-flow">
                <div className="x402-node">CI</div>
                <div className="x402-line">
                  <div className="x402-pulse"></div>
                </div>
                <div className="x402-node">HAYA</div>
                <div className="x402-line">
                  <div
                    className="x402-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
                <div className="x402-node">PR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
