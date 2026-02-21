import { Plus } from "lucide-react";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsers } from "@/features/users/user.hook";
import type { User, UserFilters } from "@/features/users/user.type";
import { useFilters } from "@/hooks/use-filters";
import { cn, getInitials } from "@/lib/utils";

export const TeamMemberSelect = ({
  label,
  selectedUsers,
  onUserAdd,
  onUserRemove,
}: {
  label?: string;
  selectedUsers: User[];
  onUserAdd: (user: User) => void;
  onUserRemove: (user: User) => void;
}) => {
  const {
    filters: usersFilters,
    setFilters: setUsersFilters,
    originalFilters: originalUsersFilters,
  } = useFilters<UserFilters>();

  const users = useUsers(usersFilters);

  const usersWithoutSelectedMembers = users.data?.users.filter(
    (user) => !selectedUsers.some((member) => member._id === user._id),
  );

  return (
    <>
      <Field>
        <FieldLabel>{label ?? "Add Member"}</FieldLabel>
        <InputGroup className="border-0 bg-secondary/50">
          <InputGroupInput
            placeholder="Search user by username"
            className="bg-none"
            value={originalUsersFilters.search}
            onChange={(e) => {
              setUsersFilters((uf) => ({
                ...uf,
                search: e.target.value,
              }));
            }}
          />
          {selectedUsers.length > 0 && (
            <InputGroupAddon align="block-start">
              {selectedUsers.map((member) => (
                <div
                  className="rounded-sm bg-[#303131] px-4 py-1 text-sm text-white"
                  key={member._id}
                >
                  {member.username}
                </div>
              ))}
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>

      <ScrollArea className="mt-6 h-[200px]">
        <div className="flex flex-col gap-4 px-4 py-2">
          {selectedUsers.map((member) => (
            <div key={member._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border-2 border-background ring-2 ring-primary">
                  <AvatarFallback className="bg-primary/20 font-medium text-primary">
                    {getInitials(member.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{member.username}</span>
              </div>
              <Button
                type="button"
                size="icon-sm"
                onClick={() => onUserRemove(member)}
              >
                <Plus
                  className={cn(
                    "transition-transform duration-200",
                    "rotate-45", // Selected indicator style
                  )}
                />
              </Button>
            </div>
          ))}

          <QueryState query={users}>
            {usersWithoutSelectedMembers?.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border-2 border-background ring-2 ring-primary">
                    <AvatarFallback className="bg-primary/20 font-medium text-primary">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{user.username}</span>
                </div>
                <Button
                  type="button"
                  size="icon-sm"
                  appearance="outline"
                  color="secondary"
                  onClick={() => onUserAdd(user)}
                >
                  <Plus />
                </Button>
              </div>
            ))}
          </QueryState>
        </div>
      </ScrollArea>
    </>
  );
};
