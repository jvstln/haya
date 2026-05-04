"use client";
import { Button } from "@workspace/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { ArrowRight } from "lucide-react";
import React, { useRef } from "react";
import { useGSAP, gsap } from "@workspace/ui/lib/gsap.util";
import Link from "next/link";
import { LINKS } from "@workspace/assets/data";

export function TryHaya() {
  const [url, setUrl] = React.useState("");
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".try-inner > *", {
        scrollTrigger: {
          trigger: ".try",
          start: "top 80%",
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
    <section className="section" id="try" ref={container}>
      <div className="container gsap-reveal">
        <div className="try">
          <div className="try-inner">
            <div className="section-eyebrow">03 · Try it now</div>
            <h3 className="font-inter mb-2 text-balance">
              Audit any live URL in <em>under 12 seconds.</em>
            </h3>
            <p>No signup. No install. Drop a link, watch Haya tear it apart.</p>

            <InputGroup className="h-auto">
              <InputGroupInput
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
              <InputGroupAddon align="inline-end">
                <Button size="lg" asChild>
                  <Link href={LINKS.webAppUrl}>
                    Run audit
                    <ArrowRight />
                  </Link>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
