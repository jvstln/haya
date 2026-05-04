"use client";
import React from "react";
import { Bento } from "./bento";
import { CTA, Footer } from "./footer";
import { Hero } from "./hero";
import { Steps } from "./steps";
import { TryHaya } from "./try-haya";
import { Nav } from "./nav";
import { LogoPlay } from "./logo";
import { useGSAP, gsap } from "@workspace/ui/lib/gsap.util";

export function HomePage() {
  const container = React.useRef(null);

  useGSAP(
    () => {
      gsap.from(".floating-owl", {
        y: 40,
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: "power4.out",
      });
    },
    { scope: container },
  );

  return (
    <div ref={container}>
      <div className="bg-field" />
      <div className="shell">
        <Nav />
        <Hero />
        <Bento />
        <TryHaya />
        <Steps />
        <CTA />
        <Footer />
      </div>
      <div className="floating-owl fixed bottom-10 right-10 z-60 gsap-reveal">
        <LogoPlay />
      </div>
    </div>
  );
}
