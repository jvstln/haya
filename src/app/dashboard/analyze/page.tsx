"use client";
import { AttachCircle } from "iconsax-reactjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const analysisModes = [
  { name: "Website Analysis", value: "web" },
  { name: "UI vs Website Analysis", value: "webVsUi" },
  { name: "Website vs Website Analysis", value: "webVsWeb" },
] as const;

const AnalysisPage = () => {
  const [mode, setMode] =
    useState<(typeof analysisModes)[number]["value"]>("web");

  return (
    <div className="flex h-full w-full flex-col items-center space-y-7 p-5">
      <div className="max-w-150 space-y-5 text-center max-sm:my-auto sm:mt-31.5 md:mt-39.25">
        <h1 className="bg-colorful-gradient bg-clip-text p-1 font-bold text-2xl text-transparent md:text-4xl">
          Let&apos;s get straight to work
        </h1>
        <p className="max-md:text-sm">
          Seamless infrastructure for onchain UX analytics, empowering builders
          to identify and fix friction points in minutes, not weeks.
        </p>
      </div>

      <ScrollArea className="w-full pb-4">
        <div className="flex justify-around gap-4">
          {analysisModes.map((m) => (
            <Button
              key={m.value}
              variant="ghost"
              className={cn(
                "shrink text-sm max-sm:p-2 lg:text-base",
                mode === m.value && "border-primary border-b-4 bg-border"
              )}
              onClick={() => setMode(m.value)}
            >
              {m.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="w-full max-w-201 space-y-5">
        {mode === "webVsWeb" ? (
          <div className="flex flex-col gap-4">
            <Input placeholder="Enter your website URL" />
            <Input placeholder="Enter your website URL" />
            <Button variant="colorful" size="lg">
              Analyze competitors
            </Button>
          </div>
        ) : (
          <InputGroup className="">
            <InputGroupTextarea placeholder="Enter your website URL" />
            <InputGroupAddon align="block-end">
              {mode === "webVsUi" && (
                <Button variant="outline" className="">
                  <AttachCircle />
                  Attach visual
                </Button>
              )}
              <Button variant="colorful" className="ml-auto">
                Analyze
              </Button>
            </InputGroupAddon>
          </InputGroup>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
