"use client";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "@/public/logo-icon.svg";

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      aria-live="polite"
      aria-label="Loading"
      className={cn("pointer-events-none size-4 animate-spin", className)}
      {...props}
    />
  );
}

function HayaSpinner() {
  return (
    <output
      aria-live="polite"
      className="relative grid size-18 place-content-center"
      data-slot="loader"
    >
      <div
        className="absolute inset-0"
        style={{
          mask: "radial-gradient(transparent 20%, #000 20%)",
        }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 size-2 rounded-full bg-primary"
          animate={{
            y: [0, -25, null, 0],
            rotate: [0, null, 360, 360],
            backgroundColor: [
              "var(--color-primary)",
              "var(--color-primary)",
              "var(--color-primary-compliment)",
              "var(--color-primary-compliment)",
            ],
          }}
          style={{ originY: "calc(100% + 20px)" }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2.5,
            delay: 0.001,
            ease: "easeInOut",
            times: [0, 0.3, 0.5, 0.7, 1],
          }}
        />
      </div>
      <Image src={logo} alt="Haya Loader" className="size-5" />
    </output>
  );
}

export { Spinner, HayaSpinner };
