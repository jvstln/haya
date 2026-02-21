"use client";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  DashboardHeader,
  GradientBackground,
} from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputSearch } from "@/components/ui/input-search";
import { LogicalPagination } from "@/components/ui/pagination";
import { CreateTeamDialog } from "@/features/teams/components/create-team-dialog";
import { useFilters } from "@/hooks/use-filters";
import { cn, getInitials } from "@/lib/utils";
import { useTeams } from "../team.hook";
import type { Team } from "../team.type";
import { TeamsSheet } from "./teams-sheet";

type Action = {
  type: "view";
  team: Team;
};

export const TeamsPage = () => {
  const [view, setView] = useState<"all" | "assigned" | "notAssigned">("all");
  const { filters, setFilters, originalFilters } = useFilters();
  const [action, setAction] = useState<Action | null>(null);

  const teams = useTeams(filters);

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 md:p-6">
      <GradientBackground />
      <DashboardHeader
        title="Build your team, where AI meets human expertise for flawless UX insights"
        cta={
          <CreateTeamDialog>
            <Button className="animate-border-glow rounded-full">
              Create team
            </Button>
          </CreateTeamDialog>
        }
      />

      <div className="flex items-center justify-between gap-1">
        <Button
          appearance={view === "all" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("all")}
        >
          All Team
        </Button>
        <Button
          appearance={view === "assigned" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("assigned")}
        >
          Assigned
        </Button>
        <Button
          appearance={view === "notAssigned" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("notAssigned")}
        >
          Not-Assigned
        </Button>

        <InputSearch
          placeholder="Search teams"
          value={originalFilters.search}
          onChange={(e) => {
            setFilters((f) => ({ ...f, search: e.target.value }));
          }}
        />
      </div>

      {teams.data && teams.data.teams.length === 0 && (
        <div className="flex grow flex-col items-center justify-center text-sm">
          <FolderIcon className="size-40" />
          <p>No team created yet</p>
        </div>
      )}

      <QueryState query={teams} errorPrefix="Error fetching teams">
        <div className="flex flex-wrap gap-4">
          {teams.data?.teams.map((team) => {
            return (
              // biome-ignore lint/a11y/useSemanticElements: Child elements are divs and will cause hydration errors
              <div
                key={team._id}
                role="button"
                tabIndex={0}
                onClick={() => setAction({ type: "view", team })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setAction({ type: "view", team });
                  }
                }}
                className="cursor-pointer"
              >
                <DashboardCard
                  classNames={{
                    content: "w-full items-center justify-between",
                  }}
                  image={
                    <div className="flex h-full items-center justify-center bg-amber-500 text-background text-h1">
                      {getInitials(team.owner.username)}
                    </div>
                  }
                  content={
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-body-4 text-white">
                          {team.name}
                        </span>
                        <span className="text-muted-foreground text-xxs">
                          Created{" "}
                          {formatDistanceToNow(new Date(team.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="-space-x-2 flex">
                        {team.members?.map((member) => (
                          <Avatar
                            key={member._id}
                            className="size-6 border-2 border-secondary"
                          >
                            <AvatarFallback
                              className={cn(
                                "text-[9px] text-white",
                                // member.color,
                              )}
                            >
                              {getInitials(member.username)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </>
                  }
                />
              </div>
            );
          })}
        </div>
      </QueryState>

      {/* {teams.data && (
        <LogicalPagination
          currentPage={teams.data.pagination.currentPage}
          totalPages={teams.data.pagination.totalPages}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )} */}

      {action?.type === "view" && (
        <TeamsSheet
          open={true}
          onOpenChange={() => setAction(null)}
          team={action.team}
        />
      )}
    </div>
  );
};
