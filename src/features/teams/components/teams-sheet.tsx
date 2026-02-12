import { ArrowDown2, Blend } from "iconsax-reactjs";
import { MoreVertical, Plus, X } from "lucide-react";
import { useState } from "react";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { InputSearch } from "@/components/ui/input-search";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAudits } from "@/features/audits/audit.hook";
import { AssignAuditsDialog } from "@/features/audits/components/assign-audits-dialog";
import { AuditCard } from "@/features/audits/components/audit-card";
import { cn } from "@/lib/utils";
import type { Team } from "../team.type";

type TeamsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
};

export const TeamsSheet = ({ open, onOpenChange, team }: TeamsSheetProps) => {
  const audits = useAudits();
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  if (!team) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
          <Button className="rounded-full" color="secondary">
            <Plus />
            Add Member
          </Button>
        </SheetHeader>

        <div className="flex grow flex-col gap-4 overflow-y-auto p-6">
          {/* Members List */}
          <div className="flex flex-col gap-2">
            {team.members.map((member, index) => (
              <div
                key={member._id}
                className="flex items-center gap-2 rounded-lg hover:bg-[#2a2a2a]/20"
              >
                <Avatar className="size-6">
                  <AvatarFallback
                    className={cn(
                      "font-semibold text-base text-white",
                      member.color,
                    )}
                  >
                    {member.fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-white">
                      @{member.name.replace(/\s/g, "").toLowerCase()}
                    </span>
                    {index === 0 && ( // Mocking the first user as Admin for demo
                      <span className="rounded text-orange-500 text-xxs">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    Oxecff.....fed
                  </span>
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
            {/* Mocking extra members to match design if needed, or rely on actual data */}
          </div>

          {/* Message Section */}
          <InputGroup className="bg-background">
            <InputGroupTextarea placeholder="Send team message..." />
            <InputGroupAddon className="border-t" align="block-end">
              <Button
                size="sm"
                className="ml-auto"
                appearance="outline"
                color="secondary"
              >
                Select members
                <ArrowDown2 />
              </Button>
              <Button size="sm">Send</Button>
            </InputGroupAddon>
          </InputGroup>

          {/* Assigned Section */}
          <div className="my-6 flex flex-col gap-4">
            <div className="justify- flex items-center gap-2">
              <h3 className="font-semibold">Assigned</h3>
              <InputSearch placeholder="Search..." />
              <Button
                className="rounded-full"
                color="secondary"
                onClick={() => setShowAssignDialog(true)}
              >
                <Blend />
                Assign
              </Button>
            </div>

            <AssignAuditsDialog
              open={showAssignDialog}
              onOpenChange={setShowAssignDialog}
              onAssign={(ids) => {
                console.log("Assigning audits:", ids);
                // TODO: Implement actual assignment logic
              }}
            />

            <div className="flex flex-wrap gap-4">
              {audits.isPending || audits.isError ? (
                <QueryState
                  query={audits}
                  errorPrefix="Error fetching audits"
                />
              ) : (
                audits.data?.data?.map((audit) => (
                  <AuditCard key={audit._id} audit={audit} />
                ))
              )}
            </div>
          </div>

          <Button color="destructive" size="lg" className="mt-auto w-full">
            Deactivate Team
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
