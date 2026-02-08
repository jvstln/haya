import { ArrowRight, Google } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { redirectToGoogleAuth } from "../auth.service";

export const GoogleAuthButton = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      size="lg"
      type="button"
      appearance="outline"
      color="secondary"
      {...props}
      className={cn("group", className)}
      onClick={() => redirectToGoogleAuth()}
    >
      <Google className="fill-current" />
      Continue with Google
      <ArrowRight className="ml-auto text-primary transition group-hover:translate-x-1" />
    </Button>
  );
};
