import * as React from "react";

// Gotten from tailwindcss breakpoints
const breakpoints = {
  sm: "(width >= 40rem /* 640px */)",
  md: "(width >= 48rem /* 768px */)",
  lg: "(width >= 64rem /* 1024px */)",
  xl: "(width >= 80rem /* 1280px */)",
  "max-sm": "(width < 40rem /* 640px */)",
  "max-md": "(width < 48rem /* 768px */)",
  "max-lg": "(width < 64rem /* 1024px */)",
  "max-xl": "(width < 80rem /* 1280px */)",
};

export function useBreakpoint(breakpoint: keyof typeof breakpoints) {
  const [isMatch, setIsMatch] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(breakpoints[breakpoint]);
    setIsMatch(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMatch(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isMatch;
}
