import { Logo } from "@workspace/assets/logo";
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
        <h2>
          Your funnel <em>is leaking.</em>
          <br />
          Let&apos;s plug it.
        </h2>
        <p>
          Join the private beta. We're onboarding 12 design-led teams a week.
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

export function Trusted() {
  const logos = [
    { t: "Northwind", cls: "" },
    { t: "LIGHTHOUSE", cls: "sans" },
    { t: "Cumulus", cls: "" },
    { t: "PRISM/CO", cls: "mono" },
    { t: "Atelier", cls: "" },
    { t: "OBSIDIAN", cls: "sans" },
  ];
  return (
    <section className="container">
      <div className="trusted">
        <div className="trusted-label">Backed and used by teams from</div>
        <div className="trusted-row">
          {logos.map((l, i) => (
            <span key={i} className={`trusted-logo ${l.cls}`}>
              {l.t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: 14 }}>
              <span className="logo-mark">
                <Logo className="size-5" />
              </span>
              HAYA
            </div>
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
                  size="icon-sm"
                  // className="flex"
                  // asChild
                >
                  {/* <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  > */}
                  <social.icon />
                  {/* </Link> */}
                </Button>
              ))}
            </div>
          </div>
          <div className="footer-col ml-auto">
            <h5>Product</h5>
            <a href="#features">Features</a>
            <a href="#try">Try a demo</a>
            <a href="#how">How it works</a>
          </div>
          {/* <div className="footer-col">
            <h5>Company</h5>
            <a href="#">About</a>
            <a href="#">Manifesto</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-col">
            <h5>Resources</h5>
            <a href="#">Documentation</a>
            <a href="#">API</a>
            <a href="#">Status</a>
            <a href="#">Privacy</a>
          </div> */}
        </div>

        <div className="bigmark">haya</div>

        <div className="footer-bottom">
          <span>© 2026 HAYA LABS · BUILT FOR TEAMS WHO SHIP</span>
          <span>v1.4.2 · ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </footer>
  );
}
