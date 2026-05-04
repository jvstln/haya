"use client";
import React from "react";
import { Bento } from "./bento";
import { CTA, Footer } from "./footer";
import { Hero } from "./hero";
import { Steps } from "./steps";
import { TryHaya } from "./try-haya";
import { Nav } from "./nav";

export function HomePage() {
  return (
    <React.Fragment>
      <div className="bg-field" />
      <div className="shell">
        <Nav />
        <Hero />
        {/* <HeroStaging /> */}
        <Bento />
        <TryHaya />
        <Steps />
        <CTA />
        <Footer />
      </div>
    </React.Fragment>
  );
}
