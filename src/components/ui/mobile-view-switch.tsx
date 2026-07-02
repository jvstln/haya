"use client";

import { Button } from "@/components/ui/button";

interface MobileViewOption<T extends string> {
  value: T;
  label: string;
}

interface MobileViewSwitchProps<T extends string> {
  currentView: T;
  onViewChange: (view: T) => void;
  options: MobileViewOption<T>[];
}

export function MobileViewSwitch<T extends string>({
  currentView,
  onViewChange,
  options,
}: MobileViewSwitchProps<T>) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center p-4 backdrop-blur-2xs md:hidden"
      style={{
        background:
          "linear-gradient(to right, rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.9) 20% 80%, rgb(0 0 0 / 0.5))",
        boxShadow: "0px -10px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="mb-7 flex items-center justify-center gap-2 rounded-full bg-secondary p-2">
        {options.map((option) => (
          <Button
            key={option.value}
            appearance={currentView === option.value ? "solid" : "ghost"}
            className="rounded-full"
            onClick={() => onViewChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
