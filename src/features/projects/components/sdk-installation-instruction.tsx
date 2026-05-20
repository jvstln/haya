"use client";

import { Globe, Smartphone } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { NextJsIcon, ReactIcon, VueJsIcon } from "@/components/icons";
import { CodeBlock } from "@/components/ui/code-block";
import { SDK_NAME } from "@/data/constants";
import { cn } from "@/lib/utils";

// ─── Installation Data Structure ─────────────────────────────────────────────

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
type PlatformId = "react" | "nextjs" | "vue" | "cdn" | "mobile";

type PlatformOption = {
  id: PlatformId;
  label: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  supportsPkgManagers: boolean;
  steps: (
    pkg: PackageManager,
    sdkKey: string,
  ) => Array<{
    title: string;
    description: string;
    code: string;
    language: string;
    filename?: string;
    lineNumbers?: boolean;
  }>;
};

const platforms: PlatformOption[] = [
  {
    id: "react",
    label: "React SPA",
    icon: ReactIcon,
    supportsPkgManagers: true,
    steps: (pkg, sdkKey) => [
      {
        title: "Install the SDK",
        description:
          "Run the following command in your terminal to install the Haya Analytics SDK.",
        code: `${pkg} ${pkg === "npm" ? "install" : "add"} ${SDK_NAME}`,
        language: "bash",
      },
      {
        title: "Initialize Haya in your entry point",
        description:
          "Add this to your src/main.jsx or src/main.tsx file before ReactDOM.createRoot().",
        code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import haya from '${SDK_NAME}';
import App from './App';

haya.init('${sdkKey}', {
  sessionReplay: true,
  heatmaps: true,
  autoTrack: { clicks: true, scrolls: true, pageviews: true },
  maskInputs: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        language: "typescript",
        filename: "src/main.tsx",
        lineNumbers: true,
      },
      {
        title: "Track custom events (optional)",
        description:
          "Call haya.track() anywhere in your app to record specific user actions.",
        code: `import haya from '${SDK_NAME}';

export function SignupButton() {
  const handleClick = () => {
    haya.track('signup_clicked', {
      source: 'hero',
      plan: 'pro',
    });
  };

  return <button onClick={handleClick}>Get started</button>;
}`,
        language: "typescript",
        filename: "src/components/SignupButton.tsx",
        lineNumbers: true,
      },
    ],
  },
  {
    id: "nextjs",
    label: "Next.js",
    icon: NextJsIcon,
    supportsPkgManagers: true,
    steps: (pkg, sdkKey) => [
      {
        title: "Install the SDK",
        description:
          "Run the following command in your terminal to install the Haya Analytics SDK.",
        code: `${pkg} ${pkg === "npm" ? "install" : "add"} ${SDK_NAME}`,
        language: "bash",
      },
      {
        title: "Add to your Next.js config",
        description:
          "In your next.config.ts or next.config.js, add transpilePackages so the bundler handles the SDK correctly.",
        code: `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['${SDK_NAME}'],
};

export default nextConfig;`,
        language: "typescript",
        filename: "next.config.ts",
        lineNumbers: true,
      },
      {
        title: "Create a HayaProvider component",
        description:
          "Create a client component to initialize the SDK within a React useEffect hook.",
        code: `'use client';

import { useEffect } from 'react';
import haya from '${SDK_NAME}';

export function HayaProvider() {
  useEffect(() => {
    haya.init('${sdkKey}', {
      sessionReplay: true,
      heatmaps: true,
      autoTrack: { clicks: true, scrolls: true, pageviews: true },
      maskInputs: true,
    });
  }, []);

  return null;
}`,
        language: "typescript",
        filename: "src/components/HayaProvider.tsx",
        lineNumbers: true,
      },
      {
        title: "Add the provider to your root layout",
        description:
          "Import the provider and render it inside your root layout component.",
        code: `import { HayaProvider } from '@/components/HayaProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HayaProvider />
        {children}
      </body>
    </html>
  );
}`,
        language: "typescript",
        filename: "app/layout.tsx",
        lineNumbers: true,
      },
      {
        title: "Track custom events (optional)",
        description:
          "In any client component, call haya.track() to record specific user actions.",
        code: `'use client';
import haya from '${SDK_NAME}';

export function UpgradeButton({ plan }: { plan: string }) {
  return (
    <button onClick={() => haya.track('upgrade_clicked', { plan })}>
      Upgrade to {plan}
    </button>
  );
}`,
        language: "typescript",
        filename: "app/pricing/UpgradeButton.tsx",
        lineNumbers: true,
      },
    ],
  },
  {
    id: "vue",
    label: "Vue.js",
    icon: VueJsIcon,
    supportsPkgManagers: true,
    steps: (pkg, sdkKey) => [
      {
        title: "Install the SDK",
        description:
          "Run the following command in your terminal to install the Haya Vue SDK.",
        code: `${pkg} ${pkg === "npm" ? "install" : "add"} ${SDK_NAME}`,
        language: "bash",
      },
      {
        title: "Add SDK key to environment variables",
        description: "Add your SDK key inside your project's .env file.",
        code: `VITE_HAYA_SDK_KEY=${sdkKey}`,
        language: "bash",
        filename: ".env",
        lineNumbers: false,
      },
      {
        title: "Initialize in your entry point",
        description:
          "Call haya.init() in src/main.ts before createApp().mount().",
        code: `import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import haya from '${SDK_NAME}';

haya.init(import.meta.env.VITE_HAYA_SDK_KEY, {
  sessionReplay: true,
  heatmaps: true,
  autoTrack: { clicks: true, scrolls: true, pageviews: true },
  maskInputs: true,
});

createApp(App).use(router).mount('#app');`,
        language: "typescript",
        filename: "src/main.ts",
        lineNumbers: true,
      },
      {
        title: "Track custom events (optional)",
        description: "Call haya.track() inside any component block.",
        code: `<script setup lang="ts">
import haya from '${SDK_NAME}';

function handleClick() {
  haya.track('signup_clicked', {
    source: 'hero',
    plan: 'pro',
  });
}
</script>

<template>
  <button @click="handleClick">Get started</button>
</template>`,
        language: "html",
        filename: "src/components/SignupButton.vue",
        lineNumbers: true,
      },
    ],
  },
  {
    id: "cdn",
    label: "CDN / HTML",
    icon: Globe,
    supportsPkgManagers: false,
    steps: (_pkg, sdkKey) => [
      {
        title: "Add Script Tag",
        description:
          "Insert this HTML script tag inside the <head> block of your website.",
        code: `<script
  src="https://cdn.tryhaya.com/sdk/v1/analytics.js"
  data-api-key="${sdkKey}"
  async
></script>`,
        language: "html",
        filename: "index.html",
        lineNumbers: true,
      },
    ],
  },
  {
    id: "mobile",
    label: "React Native / Mobile",
    icon: Smartphone,
    supportsPkgManagers: true,
    steps: (pkg, sdkKey) => [
      {
        title: "Install the SDK",
        description:
          "Run the following command in your terminal to install the Haya Mobile SDK.",
        code: `${pkg} ${pkg === "npm" ? "install" : "add"} @tryhaya/analytics-react-native`,
        language: "bash",
      },
      {
        title: "Initialize SDK Client",
        description:
          "Initialize the Haya SDK at the root level of your React Native application.",
        code: `import { Haya } from "@tryhaya/analytics-react-native";

Haya.initialize({
  apiKey: "${sdkKey}",
});`,
        language: "typescript",
        filename: "App.tsx",
        lineNumbers: true,
      },
    ],
  },
];

const packageManagers: { id: PackageManager; label: string }[] = [
  { id: "npm", label: "npm" },
  { id: "pnpm", label: "pnpm" },
  { id: "yarn", label: "yarn" },
  { id: "bun", label: "bun" },
];

export const SdkInstallationInstruction = ({
  sdkKey = "YOUR_SDK_KEY",
}: {
  sdkKey?: string;
}) => {
  const [activePlatform, setActivePlatform] = useState<PlatformId>("react");
  const [pkgManager, setPkgManager] = useState<PackageManager>("npm");

  const platformOption =
    platforms.find((p) => p.id === activePlatform) ?? platforms[0];
  const steps = platformOption.steps(pkgManager, sdkKey);

  return (
    <div className="flex flex-col gap-8">
      {/* Platform grid selector */}
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">
          Choose your platform
        </span>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = platform.id === activePlatform;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setActivePlatform(platform.id)}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-3 rounded-xl border p-4 text-center outline-none transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary-foreground shadow-primary/20 shadow-sm"
                    : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                )}
              >
                <Icon className="h-6 w-6 shrink-0 text-inherit" />
                <span className="font-semibold text-xs md:text-sm">
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Package manager toggle if supported */}
      {platformOption.supportsPkgManagers && (
        <div className="flex items-center justify-between border-zinc-800 border-b pb-4">
          <span className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">
            Package Manager
          </span>
          <div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
            {packageManagers.map((pm) => {
              const isSelected = pm.id === pkgManager;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPkgManager(pm.id)}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1 font-medium text-xs transition-all",
                    isSelected
                      ? "border border-zinc-700 bg-zinc-800 font-semibold text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  {pm.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Steps container */}
      <div className="flex flex-col gap-6">
        {steps.map((step, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: steps are static and ordered
          <div key={idx} className="flex gap-4">
            {/* Step indicator dot */}
            <div className="flex shrink-0 flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-bold text-primary text-sm">
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className="my-2 w-px grow bg-zinc-800" />
              )}
            </div>

            {/* Step details */}
            <div className="flex min-w-0 grow flex-col gap-3 pb-4">
              <div className="flex flex-col gap-1">
                <h4 className="font-semibold text-sm text-zinc-200">
                  {step.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <CodeBlock
                code={step.code}
                language={step.language}
                filename={step.filename}
                lineNumbers={step.lineNumbers}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
