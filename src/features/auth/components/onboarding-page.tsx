"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { gsap, SplitText, useGSAP } from "@/lib/gsap.util";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/stores";

interface Slide {
  id: number;
  title: string;
  description: React.ReactNode;
  animatedImageUrl: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Meet Haya, Your Behavioral Intelligence Layer",
    description: (
      <>
        Stop guessing what's hurting your product. Haya AI{" "}
        <span className="text-[#FFAFA4]">
          uncovers the hidden behavioral patterns behind every click
        </span>
        , hesitation, and drop-off—so your team knows exactly what to improve to
        drive growth.
      </>
    ),
    animatedImageUrl: "/images/meet-haya.gif",
  },
  {
    id: 2,
    title: "Test User Behavior Before You Ship",
    description: (
      <>
        Validate new features before they go live. Haya{" "}
        <span className="text-[#FFAFA4]">
          simulates real user journeys using five specialized AI agents
        </span>
        , helping you uncover friction, predict user behavior, and refine the
        experience before your customers ever see it.
      </>
    ),
    animatedImageUrl: "/images/experience.gif",
  },
  {
    id: 3,
    title: "Connect Your Product, See Real-Time User Behavior",
    description: (
      <>
        Install the Haya SDK in minutes to monitor how users interact with your
        product in <span className="text-[#FFAFA4]">real time</span>. Detect
        friction as it happens, understand why it occurs, and receive behavioral
        recommendations your team can act on immediately.
      </>
    ),
    animatedImageUrl: "/images/sdk.gif",
  },
  {
    id: 4,
    title: "Behavioral Personas, Not Demographics",
    description: (
      <>
        Move beyond age and gender. Haya AI automatically groups users by how
        they interact with your product, revealing meaningful{" "}
        <span className="text-[#FFAFA4]">behavioral personas</span> that help
        you understand every user and build experiences they'll love.
      </>
    ),
    animatedImageUrl: "/images/persona.gif",
  },
  {
    id: 5,
    title: "Stay Updated Everywhere",
    description: (
      <>
        Never miss a critical user signal. Get behavioral reports, friction
        alerts, and actionable recommendations sent{" "}
        <span className="text-[#FFAFA4]">
          directly to Slack, WhatsApp, Telegram
        </span>
        , or your team's preferred communication channel.
      </>
    ),
    animatedImageUrl: "/images/channel.gif",
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState({ current: 0, previous: -1 });
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    async () => {
      const direction: 1 | -1 = index.current > index.previous ? 1 : -1;

      // Selectors
      const currentContent = `[data-slot="current-title"], [data-slot="current-description"]`;
      const previousContent = `[data-slot="previous-title"], [data-slot="previous-description"]`;
      const imageContainer = `[data-slot="images"]`;
      const currentImage = `${imageContainer} [data-index="${index.current}"]`;
      const previousImage = `${imageContainer} [data-index="${index.previous}"]`;
      const currentIndicator = `[data-slot="indicator-${index.current}"]`;
      const previousIndicator = `[data-slot="indicator-${index.previous}"]`;

      // Setters
      gsap.set(`${imageContainer} .outer:not(${previousImage})`, {
        yPercent: 100,
      });
      gsap.set(`${imageContainer} .inner:not(${previousImage} .inner)`, {
        yPercent: -100,
      });
      gsap.set(previousImage, { zIndex: 0 });
      gsap.set(currentImage, { zIndex: 1, yPercent: 100 * direction });
      gsap.set(`${currentImage} .inner`, { yPercent: -100 * direction });
      gsap.set(`${currentImage} img`, { y: 15 * direction });

      const previousSplitText = SplitText.create(previousContent, {
        type: "words",
      });
      const currentSplitText = SplitText.create(currentContent, {
        type: "words",
        wordsClass: "invisible",
      });

      // Exit animation
      await gsap
        .timeline()
        .timeScale(2.5)
        .to(previousSplitText.words, {
          autoAlpha: 0,
          stagger: {
            each: 0.03,
            from: "end",
            ease: "power1.inOut",
          },
        })
        .to(
          previousIndicator,
          {
            "--scale": 0,
            "--origin": direction === 1 ? "right" : "left",
          },
          0,
        );

      // Enter animation
      gsap
        .timeline()
        .to(currentContent, { autoAlpha: 1 }, 0)
        .to(
          currentSplitText.words,
          {
            autoAlpha: 1,
            stagger: {
              each: 0.03,
              ease: "power1.inOut",
            },
          },
          0,
        )
        .to(`${currentImage}`, { yPercent: 0 }, 0)
        .to(`${currentImage} .inner`, { yPercent: 0 }, 0)
        .to(`${currentImage} img`, { y: 0 }, 0)
        .to(`${previousImage} img`, { y: -15 * direction }, 0)
        .to(
          currentIndicator,
          {
            "--scale": 1,
            "--origin": direction === 1 ? "left" : "right",
          },
          0,
        );

      // ----- Misc -----
      // Animate button svg
      gsap.fromTo(
        "button svg path",
        { drawSVG: "50% 50%" },
        {
          drawSVG: true,
          yoyo: true,
          repeat: -1,
        },
      );
    },
    { scope: containerRef, dependencies: [index.current] },
  );

  const handleStep = (nextStepIndex: number) => {
    if (nextStepIndex === index.current) return;
    setIndex({
      current: Math.min(Math.max(0, nextStepIndex), slides.length - 1),
      previous: index.current,
    });
  };

  const currentSlide = slides[index.current];
  const previousSlide = slides[index.previous];

  return (
    <div
      ref={containerRef}
      className="flex size-full h-dvh max-h-dvh *:shrink-0"
    >
      <div className="relative flex h-full w-full select-none flex-col bg-(--bg) [--bg:#131315]">
        <Image
          src="/logo.svg"
          alt="logo"
          width={119}
          height={43}
          className="my-4 h-8 self-center"
        />

        {/* Images */}
        <div
          className="gsap-reveal relative flex h-full overflow-y-hidden"
          data-slot="images"
        >
          {slides.map((slide, index) => {
            return (
              <div
                key={slide.title}
                className="outer absolute inset-0 z-0 flex w-full overflow-hidden bg-(--bg)"
                data-index={index}
              >
                <div className="inner relative w-full">
                  <Image
                    src={slide.animatedImageUrl}
                    alt={slide.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex h-full max-h-94 flex-0 justify-center bg-(--bg) py-20">
          <div
            key={index.current}
            className="flex w-185 flex-col items-center gap-4 px-6 text-center"
          >
            {/* Content wrapper */}
            <div className="relative">
              {/* Current content  */}
              <div className="flex flex-col items-center gap-4">
                <h1 className="invisible text-h3" data-slot="current-title">
                  {currentSlide.title}
                </h1>
                <p
                  className="invisible text-muted-foreground text-sm"
                  data-slot="current-description"
                >
                  {currentSlide.description}
                </p>
              </div>
              {/* Previous content  */}
              {previousSlide && (
                <div className="absolute top-0 flex flex-col items-center gap-4">
                  <h1
                    className="gsap-reveal text-h3"
                    data-slot="previous-title"
                  >
                    {previousSlide.title}
                  </h1>
                  <p
                    className="gsap-reveal text-muted-foreground text-sm"
                    data-slot="previous-description"
                  >
                    {previousSlide.description}
                  </p>
                </div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2 self-stretch">
              {slides.map((slide, i) => {
                return (
                  <button
                    type="button"
                    key={slide.id}
                    onClick={() => handleStep(i)}
                    data-slot={`indicator-${i}`}
                    className={cn(
                      "relative h-1 w-full max-w-18 grow overflow-hidden rounded-md bg-muted [--scale:0]",
                      "before:absolute before:inset-y-0 before:left-0 before:w-full before:origin-(--origin) before:scale-x-(--scale) before:bg-primary",
                      index.previous === i && "[--scale:1]",
                    )}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-4 self-stretch">
              {index.current !== 0 && (
                <Button
                  className="rounded-full"
                  color="secondary"
                  onClick={() => handleStep(index.current - 1)}
                >
                  Back
                </Button>
              )}
              {index.current >= slides.length - 1 ? (
                <Button
                  className="ml-auto animate-border-glow rounded-full"
                  href="/"
                  onClick={() => {
                    useGlobalStore.setState(() => ({
                      isFirstTimeUser: false,
                    }));
                  }}
                >
                  Get started
                  <ArrowRight />
                </Button>
              ) : (
                <Button
                  className="ml-auto rounded-full"
                  onClick={() => handleStep(index.current + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
