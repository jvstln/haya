"use client";
import { ReactNode, useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@workspace/ui/lib/gsap.util";

interface BentoItem {
  cardClassName: string;
  icon: ReactNode;
  title: string;
  description: string;
  animAreaClassName?: string;
  animContent: ReactNode;
}

const bentoItems: BentoItem[] = [
  {
    cardClassName: "col-3 row-2",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 12h18M12 3v18" />
      </>
    ),
    title: "Ai Audit Engine",
    description:
      "Import your URL. Haya crawls every page, detects friction patterns, and screenshots every problem with a full explanation.",
    animContent: (
      <div className="scanner-mini">
        <div className="blocks">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
        <div className="scan"></div>
      </div>
    ),
  },
  {
    cardClassName: "col-3",
    icon: <path d="M3 3l7.07 19 2.51-7.42L20 12.07 3 3z" />,
    title: "x402 Payment",
    description:
      "Instant, permissionless micropayments via x402 protocol. No invoices, no delays — reviewers get paid the moment work is accepted.",
    animAreaClassName: "cursor-trail",
    animContent: (
      <svg viewBox="0 0 300 60" preserveAspectRatio="none">
        <path className="path" d="M10,30 Q60,5 110,30 T210,30 Q260,55 290,20" />
        <path
          className="cursor"
          transform="translate(10,30)"
          d="M0,0 L0,12 L4,9 L7,15 L9,14 L6,8 L11,8 Z"
        />
      </svg>
    ),
  },
  {
    cardClassName: "col-3",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 22h8M12 18v4" />
      </>
    ),
    title: "Screenshot Evidence",
    description:
      "Every flagged issue is backed by a screenshot of the exact page and element — no ambiguity, no back and forth.",
    animAreaClassName: "shot-stack",
    animContent: (
      <>
        <div className="shot"></div>
        <div className="shot"></div>
        <div className="shot"></div>
      </>
    ),
  },
  {
    cardClassName: "col-2",
    icon: <path d="M20 6L9 17l-5-5" />,
    title: "Fix Recommendations",
    description:
      "Every issue comes with a prioritized, actionable fix. Not a vague report — a clear instruction any developer can act on today.",
    animAreaClassName: "fix-list",
    animContent: (
      <>
        <div className="fix-item">
          <span className="check">✓</span> button.aria-label
        </div>
        <div className="fix-item">
          <span className="check">✓</span> input/autocomplete
        </div>
        <div className="fix-item">
          <span className="check">✓</span> focus-visible ring
        </div>
      </>
    ),
  },
  {
    cardClassName: "col-2",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    title: "UX Audit Marketplace",
    description:
      "List your product, set a bounty, and let expert UX reviewers compete to find your biggest friction points. Pay only for results.",
    animAreaClassName: "market-grid",
    animContent: (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="market-card"></div>
        ))}
      </>
    ),
  },
  {
    cardClassName: "col-2",
    icon: <path d="M12 2v20M2 12h20" />,
    title: "Human Intelligence Canvas",
    description:
      "Real human reviewers validate AI findings on a shared canvas — catching what machines miss and confirming what they find.",
    animContent: (
      <div className="x402-flow">
        <div className="x402-node">CI</div>
        <div className="x402-line">
          <div className="x402-pulse"></div>
        </div>
        <div className="x402-node">HAYA</div>
        <div className="x402-line">
          <div className="x402-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="x402-node">PR</div>
      </div>
    ),
  },
];

export function Bento() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".section-head > *", {
        scrollTrigger: {
          trigger: ".section-head",
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
      });

      gsap.from(".bento-card", {
        scrollTrigger: {
          trigger: ".bento",
          start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      });
    },
    { scope: container },
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="section" id="features" ref={container}>
      <div className="container gsap-reveal">
        <div className="section-head">
          <div className="section-eyebrow">02 · The product</div>
          <h2 className="font-inter mb-4 text-balance">
            Not just a scan. <em>A second pair of eyes.</em>
          </h2>
          <p className="section-sub">
            Six tools, one continuous loop — Haya watches every screen ship,
            flags every regression, and writes the fix before your team opens a
            ticket.
          </p>
        </div>

        <div className="bento">
          {bentoItems.map(
            ({
              cardClassName,
              icon,
              title,
              description,
              animAreaClassName,
              animContent,
            }) => (
              <div
                key={title}
                className={`bento-card ${cardClassName}`}
                onMouseMove={onMove}
              >
                <div className="icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {icon}
                  </svg>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div
                  className={`anim-area${animAreaClassName ? ` ${animAreaClassName}` : ""}`}
                >
                  {animContent}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
