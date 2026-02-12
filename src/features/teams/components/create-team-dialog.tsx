import { Plus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type CreateTeamDialogProps = React.ComponentProps<typeof Dialog> & {};

// Mock data for users
const MOCK_USERS = [
  {
    id: "1",
    name: "Emerie",
    handle: "@emerie",
    avatar: "/avatars/emerie.png", // Placeholder
  },
  {
    id: "2",
    name: "John Doe",
    handle: "@johndoe",
    avatar: "",
  },
  {
    id: "3",
    name: "Jane Smith",
    handle: "@janesmith",
    avatar: "",
  },
  {
    id: "4",
    name: "Alex Johnson",
    handle: "@alexj",
    avatar: "",
  },
];

export const CreateTeamDialog = ({
  children,
  ...props
}: CreateTeamDialogProps) => {
  const [_open, _setOpen] = useState(props.defaultOpen ?? false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(),
  );

  const open = props.open ?? _open;
  const setOpen = (open: boolean) => {
    _setOpen(open);
    props.onOpenChange?.(open);
  };

  const toggleMember = (id: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMembers(newSelected);
  };

  const handleCreate = () => {
    setOpen(false);
    // Reset state
    setMemberSearch("");
    setSelectedMembers(new Set());
  };

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      user.handle.toLowerCase().includes(memberSearch.toLowerCase()),
  );

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md" closeButton={false}>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a team of experts to validate AI insights and maximize growth
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder="your team name"
                  className="border-0 bg-secondary/50"
                />
              </Field>

              <Field>
                <FieldLabel>Add Member</FieldLabel>
                <Input
                  placeholder="@emerie   @e"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="border-0 bg-secondary/50"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <ScrollArea className="mt-6 h-[200px]">
            <div className="flex flex-col gap-4 px-4 py-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedMembers.has(user.id);

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border-2 border-background ring-2 ring-primary">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/20 font-medium text-primary">
                          Ox
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">
                        Oxedf.....fed
                      </span>
                    </div>
                    <Button
                      size="icon-sm"
                      appearance={isSelected ? "solid" : "outline"}
                      color={isSelected ? "primary" : "secondary"}
                      onClick={() => toggleMember(user.id)}
                    >
                      <Plus
                        className={cn(
                          "transition-transform duration-200",
                          isSelected && "rotate-45",
                        )}
                      />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="*:flex-1">
          <Button size="lg" onClick={handleCreate}>
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
