// type DashboardHeaderProps = {
//   title: string;
//   cta: React.ReactNode;
// };

import { cn } from "@/lib/utils";

// export const DashboardHeader = ({ title, cta }: DashboardHeaderProps) => {
//   return (
//     <div
//       className="relative flex overflow-hidden rounded-xl border border-transparent"
//       style={{
//         background: `
//           linear-gradient(87.5deg, rgba(30, 30, 30, 0.26) 1.42%, rgba(122 99 255 / 0.26) 99.44%) padding-box,
//           linear-gradient(var(--background), var(--background)) padding-box
//           `,
//       }}
//     >
//       <div className="z-10 flex basis-full flex-col items-start gap-6 p-6 md:basis-3/5">
//         <h1 className="text-base text-white lg:text-h3">{title}</h1>
//         {cta}
//       </div>
//     </div>
//   );
// };

export const DashboardSlot = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col gap-6 p-3 md:p-6",
        "bg-linear-to-b from-primary/5 via-transparent to-transparent",
        className,
      )}
      data-slot="dashboard-slot"
      {...props}
    />
  );
};

export const DashboardHeader = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-4 rounded-xl border border-secondary bg-muted p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const DashboardTitle = ({
  className,
  ...props
}: React.ComponentProps<"h1">) => {
  return (
    <h1
      className={cn("peer text-base text-foreground lg:text-h3", className)}
      data-slot="dashboard-title"
      {...props}
    />
  );
};

export const DashboardDescription = (props: React.ComponentProps<"p">) => {
  return (
    <p
      className="peer-data-[slot=dashboard-title]:-mt-2 text-muted-foreground text-sm"
      {...props}
    />
  );
};
