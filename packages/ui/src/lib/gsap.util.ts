import gsap, { Flip, ScrollToPlugin, ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip, ScrollToPlugin, ScrollTrigger, SplitText);

const useGSAPWrapper = (...wrapperArgs: Parameters<typeof useGSAP>) => {
  const [contextFunction, config] = wrapperArgs;

  return useGSAP(
    (...args) => {
      // Remove all gsap-reveal class making the elements to appear
      gsap.utils.toArray(".gsap-reveal").forEach((el) => {
        if (el instanceof Element) {
          el.classList.remove("gsap-reveal");
        }
      });

      if (typeof contextFunction === "function") {
        contextFunction(...args);
      }
    },
    config ??
      (typeof contextFunction !== "function" ? contextFunction : undefined),
  );
};

export {
  gsap,
  Flip,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
  useGSAPWrapper as useGSAP,
};
