"use client";
import React from "react";
import { HAYA_TWEAKS_DEFAULTS } from "@/config/tweaks";
import { Bento } from "./bento";
import { CTA, Footer, Trusted } from "./footer";
import { Hero } from "./hero";
import { Steps } from "./steps";
import { TryHaya } from "./try-haya";
import {
  TweakRadio,
  TweakSection,
  TweaksPanel,
  useTweaks,
} from "./tweaks-panel";
import { Nav } from "./nav";

export function HomePage() {
  const [tweaks, setTweak] = useTweaks(HAYA_TWEAKS_DEFAULTS);

  // Apply theme variables based on tweaks
  React.useEffect(() => {
    const root = document.documentElement;
    const accents: Record<string, { c: string; g: string }> = {
      cyan: { c: "#22d3ee", g: "rgba(34,211,238,0.35)" },
      green: { c: "#34d399", g: "rgba(52,211,153,0.35)" },
      amber: { c: "#fbbf24", g: "rgba(251,191,36,0.35)" },
      pink: { c: "#f472b6", g: "rgba(244,114,182,0.35)" },
    };

    const a = accents[tweaks.accent] || accents.cyan;
    root.style.setProperty("--accent", a.c);
    root.style.setProperty("--accent-glow", a.g);

    const bgs = {
      midnight: { bg: "#07060d", s1: "#0c0a18", s2: "#100d1f" },
      ink: { bg: "#04030a", s1: "#08071a", s2: "#0c0a1f" },
      slate: { bg: "#0d0c1a", s1: "#141325", s2: "#1a1730" },
    };
    const b = bgs[tweaks.bg] || bgs.midnight;
    root.style.setProperty("--bg", b.bg);
    root.style.setProperty("--bg-2", b.s1);
    root.style.setProperty("--surface", b.s2);

    const motionMap = { calm: 0.6, lively: 1, chaotic: 1.6 };
    root.style.setProperty("--motion", motionMap[tweaks.motion] || 1);
  }, [tweaks]);

  return (
    <React.Fragment>
      <div className="bg-field" />
      <div className="shell">
        <Nav />
        <Hero tweaks={tweaks} />
        <Trusted />
        <Bento />
        <TryHaya />
        <Steps />
        <CTA />
        <Footer />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent" />
        <TweakRadio
          label="Color"
          value={tweaks.accent}
          options={["cyan", "green", "amber", "pink"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakSection label="Background" />
        <TweakRadio
          label="Tone"
          value={tweaks.bg}
          options={["midnight", "ink", "slate"]}
          onChange={(v) => setTweak("bg", v)}
        />
        <TweakSection label="Hero animation" />
        <TweakRadio
          label="Style"
          value={tweaks.heroAnim}
          options={["scan", "markers", "both", "none"]}
          onChange={(v) => setTweak("heroAnim", v)}
        />
        <TweakSection label="Motion intensity" />
        <TweakRadio
          label="Tempo"
          value={tweaks.motion}
          options={["calm", "lively", "chaotic"]}
          onChange={(v) => setTweak("motion", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}
