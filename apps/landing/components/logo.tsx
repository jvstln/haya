import { Logo as LogoPrimitive } from "@workspace/assets/logo";
import { cn } from "@workspace/ui/lib/utils";

export const LogoIcon = () => {
  return <Logo />;
};

export const Logo = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-bold tracking-widest text-sm",
        className,
      )}
      {...props}
    >
      <LogoPrimitive className="size-5" />
      HAYA
    </div>
  );
};
