"use client";
import React from "react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Logo } from "@workspace/assets/logo";

export function Nav() {
  return (
    <nav className="nav backdrop-blur-xs">
      <div className="container nav-inner">
        <a className="logo" href="#">
          <span className="logo-mark">
            <Logo className="size-5" />
          </span>
          HAYA
        </a>
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
