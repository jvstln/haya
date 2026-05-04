"use client";
import owlImage from "@workspace/assets/images/owl.png";
import Image from "next/image";
import React, { useRef } from "react";
import { DottedOverlay } from "./dotted-overlay";
import { useGSAP, gsap } from "@workspace/ui/lib/gsap.util";

export function HeroBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrance animation for background elements
      gsap.from(".bg-circles > div", {
        opacity: 0,
        scale: 0.5,
        duration: 2,
        stagger: {
          amount: 0.8,
          from: "center",
        },
        ease: "expo.out",
      });

      // Owl parallax - more pronounced
      gsap.to(".owl-img", {
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 3,
        },
        y: 200,
        scale: 2.15,
        opacity: 0.1,
        ease: "none",
      });

      // Individual circles parallax for depth (staggered effect)
      const circles = gsap.utils.toArray<HTMLElement>(".bg-circles > div");
      circles.forEach((circle, i) => {
        gsap.to(circle, {
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          y: (i + 1) * -30,
          x: i % 2 === 0 ? 20 : -20,
          ease: "none",
        });
      });

      // Subtle movement for the dots
      gsap.to(".dots", {
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -100,
        ease: "none",
      });
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      className="owl-wrap fixed bg-[#020103] -z-10 inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom right, oklch(from #020103 l c h), oklch(from #020103) l c h / 0.5))",
      }}
    >
      <DottedOverlay
        className="dots absolute opacity-4  w-full h-full"
        style={
          {
            "--tw-blur": "blur(2px)",
          } as React.CSSProperties
        }
      />

      {/* Group 8104 */}
      <div
        className="bg-circles gsap-reveal absolute opacity-70 -top-32 left-0"
        style={{
          width: "776.21px",
          height: "713.71px",
        }}
      >
        {/* Ellipse 2129 */}
        <div
          className="absolute rounded-full mix-blend-lighten"
          style={{
            width: "63.91px",
            height: "663.82px",
            left: "-6px",
            top: "-134px",
            background:
              "linear-gradient(180.45deg, #1D00D8 63.19%, rgba(29, 0, 216, 0.64) 99.61%)",
            filter: "blur(26.15px)",
            transform: "rotate(-39.67deg)",
          }}
        />
        {/* Ellipse 2131 */}
        <div
          className="absolute rounded-full"
          style={{
            width: "241.95px",
            height: "293.96px",
            left: "85px",
            top: "87px",
            background: "#644FF0",
            opacity: 0.58,
            filter: "blur(111.15px)",
            transform: "rotate(-105.06deg)",
          }}
        />
        {/* Ellipse 2135 */}
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: "563.65px",
            height: "652.18px",
            left: "-156px",
            top: "-209px",
            background: "#644FF0",
            filter: "blur(111.15px)",
            transform: "rotate(-105.06deg)",
          }}
        />
        {/* Ellipse 2130 */}
        <div
          className="absolute rounded-full"
          style={{
            width: "67px",
            height: "412px",
            left: "-75px",
            top: "8px",
            background:
              "linear-gradient(180.8deg, #644FF0 48.37%, rgba(100, 79, 240, 0.6) 99.31%)",
            filter: "blur(31.05px)",
            transform: "rotate(-44.59deg)",
          }}
        />
        {/* Ellipse 2134 */}
        <div
          className="absolute rounded-full mix-blend-lighten"
          style={{
            width: "158.38px",
            height: "365.79px",
            left: "42px",
            top: "37px",
            background: "#4529FF",
            filter: "blur(47.85px)",
            transform: "rotate(-96.26deg)",
          }}
        />
        {/* Ellipse 2136 */}
        <div
          className="absolute rounded-full mix-blend-lighten"
          style={{
            width: "158.38px",
            height: "365.79px",
            left: "42px",
            top: "37px",
            background: "#B5AAFC",
            opacity: 0.71,
            filter: "blur(47.85px)",
            transform: "rotate(-96.26deg)",
          }}
        />
        {/* Rectangle 85 */}
        <div
          className="absolute"
          style={{
            width: "114.38px",
            height: "551.49px",
            left: "79px",
            top: "-37.58px",
            background:
              "linear-gradient(179.7deg, #644FF0 23.93%, rgba(100, 79, 240, 0.45) 91.02%)",
            filter: "blur(57.6px)",
            borderRadius: "69px",
            transform: "rotate(-37.15deg)",
          }}
        />
      </div>
      <Image
        alt="Haya owl"
        src={owlImage}
        className="owl-img gsap-reveal -z-50 absolute opacity-20 inset-0 object-cover"
        fill
      />
    </div>
  );
}
