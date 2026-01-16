import {
  HamburgerMenu,
  Logout,
  Notification,
  Setting2,
  User,
} from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth, useLogout } from "@/features/auth/auth.hook";
import { setOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";
import logo from "@/public/logo.svg";
import { Button } from "./ui/button";

export const AppHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) w-full shrink-0 items-center gap-4 border-b bg-background px-5 md:px-10">
      {isMobile ? (
        <Button variant="ghost" size="icon" onClick={() => toggleSidebar()}>
          <HamburgerMenu />
        </Button>
      ) : (
        <Link href="/">
          <Image src={logo} alt="Logo" className="h-9" />
        </Link>
      )}
      <Button className="ml-auto" variant="glass" size="icon">
        <Notification />
      </Button>
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <>
          <Button
            className="animate-border-glow rounded-full"
            onClick={() => setOnboardingFormDialogView("signUpEmail")}
          >
            Sign up
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOnboardingFormDialogView("login")}
          >
            Login
          </Button>
        </>
      )}
    </header>
  );
};

const UserMenu = () => {
  const { user } = useAuth();
  const logout = useLogout();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-9">
            <AvatarImage src="" alt={getDisplayName()} />
            <AvatarFallback className="bg-primary/20 text-primary">
              <User className="size-5" />
            </AvatarFallback>
          </Avatar>
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
          <DropdownMenuItem>
            <User className="size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Setting2 className="size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => logout.mutate()}>
          <Logout className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
