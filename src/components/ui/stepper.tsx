"use client";

import { CheckIcon } from "lucide-react";
import * as React from "react";
import { gsap } from "@/lib/gsap.util";
import { cn } from "@/lib/utils";

// ─── Stepper Context ─────────────────────────────────────────────────────────

interface StepperContextValue {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  registerStep: (id: string) => () => void;
  stepIds: string[];
  totalSteps: number;
  setStep: (step: number) => void;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext(componentName: string): StepperContextValue {
  const ctx = React.useContext(StepperContext);
  if (!ctx)
    throw new Error(
      `<${componentName}> must be used inside a <Stepper> component.`,
    );
  return ctx;
}

// ─── Step Context ─────────────────────────────────────────────────────────────

interface StepContextValue {
  stepIndex: number;
  isActive: boolean;
  isCompleted: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const StepContext = React.createContext<StepContextValue | null>(null);

function useStepContext(componentName: string): StepContextValue {
  const ctx = React.useContext(StepContext);
  if (!ctx)
    throw new Error(
      `<${componentName}> must be used inside a <Stepper.Step> component.`,
    );
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type StepperProps = React.ComponentProps<"ul"> & {
  /** Zero-based index of the default active step (uncontrolled). */
  defaultStep?: number;
  /** Zero-based index of the currently active step (controlled). */
  step?: number;
  /** Callback fired when the active step changes. */
  onStepChange?: (step: number) => void;
  orientation?: "horizontal" | "vertical";
};

function StepperRoot({
  defaultStep,
  step,
  onStepChange,
  orientation = "horizontal",
  className,
  children,
  ...props
}: StepperProps) {
  const [stepIds, setStepIds] = React.useState<string[]>([]);

  const registerStep = React.useCallback((id: string) => {
    setStepIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    return () => {
      setStepIds((prev) => prev.filter((x) => x !== id));
    };
  }, []);

  const totalSteps = stepIds.length;

  // Handle controlled and uncontrolled state
  const isControlled = step !== undefined;
  const [internalStep, setInternalStep] = React.useState(defaultStep ?? 0);

  const currentStepValue = step ?? internalStep;

  // Clamp the active step value to the range of registered steps
  const clampedActive =
    totalSteps > 0
      ? Math.max(0, Math.min(currentStepValue, totalSteps - 1))
      : currentStepValue;

  const setStep = React.useCallback(
    (nextStep: number) => {
      const clamped = Math.max(
        0,
        Math.min(nextStep, Math.max(0, totalSteps - 1)),
      );
      if (!isControlled) {
        setInternalStep(clamped);
      }
      onStepChange?.(clamped);
    },
    [isControlled, totalSteps, onStepChange],
  );

  return (
    <StepperContext.Provider
      value={{
        activeStep: clampedActive,
        orientation,
        registerStep,
        stepIds,
        totalSteps,
        setStep,
      }}
    >
      <ul
        data-orientation={orientation}
        className={cn(
          "flex",
          orientation === "horizontal"
            ? "w-full flex-row items-start"
            : "flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    </StepperContext.Provider>
  );
}

// ─── Step ─────────────────────────────────────────────────────────────────────

export interface StepProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

function StepperStep({ className, children, ...props }: StepProps) {
  const { activeStep, orientation, registerStep, stepIds, totalSteps } =
    useStepperContext("Stepper.Step");

  const stepId = React.useId();

  React.useLayoutEffect(() => {
    return registerStep(stepId);
  }, [stepId, registerStep]);

  const stepIndex = stepIds.indexOf(stepId);

  if (stepIndex === -1) return null;

  const isActive = stepIndex === activeStep;
  const isCompleted = stepIndex < activeStep;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <StepContext.Provider
      value={{ stepIndex, isActive, isCompleted, isFirst, isLast }}
    >
      <li
        aria-current={isActive ? "step" : undefined}
        data-state={isCompleted ? "completed" : isActive ? "active" : "pending"}
        data-slot="stepper-item"
        className={cn(
          "flex",
          orientation === "horizontal"
            ? "not-last:flex-1 flex-col items-center"
            : "flex-row items-start",
          className,
        )}
        {...props}
      >
        {children}
      </li>
    </StepContext.Provider>
  );
}

// ─── Rail ─────────────────────────────────────────────────────────────────────
//
//  Renders the indicator circle + the connector line leading to the next step.
//  Edge cases handled:
//    - Last step: no trailing line rendered
//    - Vertical orientation: line flows downward
//    - Overflow: active step gets a ring; completed swaps to checkmark

export interface RailProps extends React.HTMLAttributes<HTMLDivElement> {}

function StepperRail({ className, ...props }: RailProps) {
  const { orientation } = useStepperContext("Stepper.Rail");
  const { stepIndex, isActive, isCompleted, isLast } =
    useStepContext("Stepper.Rail");

  const nodeRef = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLDivElement>(null);
  const prevRef = React.useRef({ isActive, isCompleted });

  // ── Mount: staggered pop-in
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount
  React.useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    gsap.fromTo(
      node,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: stepIndex * 0.07,
        ease: "back.out(1.7)",
        clearProps: "transform",
      },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Transitions when step state changes
  React.useEffect(() => {
    const prev = prevRef.current;
    const node = nodeRef.current;
    const fill = fillRef.current;

    if (!node) return;

    const wasActive = prev.isActive;
    const wasCompleted = prev.isCompleted;

    // Became active
    if (!wasActive && isActive) {
      gsap
        .timeline()
        .to(node, { scale: 1.2, duration: 0.15, ease: "power2.out" })
        .to(node, { scale: 1, duration: 0.35, ease: "elastic.out(1.3, 0.5)" });
    }

    // Became completed (advancing forward)
    if (!wasCompleted && isCompleted && fill) {
      gsap.fromTo(
        fill,
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "power2.inOut",
          clearProps: "transform",
        },
      );
      // Brief flip on the node to reveal the checkmark
      gsap
        .timeline()
        .to(node, { scaleX: 0, duration: 0.18, ease: "power2.in" })
        .to(node, {
          scaleX: 1,
          duration: 0.22,
          ease: "back.out(1.4)",
          clearProps: "transform",
        });
    }

    // Regressed (e.g. going back)
    if (wasCompleted && !isCompleted) {
      gsap.fromTo(
        node,
        { scale: 0.85, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    }

    prevRef.current = { isActive, isCompleted };
  }, [isActive, isCompleted]);

  const isH = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex items-center",
        isH ? "w-full flex-row" : "h-full flex-col",
        className,
      )}
      data-slot="stepper-rail"
      {...props}
    >
      {/* ── Indicator node ── */}
      <div
        ref={nodeRef}
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center rounded-full",
          "h-8 w-8 select-none font-semibold text-sm",
          "transition-[background-color,color,box-shadow] duration-300",
          isActive
            ? [
                "bg-primary text-primary-foreground",
                "shadow-[0_0_0_3px_hsl(var(--background)),0_0_0_5px_hsl(var(--primary)/0.35)]",
              ]
            : isCompleted
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-muted text-muted-foreground",
        )}
        aria-hidden
      >
        {isCompleted ? <CheckIcon size={16} /> : <span>{stepIndex + 1}</span>}
      </div>

