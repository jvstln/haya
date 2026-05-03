"use client";

import { ArrowDown2, Logout, Setting2, User } from "iconsax-reactjs";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useAuth, useLogout } from "@/features/auth/auth.hook";
import { getInitials } from "@/lib/utils";
import { ChangeUsernameDialog } from "./change-username-dialog";

export const UserMenu = () => {
  const { user } = useAuth();
  const logout = useLogout();
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);

  // Get display name based on auth method
  const getDisplayName = () => {
    if (!user) return "User";

    if (user.authMethod === "wallet") {
      // Truncate wallet address for display
      const addr = user.walletAddress;
      return addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "Wallet User";
    }

    return user.username || "User";
  };

  // Get secondary info (email or wallet address)
  const getSecondaryInfo = () => {
    if (!user) return "";

    if (user.authMethod === "wallet") {
      return user.walletAddress ?? "";
    }

    // For email/google users, show email
    return user.email ?? "";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button appearance="ghost" color="secondary" className="h-auto gap-2">
            <Avatar className="size-9">
              <AvatarImage src="" alt={getDisplayName()} />
              <AvatarFallback>
                {getInitials(user?.username || "User")}
              </AvatarFallback>
            </Avatar>

            <span className="hidden max-w-14 flex-col text-left md:flex">
              <span className="truncate text-sm">{getDisplayName()}</span>
              <span className="truncate text-xs">{getSecondaryInfo()}</span>
            </span>

            <ArrowDown2 className="max-md:hidden" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-sm leading-none">
                {getDisplayName()}
              </p>
              <p className="truncate text-muted-foreground text-xs">
                {getSecondaryInfo()}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setIsUsernameDialogOpen(true)}>
              <User className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Setting2 className="size-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => logout.mutate()}
          >
            <Logout className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUsernameDialog
        open={isUsernameDialogOpen}
        onOpenChange={setIsUsernameDialogOpen}
      />
    </>
  );
};
