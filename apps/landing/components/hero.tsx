import { Button } from "@workspace/ui/components/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { HAYA_TWEAKS_DEFAULTS } from "@/config/tweaks";
import { OwlBackground } from "./owl-background/owl-background";

type HeroProps = { tweaks: typeof HAYA_TWEAKS_DEFAULTS };

export function Hero({ tweaks }: HeroProps) {
  const dashRef = React.useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dashRef.current) return;
    const r = dashRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: cy * -3, y: cx * 4 });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section className="hero relative">
      <OwlBackground />
      <div className="max-md:px-5 max-md:py-0">
        <div className="eyebrow">
          <span className="dot" />
          PRIVATE BETA · INVITE ONLY
        </div>
        <h1
          className="font-inter text-balance mb-4 leading-none tracking-tight"
          style={{
            fontSize: "clamp(48px, 7vw, 92px)",
          }}
        >
          See the friction.
          <br />
          <em>Fix the funnel.</em>
        </h1>
        <p className="tag">
          Haya is the AI design auditor for ambitious teams. It scans every
          screen, surfaces every dead-end, and ships fixes before your users
          churn.
        </p>
        <div className="hero-ctas">
          <Button
            appearance="solid"
            color="primary"
            size="lg"
            className="animate-border-glow rounded-full"
            asChild
          >
            <Link href="#try">
              Run a free audit
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button
            appearance="outline"
            color="secondary"
            size="lg"
            className="rounded-full"
            asChild
          >
            <Link href="#how">
              How it works
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <div
          role="none"
          className="dashboard-wrap"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          {/* {tweaks.heroAnim !== "none" && <div className="dashboard-glow" />} */}

          <div
            ref={dashRef}
            className="dashboard"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            <DashboardChrome />
            <div className="db-body">
              <DashboardSide />
              <DashboardMain heroAnim={tweaks.heroAnim} />
              <DashboardRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardChrome() {
  return (
    <div className="db-topbar">
      <div className="db-topbar-left">
        <div style={{ display: "flex", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#3b3b4a",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#3b3b4a",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#3b3b4a",
            }}
          />
        </div>
        <span className="db-pill">
          app.usehaya.io / projects / acme-checkout
        </span>
      </div>
      <div className="db-topbar-right">
        <span className="db-pill" style={{ color: "#34d399" }}>
          ● Live audit
        </span>
        <span className="db-pill">⌘K</span>
      </div>
    </div>
  );
}

function DashboardSide() {
  const items = [
    { label: "Overview", active: false },
    { label: "Screens", active: true },
    { label: "Findings", active: false },
    { label: "Fixes", active: false },
    { label: "Replays", active: false },
    { label: "Integrations", active: false },
  ];
  return (
    <div className="db-side">
      <div className="db-side-label">Workspace</div>
      {items.map((it) => (
        <div
          key={it.label}
          className={`db-side-item ${it.active ? "active" : ""}`}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: it.active
                ? "linear-gradient(135deg,#a78bfa,#7c3aed)"
                : "rgba(255,255,255,0.06)",
            }}
          />
          {it.label}
        </div>
      ))}
      <div className="db-side-label" style={{ marginTop: 16 }}>
        Severity
      </div>
      {[
        { c: "#f87171", t: "High", n: 4 },
        { c: "#fbbf24", t: "Medium", n: 7 },
        { c: "#34d399", t: "Low", n: 12 },
      ].map((s) => (
        <div
          key={s.c + s.t + s.n}
          className="db-side-item"
          style={{ justifyContent: "space-between" }}
        >
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.c,
              }}
            />
            {s.t}
          </span>
          <span
            style={{ color: "#6b6688", fontFamily: "Geist Mono", fontSize: 11 }}
          >
            {s.n}
          </span>
        </div>
      ))}
    </div>
  );
}

function DashboardMain({
  heroAnim,
}: {
  heroAnim: HeroProps["tweaks"]["heroAnim"];
}) {
  return (
    <div className="db-main">
      <div className="db-main-tabs">
        <span className="db-main-tab active">Checkout</span>
        <span className="db-main-tab">Onboarding</span>
        <span className="db-main-tab">Pricing</span>
      </div>
      <div className="db-canvas">
        <div className="db-canvas-page">
          <h3 className="font-inter mb-1">Complete your order</h3>
          <div className="sub">Step 3 of 4 · Secure checkout</div>
          <div className="db-canvas-grid">
            <div className="db-canvas-tile" />
            <div className="db-canvas-tile" />
            <div className="db-canvas-tile" />
          </div>
          <div className="db-canvas-row mid" />
          <div className="db-canvas-row short" />
          <div className="db-canvas-row" />
          <div className="db-canvas-row mid" />
          <div className="db-canvas-cta" />
        </div>

        {(heroAnim === "scan" || heroAnim === "both") && (
          <div className="scan-line" />
        )}

        {(heroAnim === "markers" || heroAnim === "both") && (
          <React.Fragment>
            <FrictionMarker
              top="38%"
              left="22%"
              delay={0.6}
              severity="HIGH"
              label="Card field rejects spaces"
            />
            <FrictionMarker
              top="60%"
              left="74%"
              delay={1.2}
              severity="MED"
              label="No autofill on ZIP"
            />
            <FrictionMarker
              top="84%"
              left="32%"
              delay={1.8}
              severity="HIGH"
              label="CTA below the fold"
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function FrictionMarker({
  top,
  left,
  delay,
  severity,
  label,
}: {
  top: string;
  left: string;
  delay: number;
  severity: string;
  label: string;
}) {
  return (
    <div
      className="friction"
      style={{ top, left, animationDelay: `${delay}s` }}
    >
      <div className="friction-pulse" style={{ animationDelay: `${delay}s` }} />
      <div className="friction-core" />
      <div className="friction-label">
        <span className="sev">{severity}</span>
        {label}
      </div>
    </div>
  );
}

function DashboardRight() {
  const findings = [
    {
      sev: "high",
      t: "Card field rejects spaces",
      d: "Auto-format violates expected input · 28% drop",
    },
    {
      sev: "high",
      t: "CTA below the fold",
      d: "Primary action hidden on 67% of viewports",
    },
    {
      sev: "med",
      t: "No autofill on ZIP code",
      d: "Mobile users typing 5 digits manually",
    },
    {
      sev: "low",
      t: "Trust badges low contrast",
      d: "WCAG AA fail · 3.2:1 ratio",
    },
  ];
  return (
    <div className="db-right">
      <div className="db-findings-h">
        <span className="ttl">Findings</span>
        <span className="count">23 issues</span>
      </div>
      {findings.map((f, i) => (
        <div key={`${f.sev}-${i}`} className="db-finding">
          <div className="db-finding-h">
            <span className={`sev-chip ${f.sev}`}>{f.sev}</span>
            <span className="db-finding-title">{f.t}</span>
          </div>
          <div className="db-finding-desc">{f.d}</div>
        </div>
      ))}
    </div>
  );
}
