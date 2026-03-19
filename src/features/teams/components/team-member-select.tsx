import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconToggleButton } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsers } from "@/features/users/user.hook";
import type { User, UserFilters } from "@/features/users/user.type";
import { useFilters } from "@/hooks/use-filters";
import { getInitials } from "@/lib/utils";

export const TeamMemberSelect = ({
  selectedUsers,
  onUserAdd,
  onUserRemove,
}: {
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
      <InputGroup className="border-0 bg-secondary/50">
        <InputGroupInput
          id={"teamMemberSelect"}
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

      <ScrollArea className="mt-6 h-[200px] [&_div[data-radix-scroll-area-viewport]>div]:h-full">
        <div className="flex h-full flex-col gap-4 px-4 py-2">
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
              <IconToggleButton onClick={() => onUserRemove(member)} isActive />
            </div>
          ))}

          {users.data?.users.length === 0 && originalUsersFilters.search && (
            <div className="grid w-full flex-1 place-content-center rounded-md border border-secondary border-dashed">
              <p>No user matching "{originalUsersFilters.search}" was found</p>
            </div>
          )}

          {users.data?.users.length === 0 && !originalUsersFilters.search && (
            <div className="grid w-full flex-1 place-content-center rounded-md border border-secondary border-dashed">
              <p>Search for a user</p>
            </div>
          )}

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
                <IconToggleButton onClick={() => onUserAdd(user)} />
              </div>
            ))}
          </QueryState>
        </div>
      </ScrollArea>
    </>
  );
};
