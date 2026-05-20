"use client";
import { formatDistanceToNow } from "date-fns";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, IconToggleButton } from "@/components/ui/button";
import {
  createDialogHandle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputSearch } from "@/components/ui/input-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilters } from "@/hooks/use-filters";
import { getErrorMessage } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import type { EventReturnType } from "@/types";
import { useTeams } from "../team.hook";
import type { Team } from "../team.type";

type SelectTeamsDialogProps = React.ComponentProps<typeof Dialog> & {
  teams?: Team[];
  onTeamsChange?: (teams: Team[]) => void;
  onConfirm?: (teams: Team[]) => EventReturnType;
  onCancel?: () => EventReturnType;
  buttonText?: string;
  loadingText?: string;
  children?: React.ReactElement;
};

export const SelectTeamsDialog = ({
  teams: controlledTeams,
  onTeamsChange,
  onConfirm,
  onCancel,
  buttonText = "Select",
  loadingText,
  children,
  ...props
}: SelectTeamsDialogProps) => {
  const [dialogHandle] = useState(createDialogHandle);

  const [isLoading, setIsLoading] = useState(false);
  const { filters, setFilters, originalFilters } = useFilters({ limit: 10 });
  const [_selectedTeams, _setSelectedTeams] = useState<Team[]>([]);

  const teams = useTeams(filters);

  // Controlled and uncontrolled selected teams states
  const selectedTeams = controlledTeams ?? _selectedTeams;
  const setSelectedTeams = (teams: Team[]) => {
    _setSelectedTeams(teams);
    onTeamsChange?.(teams);
  };

  // Reset selected teams state if dialog is closed
  useEffect(() => {
    if (!dialogHandle.isOpen && selectedTeams.length > 0) {
      setSelectedTeams([]);
    }
  }, [dialogHandle.isOpen, selectedTeams.length, setSelectedTeams]);

  const toggleSelect = (team: Team) => {
    const exisitingTeam = selectedTeams.find((a) => a._id === team._id);

    if (exisitingTeam) {
      setSelectedTeams(selectedTeams.filter((a) => a._id !== team._id));
      return;
    }

    setSelectedTeams([...selectedTeams, team]);
  };

  const handleConfirm = async () => {
    try {
      if (selectedTeams.length === 0) {
        throw new Error("[FE]: No team selected");
      }

      setIsLoading(true);
      const preventDefault = await onConfirm?.(selectedTeams);
      if (!preventDefault) {
        dialogHandle.close();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage) toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog handle={dialogHandle} {...props}>
      {children && <DialogTrigger render={children} />}
      <DialogContent closeButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-semibold text-xl">All Teams</DialogTitle>
          <InputSearch
            placeholder="search"
            value={originalFilters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </DialogHeader>

        <ScrollArea className="h-full max-h-100 px-6 py-4">
          <QueryState
            query={teams}
            getIsLoading={(query) =>
              (query.isPending || isLoading) && (loadingText || true)
            }
          >
            <div className="flex flex-col gap-4">
              {teams.data?.teams.map((team) => {
                const isSelected = selectedTeams.some(
                  (a) => a._id === team._id,
                );

                return (
                  <div
                    key={team._id}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {getInitials(team.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm">{team.name}</span>
                        <span className="text-muted-foreground text-xs">
                          Created{" "}
                          {formatDistanceToNow(team.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <IconToggleButton
                      isActive={isSelected}
                      onClick={() => toggleSelect(team)}
                    />
                  </div>
                );
              })}
            </div>
          </QueryState>
        </ScrollArea>

        <DialogFooter className="mt-8 *:flex-1">
          <DialogClose
            render={<Button color="secondary" size="lg" disabled={isLoading} />}
          >
            Cancel
          </DialogClose>
          <Button size="lg" onClick={handleConfirm} isLoading={isLoading}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
