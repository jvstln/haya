"use client";
import owlImage from "@workspace/assets/images/owl.png";
// import "./owl-background.css";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function OwlBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!wrapRef.current) return;

  //   const wrap = wrapRef.current;
  //   const pupils = [
  //     {
  //       el: wrap.getElementById("pupil-l"),
  //       socket: wrap.getElementById("eye-l"),
  //     },
  //     {
  //       el: wrap.getElementById("pupil-r"),
  //       socket: wrap.getElementById("eye-r"),
  //     },
  //   ];
  //   const cursor = wrap.getElementById("cursor");

  //   wrap.addEventListener("mousemove", (e) => {
  //     const wr = wrap.getBoundingClientRect();
  //     const cx = e.clientX - wr.left;
  //     const cy = e.clientY - wr.top;

  //     cursor.style.left = cx + "px";
  //     cursor.style.top = cy + "px";

  //     pupils.forEach(({ el, socket }) => {
  //       const sr = socket.getBoundingClientRect();
  //       const ex = sr.left + sr.width / 2 - wr.left;
  //       const ey = sr.top + sr.height / 2 - wr.top;

  //       const dx = cx - ex;
  //       const dy = cy - ey;
  //       const angle = Math.atan2(dy, dx);
  //       const maxR = sr.width * 0.17;
  //       const dist = Math.min(Math.hypot(dx, dy), maxR * 6);
  //       const t = dist / (dist + maxR * 3);
  //       const r = maxR * t;

  //       el.style.transform = `translate(${Math.round(Math.cos(angle) * r * 10) / 10}px, ${Math.round(Math.sin(angle) * r * 10) / 10}px)`;
  //     });
  //   });

  //   wrap.addEventListener("mouseleave", () => {
  //     cursor.style.opacity = "0";
  //     pupils.forEach(({ el }) => (el.style.transform = "translate(0,0)"));
  //   });
  //   wrap.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));
  // }, []);

  return (
    <div ref={wrapRef} className="owl-wrap absolute inset-0">
      {/* <div className="owl-bg"></div> */}
      <Image
        alt="Haya owl"
        src={owlImage}
        className="-z-50 absolute inset-0 object-cover"
        fill
      />

      {/* Left eye */}
      {/* <div
        className="eye-socket aspect-square size-[13%] left-[33%] top-[30%]"
        id="eye-l"
      >
        <div className="iris size-full" id="iris-l">
          <div className="pupil size-[44%]" id="pupil-l"></div>
          <div className="glint size-[18%] left-[22%]"></div>
        </div>
      </div> */}

      {/* Right eye */}
      {/* <div
        className="eye-socket aspect-square size-[13%] left-[54%] top-[30%]"
        id="eye-r"
      >
        <div className="iris size-full" id="iris-r">
          <div className="pupil" id="pupil-r size-[44%]"></div>
          <div className="glint size-[18%] left-[22%] top-[18%]"></div>
        </div>
      </div> */}

      {/* <div className="feathers"></div>
      <div className="beak"></div>
      <div className="custom-cursor" id="cursor"></div>
      <div className="label">move your cursor</div> */}
    </div>
  );
}
