import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DashboardCardProps<TLink> = {
  href?: LinkProps<TLink>["href"];
  image?: string | React.ReactNode;
  classNames?: Partial<Record<"root" | "content", string>>;
  content?: React.ReactNode;
  actions?: Array<
    React.ComponentProps<typeof DropdownMenuItem> & {
      label?: string;
      icon?: React.ComponentType | React.ReactNode;
    }
  >;
};

/** @deprecated */
export const DashboardCard = <const TLink extends string>({
  href,
  classNames,
  image = "/images/default-audit-card-bg.webp",
  content,
  actions,
}: DashboardCardProps<TLink>) => {
  const componentContent = (
    <>
      {typeof image === "string" ? (
        <Image src={image} alt="" className="-z-10 object-cover" fill />
      ) : (
        image
      )}

      {/* Text Content */}
      <span
        className={cn(
          "mt-auto flex items-center gap-4 bg-secondary p-4",
          classNames?.content,
        )}
      >
        {content}
      </span>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                appearance="ghost"
                color="secondary"
                className="absolute top-1 right-1 size-6 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical />
              </Button>
            }
          />
          <DropdownMenuContent
            align="end"
            onClick={(e) => {
              // Prevent outer link from opening if any
              e.stopPropagation();
            }}
          >
            {actions.map((action, index) => {
              return (
                <DropdownMenuItem key={action.label || index} {...action}>
                  {action.children ? (
                    action.children
                  ) : (
                    <>
                      {/* {typeof action.icon === "function" ? (
                        <action.icon />
                      ) : (
                        action.icon
                      )} */}
                      {action.icon}
                      {action.label}
                    </>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );

  const rootClassName = cn(
    "group relative flex h-47.25 w-55.5 flex-col overflow-hidden rounded-2xl border shadow-primary transition hover:shadow-md",
    classNames?.root,
  );

  if (href) {
    return (
      <Link href={href} className={rootClassName}>
        {componentContent}
      </Link>
    );
  }

  return <div className={rootClassName}>{componentContent}</div>;
};
