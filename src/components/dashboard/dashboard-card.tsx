import { MoreVertical } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DashboardCardProps = {
  href?: Route;
  image?: string;
  classNames?: Partial<Record<"root" | "content", string>>;
  content?: React.ReactNode;
  actions?: Array<
    React.ComponentProps<typeof DropdownMenuItem> & {
      label?: string;
      icon?: React.ComponentType | React.ReactNode;
    }
  >;
};

export const DashboardCard = ({
  href,
  classNames,
  image,
  content,
  actions,
}: DashboardCardProps) => {
  const RootComponent = href ? Link : "div";

  return (
    <RootComponent
      href={href as Route}
      className={cn(
        "group relative flex h-47.25 w-55.5 flex-col overflow-hidden rounded-2xl border shadow-primary transition hover:shadow-md",
        classNames?.root,
      )}
      style={{
        // Analysis Image
        background: `
          linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 /0.5)),
          url(${image || "/images/default-audit-card-bg.webp"}) center center/cover no-repeat
          `,
      }}
    >
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
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
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
    </RootComponent>
  );
};
