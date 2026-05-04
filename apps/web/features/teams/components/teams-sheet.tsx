import { Blend } from "iconsax-reactjs";
import { MoreVertical, Plus, X } from "lucide-react";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { InputSearch } from "@workspace/ui/components/input-search";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { useAudits } from "@/features/audits/audit.hook";
import { AuditCard } from "@/features/audits/components/audit-card";
import { SelectAuditsDialog } from "@/features/audits/components/select-audits-dialog";
import { getInitials } from "@/lib/utils";
import { useAssignAuditsToTeam, useTeam } from "../team.hook";
import { AddTeamMemberDialog } from "./add-team-member-dialog";
import { MessageTeamMembersForm } from "./message-team-members-form";
import { FolderIcon } from "@workspace/ui/components/icons";

type TeamsSheetProps = React.ComponentProps<typeof Sheet> & {
  teamId: string;
};

export const TeamsSheet = ({ teamId, ...props }: TeamsSheetProps) => {
  const team = useTeam(teamId);
  const audits = useAudits({ teamId });
  const assignAuditsToTeam = useAssignAuditsToTeam();

  return (
    <Sheet {...props}>
      <SheetContent
        className="flex w-full flex-col bg-[#1E1E1E] p-0 text-white sm:max-w-[548px]"
        closeButton={
          <SheetClose asChild>
            <Button
              className="absolute top-4 right-[calc(100%+1rem)]"
              color="secondary"
              size="icon-sm"
            >
              <X />
            </Button>
          </SheetClose>
        }
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b p-4 text-left">
          <SheetTitle className="font-semibold text-foreground">
            All Teams
          </SheetTitle>
          <AddTeamMemberDialog teamId={team.data?._id || ""}>
            <Button
              className="rounded-full"
              color="secondary"
              disabled={!team.data}
            >
              <Plus className="size-5.5 rounded-sm bg-primary p-1" />
              Add Member
            </Button>
          </AddTeamMemberDialog>
        </SheetHeader>

        <QueryState query={team} errorPrefix="Error fetching team">
          {team.data && (
            <ScrollArea className="flex-1 overflow-hidden">
              <div className="flex flex-col gap-4 p-6">
                {/* Members List */}
                <div className="flex flex-col gap-2">
                  {team.data.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 rounded-lg hover:bg-[#2a2a2a]/20"
                    >
                      <Avatar className="size-6">
                        <AvatarFallback>
                          {getInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-white">
                            @{member.username}
                          </span>
                          {member._id === team.data.owner._id && (
                            <span className="rounded text-orange-500 text-xxs">
                              Admin
                            </span>
                          )}
                        </div>
                        {/* <span className="text-muted-foreground text-xs">
                        Oxecff.....fed
                      </span> */}
                      </div>
                      <Button
                        appearance="ghost"
                        color="secondary"
                        size="icon"
                        className=""
                      >
                        <MoreVertical className="size-5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <MessageTeamMembersForm team={team.data} />

                {/* Assigned Section */}
                <div className="my-6 flex flex-col gap-4">
                  <div className="justify- flex items-center gap-2">
                    <h3 className="font-semibold">Assigned</h3>
                    <InputSearch placeholder="Search..." />
                    <SelectAuditsDialog
                      buttonText="Assign"
                      loadingText="Assigning..."
                      onSelect={async (audits) => {
                        await assignAuditsToTeam.mutateAsync({
                          teamId: team.data._id,
                          auditIds: audits.map((audit) => audit._id),
                        });
                      }}
                    >
                      <Button className="rounded-full" color="secondary">
                        <Blend className="size-5.5 rounded-sm bg-cyan p-1" />
                        Assign
                      </Button>
                    </SelectAuditsDialog>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {audits.isPending || audits.isError ? (
                      <QueryState
                        query={audits}
                        errorPrefix="Error fetching audits"
                      />
                    ) : audits.data.data.length === 0 ? (
                      <div className="flex grow flex-col items-center justify-center text-sm">
                        <FolderIcon className="size-40" />
                        <p>No assigned audit yet</p>
                      </div>
                    ) : (
                      audits.data?.data?.map((audit) => (
                        <AuditCard key={audit._id} audit={audit} />
                      ))
                    )}
                  </div>
                </div>
                <Button
                  color="destructive"
                  size="lg"
                  className="mt-auto w-full"
                >
                  Deactivate Team
                </Button>
              </div>
            </ScrollArea>
          )}
        </QueryState>
      </SheetContent>
    </Sheet>
  );
};