      {/* ── Connector line (omit on last step) ── */}
      {!isLast && (
        <div
          className={cn(
            "relative overflow-hidden bg-border",
            isH ? "h-2 flex-1" : "min-h-6 w-[2px] flex-1",
          )}
        >
          <div
            ref={fillRef}
            className={cn(
              "absolute inset-0 bg-primary",
              isH ? "origin-left" : "origin-top",
            )}
            style={{
              transform: isCompleted ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function StepperContent({ className, children, ...props }: ContentProps) {
  const { orientation } = useStepperContext("Stepper.Content");
  const { isActive } = useStepContext("Stepper.Content");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !isActive) return;
    gsap.fromTo(
      el,
      { opacity: 0.3, y: 5 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [isActive]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-0.5",
        orientation === "horizontal"
          ? "mt-2.5 items-center text-center"
          : "mt-0.5 ml-3",
        !isActive && "opacity-50",
        "transition-opacity duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Title ────────────────────────────────────────────────────────────────────

export interface TitleProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

function StepperTitle({ className, children, ...props }: TitleProps) {
  const { isActive, isCompleted } = useStepContext("Stepper.Title");

  return (
    <p
      className={cn(
        "font-medium text-sm leading-none",
        isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Description ─────────────────────────────────────────────────────────────

export interface DescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

function StepperDescription({
  className,
  children,
  ...props
}: DescriptionProps) {
  return (
    <p
      className={cn("mt-0.5 text-muted-foreground text-xs", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Compound export ──────────────────────────────────────────────────────────

const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
  Rail: StepperRail,
  Content: StepperContent,
  Title: StepperTitle,
  Description: StepperDescription,
});

export {
  Stepper,
  StepperStep,
  StepperRail,
  StepperContent,
  StepperTitle,
  StepperDescription,
};
