import { useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap.util";

export default function GSAPGlobalAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [timelinesRef] = useState<WeakMap<HTMLElement, gsap.core.Timeline>>(
    () => new WeakMap(),
  );
  // Animate all svg paths on various events
  useGSAP(
    () => {
      const matches = (e: object, selector: string) => {
        return (
          "target" in e &&
          e.target instanceof HTMLElement &&
          e.target.matches(selector)
        );
      };

      const getScopedTimeline = (element: HTMLElement): gsap.core.Timeline => {
        let tl = timelinesRef.get(element);
        if (tl) {
          return tl;
        }

        gsap.context(
          () => {
            tl = gsap
              .timeline({
                paused: true,
                defaults: { duration: 0.1, immediateRender: false },
              })
              .to("svg", { scale: 1.1 })
              .to("svg path", { drawSVG: "50% 50%" }, "<")
              .to("svg", { scale: 1 })
              .to(
                "svg path",
                {
                  stagger: 0.1,
                  drawSVG: true,
                  duration: 0.4,
                },
                "<",
              );
          },
          { current: element },
        );

        if (!tl) {
          throw new Error(
            "GSAP Timeline not initialized in GSAPGlobalAnimationProvider",
          );
        }

        timelinesRef.set(element, tl);
        return tl;
      };

      const animateSvg = (e: Event) => {
        if (
          !(
            e.target instanceof HTMLElement &&
            matches(
              e,
              ":is(button, [data-slot*=button], [role=button], [role=menuitem]):has(svg)",
            )
          )
        ) {
          return;
        }

        // const tl = getScopedTimeline(e.target);
        // tl.restart();
      };

      const controller = new AbortController();
      document.addEventListener("mouseover", animateSvg, {
        signal: controller.signal,
      });
      document.addEventListener("focusin", animateSvg, {
        signal: controller.signal,
      });

      return () => {
        controller.abort();
      };
    },
    { dependencies: undefined },
  );

  return children;
}
