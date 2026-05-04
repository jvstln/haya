"use client";
import React from "react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Logo } from "./logo";

export function Nav() {
  return (
    <nav className="nav backdrop-blur-xs">
      <div className="container nav-inner">
        <Link href="#">
          <Logo />
        </Link>
        <div className="nav-links">
          <a href="#features">Product</a>
          <a href="#how">How it works</a>
          <a href="#try">Try it</a>
        </div>
        <div className="nav-cta">
          <Button
            appearance="solid"
            color="primary"
            className="animate-border-glow rounded-full"
            asChild
          >
            <Link href="#cta">Request access</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
