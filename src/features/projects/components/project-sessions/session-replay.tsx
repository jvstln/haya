import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { random, stringToHashedNumber } from "@/lib/utils";

export const SessionReplay = ({
  src,
  sn,
  ...props
}: Omit<React.ComponentProps<typeof Image>, "src"> & {
  sn?: number;
  src?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const imageHash = stringToHashedNumber(src ?? "");

  return (
    <div
      id={`section-${imageHash}`}
      className="relative border-(--accent-fade) border-2 not-first:border-t border-b shadow-(--accent-color) last:border-b-2 hover:border-(--accent-color) hover:shadow-md"
      style={
        {
          "--accent-color": `oklch(87.1% 0.15 ${imageHash % 360})`,
          "--accent-fade": "oklch(from var(--accent-color) l c h / 0.5)",
        } as CSSProperties
      }
    >
      <Image
        src={src || "/images/default-audit-card-bg.webp"}
        width={0}
        height={0}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-full"
        {...props}
        onLoad={(e) => {
          setIsLoaded(true);
          props.onLoad?.(e);
        }}
      />
      {isLoaded && sn && (
        <div
          className="absolute z-10 flex size-10 items-center justify-center rounded-full bg-(--accent-color) p-1 text-background text-lg"
          style={{
            top: `${random(1, 5)}%`,
            right: `${random(2, 60)}%`,
          }}
        >
          {sn}
        </div>
      )}
    </div>
  );
};
