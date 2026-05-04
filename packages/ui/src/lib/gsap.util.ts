import gsap, { Flip, ScrollToPlugin, ScrollTrigger } from "gsap/all";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip, ScrollToPlugin, ScrollTrigger, SplitText);

export { useGSAP, gsap, Flip, ScrollToPlugin, ScrollTrigger, SplitText };
