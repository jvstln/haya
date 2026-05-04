"use client";
import owlImage from "@workspace/assets/images/owl.png";
import Image from "next/image";
import React, { useRef } from "react";
import { DottedOverlay } from "./dotted-overlay";

export function HeroBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className="owl-wrap absolute bg-[#020103] -z-10 inset-0"
      style={{
        background:
          "linear-gradient(to bottom right, oklch(from #020103 l c h), oklch(from #020103) l c h / 0.5))",
      }}
    >
      <DottedOverlay
        className="absolute opacity-4  w-full h-full"
        style={
          {
            "--tw-blur": "blur(2px)",
          } as React.CSSProperties
        }
      />

      {/* Group 8104 */}
      <div
        className="absolute opacity-70 -top-32 left-0"
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
        className="-z-50 absolute opacity-20 inset-0 object-cover"
        fill
      />
    </div>
  );
}
