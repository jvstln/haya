"use client";

import {
  BadgeDollarSign,
  Bot,
  Calendar,
  FileSearch,
  Megaphone,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TagInstallation } from "@/features/audits/components/tag-installation";

const initialAgents = [
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Time-to-value · empty states · activation gates",
    active: true,
    icon: Calendar,
    colorClass: "bg-[#7c3aed]/10 text-[#a855f7]",
  },
  {
    id: "gamification",
    name: "Gamification",
    description: "Reward loops · streaks · re-engagement",
    active: false,
    icon: Bot,
    colorClass: "bg-[#ea580c]/10 text-[#fb923c]",
  },
  {
    id: "pricing",
    name: "Pricing",
    description: "Plan anchoring · CTA copy · risk reversal",
    active: false,
    icon: BadgeDollarSign,
    colorClass: "bg-[#10b981]/10 text-[#34d399]",
  },
  {
    id: "visual-design",
    name: "Visual design",
    description: "Hierarchy · contrast · trust signals",
    active: true,
    icon: Palette,
    colorClass: "bg-[#3b82f6]/10 text-[#60a5fa]",
  },
  {
    id: "seo",
    name: "SEO",
    description: "Meta · schema · internal linking",
    active: true,
    icon: FileSearch,
    colorClass: "bg-[#06b6d4]/10 text-[#22d3ee]",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Positioning · ICP · social proof",
    active: false,
    icon: Megaphone,
    colorClass: "bg-[#f43f5e]/10 text-[#fb7185]",
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(initialAgents);

  const toggleAgent = (id: string) => {
    setAgents(
      agents.map((agent) =>
        agent.id === id ? { ...agent, active: !agent.active } : agent,
      ),
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-8 p-4">
      <TagInstallation />

      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-white text-xl">All Agents</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card key={agent.id} className="flex flex-col gap-0 p-5">
                <div className="mb-4 flex items-center">
                  <div className={`rounded-xl p-2.5 ${agent.colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="mb-6 grow">
                  <h3 className="mb-1.5 font-semibold text-base text-white">
                    {agent.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span
                    className={`font-semibold text-xs tracking-wide ${agent.active ? "text-[#a855f7]" : "text-muted-foreground"}`}
                  >
                    {agent.active ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={agent.active}
                    onCheckedChange={() => toggleAgent(agent.id)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
