"use client";

import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  Code2,
  Copy,
  ExternalLink,
  Globe,
  Settings,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "../project.type";

interface ProjectCardProps {
  project: Project;
  onSetup: (project: Project) => void;
  onConfigure: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({
  project,
  onSetup,
  onConfigure,
  onDelete,
}: ProjectCardProps) => {
  const router = useRouter();
  const [_, copy] = useCopyToClipboard();

  const trackingEnabledCount = Object.values(project.settings || {}).filter(
    Boolean,
  ).length;

  return (
    <Card
      onClick={() => router.push(`/dashboard/projects/${project._id}`)}
      className="group relative w-full cursor-pointer transition-all duration-300 hover:scale-[1.01] md:w-[350px]"
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="truncate font-semibold text-base text-zinc-100">
              {project.name}
            </CardTitle>
            <a
              href={project.domain}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-0 items-center gap-1 truncate text-xs text-zinc-400 transition-colors hover:text-primary"
            >
              <span className="truncate">{project.domain}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>
        <Badge
          appearance={project.isActive ? "solid" : "outline"}
          color={project.isActive ? "success" : "secondary"}
        >
          {project.isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 py-3">
        {/* SDK Key */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-[10px] text-zinc-500 uppercase tracking-wider">
            Tracking SDK Key
          </span>
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 font-mono text-xs">
            <span className="select-all truncate pr-2 text-zinc-300">
              {project.sdkKey}
            </span>
            <Button
              appearance="ghost"
              color="secondary"
              size="icon-sm"
              onClick={async (e) => {
                e.stopPropagation();
                await copy(project.sdkKey);
                toast.success("SDK key copied to clipboard!");
              }}
              className="size-7 shrink-0 cursor-pointer text-zinc-400 hover:text-zinc-200"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Features configured */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-[10px] text-zinc-500 uppercase tracking-wider">
            Insights Settings
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.settings?.sessionReplay && (
              <Badge
                color="secondary"
                className="bg-zinc-800/40 text-[10px] text-zinc-300"
              >
                Replays
              </Badge>
            )}
            {project.settings?.heatmaps && (
              <Badge
                color="secondary"
                className="bg-zinc-800/40 text-[10px] text-zinc-300"
              >
                Heatmaps
              </Badge>
            )}
            {project.settings?.trackClicks && (
              <Badge
                color="secondary"
                className="bg-zinc-800/40 text-[10px] text-zinc-300"
              >
                Clicks
              </Badge>
            )}
            {project.settings?.trackScrolls && (
              <Badge
                color="secondary"
                className="bg-zinc-800/40 text-[10px] text-zinc-300"
              >
                Scrolls
              </Badge>
            )}
            {trackingEnabledCount === 0 && (
              <span className="text-xs text-zinc-600">
                No active capture modes
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-zinc-900/60 border-t">
        <div className="flex gap-2">
          <Button
            size="sm"
            appearance="outline"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onSetup(project);
            }}
          >
            <Code2 />
            Setup SDK
          </Button>
          <Button
            size="icon-sm"
            appearance="ghost"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onConfigure(project);
            }}
          >
            <Settings />
          </Button>
          {/* <Button
            href={`/dashboard/projects/${project._id}`}
            size="sm"
            appearance="ghost"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Eye />
            View sessions
          </Button> */}
        </div>

        <Button
          size="icon-sm"
          appearance="ghost"
          color="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project._id);
          }}
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
};
