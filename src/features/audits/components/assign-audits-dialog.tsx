import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputSearch } from "@/components/ui/input-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudits } from "@/features/audits/audit.hook";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";

type AssignAuditsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (auditIds: string[]) => void;
  assignedAuditIds?: string[];
};

export const AssignAuditsDialog = ({
  open,
  onOpenChange,
  onAssign,
  assignedAuditIds = [],
}: AssignAuditsDialogProps) => {
  const [filters, setFilters] = useFilters({ limit: 10 }); // Limit to 10 for now, maybe add logic for more
  const [selectedAudits, setSelectedAudits] = useState<Set<string>>(
    new Set(assignedAuditIds),
  );

  const audits = useAudits(filters);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedAudits);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAudits(newSelected);
  };

  const handleAssign = () => {
    onAssign(Array.from(selectedAudits));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-semibold text-xl">
            All Projects
          </DialogTitle>
          <InputSearch
            placeholder="search"
            value={filters.originalSearch}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </DialogHeader>

        <ScrollArea className="h-100 px-6 py-4">
          <QueryState query={audits} errorPrefix="Error fetching audits">
            <div className="flex flex-col gap-4">
              {audits.data?.data.map((audit) => {
                const isSelected = selectedAudits.has(audit._id);
                return (
                  <div
                    key={audit._id}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src="" />
                        <AvatarFallback>Ox</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm">{audit.url}</span>
                        <span className="text-muted-foreground text-xs">
                          Audited{" "}
                          {formatDistanceToNow(audit.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      appearance={isSelected ? "solid" : "outline"}
                      color={isSelected ? "primary" : "secondary"}
                      onClick={() => toggleSelect(audit._id)}
                    >
                      <Plus
                        className={cn(
                          "transition-transform",
                          isSelected && "rotate-45",
                        )}
                      />
                    </Button>
                  </div>
                );
              })}
            </div>
          </QueryState>
        </ScrollArea>

        <DialogFooter className="mt-8 *:flex-1">
          <Button
            color="secondary"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="lg" onClick={handleAssign}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
