import { formatDistanceToNow } from "date-fns";
import type React from "react";
import { useState } from "react";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button, IconToggleButton } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { InputSearch } from "@workspace/ui/components/input-search";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { useAudits } from "@/features/audits/audit.hook";
import { useFilters } from "@/hooks/use-filters";

type SelectableAudit = NonNullable<
  ReturnType<typeof useAudits>["data"]
>["data"][number];

type SelectAuditsDialogProps = React.ComponentProps<typeof Dialog> & {
  onSelect: (audits: SelectableAudit[]) => void | Promise<void>;
  defaultSelectedAudits?: SelectableAudit[];
  buttonText?: string;
  loadingText?: string;
};

export const SelectAuditsDialog = ({
  onSelect,
  defaultSelectedAudits,
  buttonText = "Select",
  loadingText,
  ...props
}: SelectAuditsDialogProps) => {
  // Controlled and uncontrolled open states
  const [_open, _setOpen] = useState(props.defaultOpen);
  const open = props.open ?? _open;
  const setOpen = (open: boolean) => {
    props.onOpenChange?.(open);
    _setOpen(open);
    if (!open) {
      setSelectedAudits(defaultSelectedAudits ?? []);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const { filters, setFilters, originalFilters } = useFilters({ limit: 10 });
  const [selectedAudits, setSelectedAudits] = useState<SelectableAudit[]>(
    defaultSelectedAudits ?? [],
  );

  const audits = useAudits(filters);

  const toggleSelect = (audit: SelectableAudit) => {
    setSelectedAudits((sa) => {
      const exisitingAudit = sa.find((a) => a._id === audit._id);

      if (exisitingAudit) {
        return sa.filter((a) => a._id !== audit._id);
      }
      return [...sa, audit];
    });
  };

  const handleSelect = async () => {
    try {
      setIsLoading(true);
      await onSelect(selectedAudits);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent closeButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-semibold text-xl">
            All Projects
          </DialogTitle>
          <InputSearch
            placeholder="search"
            value={originalFilters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </DialogHeader>

        <ScrollArea className="h-100 px-6 py-4">
          <QueryState
            query={{ ...audits, isPending: audits.isPending || isLoading }}
            errorPrefix="Error fetching audits"
            loadingText={loadingText}
          >
            <div className="flex flex-col gap-4">
              {audits.data?.data.map((audit) => {
                const isSelected = selectedAudits.some(
                  (a) => a._id === audit._id,
                );

                return (
                  <div
                    key={audit._id}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
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
                    <IconToggleButton
                      isActive={isSelected}
                      onClick={() => toggleSelect(audit)}
                    />
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
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button size="lg" onClick={handleSelect} isLoading={isLoading}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
