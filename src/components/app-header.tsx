import { HamburgerMenu } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth.hook";
import { setOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";
import { NotificationButton } from "@/features/notifications/components/notification-button";
import { UserMenu } from "@/features/users/components/user-menu";
import logo from "@/public/logo.svg";
import { Button } from "./ui/button";

export const AppHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) w-full shrink-0 items-center gap-4 border-b bg-background px-5 md:px-10">
      {isMobile ? (
        <Button appearance="ghost" size="icon" onClick={() => toggleSidebar()}>
          <HamburgerMenu />
        </Button>
      ) : (
        <Link href="/">
          <Image src={logo} alt="Logo" className="h-9" />
        </Link>
      )}
      <NotificationButton className="ml-auto" />
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <Button
          className="animate-border-glow rounded-full"
          onClick={() => setOnboardingFormDialogView("signUpEmail")}
        >
          Sign up
        </Button>
      )}
    </header>
  );
};
