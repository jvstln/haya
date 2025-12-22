import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import type * as React from "react";
import { type Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

type LogicalPaginationProps = {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /**
   * Number of sibling pages to show on each side of current page
   * @default 1
   */
  siblingCount?: number;
  className?: string;
};

/**
 * Generates the range of page numbers to display
 * Shows: [1] ... [sibling pages] [current] [sibling pages] ... [lastPage]
 */
function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  // Always show first page, last page, current page, and siblings
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis slots

  // If we have fewer pages than the total we want to show, just show all
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    // Show more pages at the start
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1
    );
    return [...leftRange, "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    // Show more pages at the end
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
    );
    return [1, "ellipsis", ...rightRange];
  }

  // Show ellipsis on both sides
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
}

/**
 * A reusable pagination component with logical page number display.
 * Works seamlessly with the useFilters hook and Pagination type.
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useFilters();
 * const { data } = useQuery(...);
 *
 * <LogicalPagination
 *   currentPage={filters.page ?? 1}
 *   totalPages={data?.pagination.totalPages ?? 1}
 *   onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
 * />
 * ```
 */
function LogicalPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: LogicalPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePaginationRange(currentPage, totalPages, siblingCount);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationButton
            aria-label="Go to previous page"
            size="default"
            className="gap-1 px-2.5 sm:pl-2.5"
            disabled={!hasPrevious}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </PaginationButton>
        </PaginationItem>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index === 1 ? "left" : "right"}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationButton
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationButton>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationButton
            aria-label="Go to next page"
            size="default"
            className="gap-1 px-2.5 sm:pr-2.5"
            disabled={!hasNext}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </PaginationButton>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type PaginationButtonProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">;

function PaginationButton({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-button"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  LogicalPagination,
  PaginationButton,
};
