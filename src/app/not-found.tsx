"use client";

import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.svg";

export default function NotFound() {
  const [sessionId, setSessionId] = useState("HAYA-SESSION-PENDING");

  useEffect(() => {
    // Generate a cool pseudo-session id on mount to match UX analytics theme
    const rand = Math.random().toString(16).substring(2, 10).toUpperCase();
    setSessionId(`HAYA-404-${rand}`);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#121212] px-6 text-foreground">
      {/* Decorative background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow effects */}
      <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute bottom-1/4 left-1/3 h-[350px] w-[350px] rounded-full bg-primary-compliment/10 blur-[100px]" />

      {/* Header logo */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Image
            src={logo}
            alt="Haya Logo"
            width={100}
            height={36}
            className="h-8 w-auto opacity-80 transition-opacity hover:opacity-100"
          />
        </Link>
      </div>

      {/* Main content container */}
      <div className="z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Animated tag */}
        <div className="mb-6 inline-flex animate-pulse items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 font-medium text-destructive-foreground text-xs">
          <AlertCircle className="size-3.5 text-primary-compliment" />
          <span>Friction Detected: Route Unresolved</span>
        </div>

        {/* Massive 404 text */}
        <h1 className="relative select-none font-bold font-syncopate text-[90px] leading-none tracking-tighter sm:text-[140px] md:text-[180px]">
          <span className="bg-linear-to-r from-[#FFAFA4] to-[#7A63FF] bg-clip-text text-transparent">
            404
          </span>
          {/* Subtle reflection/shadow overlay */}
          <span className="-z-10 absolute top-0 left-0 select-none bg-linear-to-r from-[#FFAFA4] to-[#7A63FF] bg-clip-text font-bold text-[90px] text-transparent opacity-35 blur-md sm:text-[140px] md:text-[180px]">
            404
          </span>
        </h1>

        {/* Titles */}
        <h2 className="mt-4 font-semibold font-syncopate text-lg text-white uppercase tracking-wider sm:text-xl md:text-2xl">
          Lost in the Block
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground text-sm leading-relaxed sm:text-base">
          The page you are looking for has either skipped an event, been
          relocated, or never existed in the current layout.
        </p>

        {/* Analytics Card Gimmick */}
        <div className="mt-8 w-full max-w-md rounded-xl border border-secondary bg-muted/40 p-5 text-left backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between border-secondary border-b pb-3">
            <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Behavioral Session Info
            </span>
            <span className="flex h-2 w-2 animate-ping rounded-full bg-destructive" />
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session ID:</span>
              <span className="font-medium text-white">{sessionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event Type:</span>
              <span className="text-primary-compliment">PAGE_NOT_FOUND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Severity:</span>
              <span className="font-medium text-destructive text-xxs uppercase">
                High Friction
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User Agent:</span>
              <span className="inline-block max-w-[200px] truncate text-white">
                {typeof window !== "undefined"
                  ? navigator.userAgent
                  : "Server-side Render"}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="mt-8 flex w-full max-w-md flex-col justify-center gap-4 sm:flex-row">
          <Button
            href="/"
            appearance="solid"
            color="primary"
            className="flex-1 animate-border-glow justify-center gap-2 rounded-full py-3 text-sm"
          >
            <Home className="size-4" />
            Go to Safety
          </Button>
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.back();
              }
            }}
            appearance="outline"
            color="secondary"
            className="flex-1 justify-center gap-2 rounded-full border-secondary py-3 text-sm hover:border-white/20"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Small footer branding info */}
      <div className="absolute bottom-6 text-center text-muted-foreground text-xxs uppercase tracking-widest">
        Haya UX Intelligence Engine &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
