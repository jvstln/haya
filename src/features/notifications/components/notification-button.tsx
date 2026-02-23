import { Notification } from "iconsax-reactjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NotificationButton = (
  props: React.ComponentProps<typeof Button>,
) => {
  return (
    <Button
      appearance="outline"
      color="secondary"
      size="icon"
      asChild
      {...props}
    >
      <Link href="/dashboard/notifications">
        <Notification />
      </Link>
    </Button>
  );
};
