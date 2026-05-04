import { Logo } from "./logo";
import { Button } from "@workspace/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { ArrowRight, Facebook } from "iconsax-reactjs";
import Link from "next/link";
import { useState } from "react";

const socials = [
  {
    name: "X",
    icon: Facebook,
    url: "#",
  },
] as const;

export function CTA() {
  const [email, setEmail] = useState("");

  return (
    <section className="container" id="cta">
      <div className="cta">
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
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div className="">
            <Logo className="mb-4" />
            <p>
              The AI design auditor for ambitious teams. See the friction, fix
              the funnel.
            </p>
            <div className="footer-socials" style={{ marginTop: 16 }}>
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
          <div className="footer-col flex-flex-col ml-auto">
            <h5>Product</h5>
            <a href="#features">Features</a>
            <a href="#try">Try a demo</a>
            <a href="#how">How it works</a>
          </div>
        </div>

        {/* Bigmark */}
        <div
          className="relative font-serif  italic text-center tracking-tight text-transparent select-none bg-clip-text pointer-events-none overflow-hidden whitespace-nowrap leading-[0.9]"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(167, 139, 250, 0.5) 0%,
              rgba(139, 92, 246, 0.05) 100%
            )`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            fontSize: `clamp(140px, 22vw, 320px)`,
          }}
        >
          haya
        </div>

        <div className="footer-bottom">
          <span>© 2026 HAYA LABS · BUILT FOR TEAMS WHO SHIP</span>
          <span>v1.4.2 · ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </footer>
  );
}
