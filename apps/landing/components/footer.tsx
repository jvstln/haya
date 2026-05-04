"use client";
import { LinkedInIcon, TwitterXIcon } from "@workspace/ui/components/icons";
import { Logo } from "./logo";
import { Button } from "@workspace/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { ArrowRight, Instagram } from "iconsax-reactjs";
import Link from "next/link";
import { useState, useRef } from "react";
import { useGSAP, gsap, SplitText } from "@workspace/ui/lib/gsap.util";

const socials = [
  {
    name: "X",
    icon: TwitterXIcon,
    url: "https://x.com/hayaonchain?s=11",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/usehaya.io?igsh=MTIyNjQ1YTQ2YjR5YQ%3D%3D&utm_source=qr",
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
    url: "https://www.linkedin.com/company/hayaai/",
  },
] as const;

export function CTA() {
  const [email, setEmail] = useState("");
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta > *", {
        scrollTrigger: {
          trigger: ".cta",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
      });
    },
    { scope: container },
  );

  return (
    <section className="container" id="cta" ref={container}>
      <div className="cta gsap-reveal">
        <h2 className="font-inter mb-4 text-balance">
          Your funnel <em>is leaking.</em>
          <br />
          Let&apos;s plug it.
        </h2>
        <p>
          Join the private beta. We&apos;re onboarding 12 design-led teams a
          week.
        </p>
        <InputGroup className="mx-auto h-auto max-w-150">
          <InputGroupInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />
          <InputGroupAddon align="inline-end">
            <Button>
              Request access
              <ArrowRight />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </section>
  );
}

export function Footer() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(".bigmark", {
        type: "chars",
        charsClass: "bigmark-char",
      });

      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: ".bigmark",
          start: "top 90%",
          end: "bottom bottom",
          scrub: 3,
        },
        x: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: container },
  );

  return (
    <footer className="footer" ref={container}>
      <div className="container">
        <div className="flex flex-col">
          <div className="self-end w-100">
            <Logo className="mb-4" />
            <p>
              The AI design auditor for ambitious teams. See the friction, fix
              the funnel.
            </p>
          </div>
          <div className="flex mx-auto gap-2 mt-4">
            {socials.map((social) => (
              <Button
                key={social.name}
                color="secondary"
                appearance="ghost"
                size="icon-lg"
                asChild
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon variant="Bold" />
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Bigmark */}
        <div
          className="bigmark gsap-reveal relative font-inter uppercase text-center tracking-widest select-none pointer-events-none overflow-hidden whitespace-nowrap leading-[0.9]"
          style={{
            fontSize: `clamp(140px, 22vw, 320px)`,
          }}
        >
          Haya
        </div>

        <div className="footer-bottom">
          <span>© 2026 HAYA LABS · BUILT FOR TEAMS WHO SHIP</span>
          <span>v1.4.2 · ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </footer>
  );
}
