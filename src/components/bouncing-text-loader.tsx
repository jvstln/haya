import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const genericTransform = [
  "translateY(0px)",
  "translateY(-25px)",
  "translateY(0px)",
];
const physicsPresets = {
  bouncy: {
    keyframes: {
      transform: genericTransform,
    },
    options: {
      duration: 600,
      easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
  snappy: {
    keyframes: {
      transform: [
        "translateY(0px) scale(1) rotate(0deg)",
        "translateY(-15px) scale(1.1) rotate(-10deg)",
        "translateY(-30px) scale(1.2) rotate(0deg)",
        "translateY(-15px) scale(1.1) rotate(10deg)",
        "translateY(0px) scale(1) rotate(0deg)",
      ],
    },
    options: { duration: 400, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  },
  smooth: {
    keyframes: { transform: genericTransform },
    options: { duration: 700, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" },
  },
  elastic: {
    keyframes: { transform: genericTransform },
    options: { duration: 800, easing: "cubic-bezier(0.68, -0.6, 0.32, 1.6)" },
  },
  jelly: {
    keyframes: { transform: genericTransform },
    options: { duration: 1, easing: "cubic-bezier(0.5, -0.5, 0.5, 1.5)" },
  },
  wave: {
    keyframes: { transform: genericTransform },
    options: {
      duration: 1.2,
      easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
} as const satisfies Record<
  string,
  {
    keyframes: Keyframe[] | PropertyIndexedKeyframes;
    options: KeyframeAnimationOptions;
  }
>;

type BouncingTextLoaderProps = {
  text?: string;
  className?: string;
  letterClassName?: string;
  durationInMs?: number;
  staggerDelayInMs?: number;
  pauseBetweenCyclesInMs?: number;
  variant?: keyof typeof physicsPresets;
};

export const BouncingTextLoader = ({
  text = "Loading...",
  variant = "bouncy",
  className,
  letterClassName,
  staggerDelayInMs = 100,
  pauseBetweenCyclesInMs = 700,
  durationInMs,
}: BouncingTextLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const letters = text.split("");

  // Animate letters using JS animations API
  useEffect(() => {
    const preset = physicsPresets[variant];
    const container = containerRef.current;
    const animatables = container?.querySelectorAll(
      "[data-slot=animatable-character]",
    );
    if (!animatables || !container) return;

    const animations = Array.from(animatables).map((element, i) => {
      return element.animate(preset.keyframes, {
        delay: staggerDelayInMs * i,
        ...preset.options,
        duration: durationInMs ?? preset.options.duration,
      });
    });

    animations.at(-1)?.addEventListener("finish", () => {
      setTimeout(() => {
        animations.map((animation) => animation.play());
      }, pauseBetweenCyclesInMs);
    });

    return () => {
      animations.map((animation) => animation.cancel());
    };
  }, [durationInMs, pauseBetweenCyclesInMs, staggerDelayInMs, variant]);

  return (
    <div className={cn("flex items-end gap-1", className)} ref={containerRef}>
      {letters.map((letter, index) => {
        return (
          <span
            key={`${letter + index}`}
            className={cn("inline-block font-bold text-2xl", letterClassName)}
            data-slot="animatable-character"
            data-index={index}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}
    </div>
  );
};
