import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { HayaSpinner } from "./ui/spinner";

/**
 * Props for the ErrorState component.
 */
type ErrorStateProps = {
  /** The query object from TanStack Query containing error and status */
  query?: {
    error?: Error | null;
    refetch?: () => void;
    isFetching?: boolean;
    isError?: boolean;
  };
  /** Optional custom class names for styling specific parts of the component */
  classNames?: Partial<
    Record<"errorRoot" | "root" | "error" | "button", string>
  >;
  /** Custom prefix for the error message (default: "Error:") */
  errorPrefix?: string;
  /** Custom error message. Overrides the default error message */
  errorMessage?: string;
};

/**
 * Displays an error message with a retry button.
 * Renders when a query fails.
 */
export const ErrorState = ({
  query,
  classNames,
  errorMessage,
  errorPrefix,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-destructive p-2 text-center",
        classNames?.root,
        classNames?.errorRoot,
      )}
    >
      <p className={cn("text-red-500 text-sm", classNames?.error)}>
        {errorMessage ?? `${errorPrefix ?? "Error:"} ${query?.error?.message}`}
      </p>
      {query?.refetch && (
        <Button
          size="sm"
          appearance="outline"
          color="secondary"
          isLoading={query?.isFetching}
          onClick={() => query?.refetch?.()}
          className={classNames?.button}
        >
          Retry
        </Button>
      )}
    </div>
  );
};

/**
 * Props for the LoadingState component.
 */
type LoadingStateProps = {
  /** Optional custom class names for styling */
  classNames?: Partial<Record<"loadingRoot" | "root", string>>;
};

/**
 * Displays a loading spinner centered in a container.
 */
export const LoadingState = ({ classNames }: LoadingStateProps) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center",
        classNames?.root,
        classNames?.loadingRoot,
      )}
    >
      <HayaSpinner />
    </div>
  );
};

/**
 * A wrapper component that handles loading and error states for queries.
 * - Renders `LoadingState` if `query.isFetching` is true.
 * - Renders `ErrorState` if `query.error` is present.
 * - Returns `null` otherwise (allowing children or subsequent content to render).
 */
export const QueryState = ({
  query,
  classNames,
  errorPrefix,
}: ErrorStateProps & LoadingStateProps) => {
  if (query?.isFetching) {
    return <LoadingState classNames={classNames} />;
  }

  if (query?.error || query?.isError) {
    return (
      <ErrorState
        query={query}
        classNames={classNames}
        errorPrefix={errorPrefix}
      />
    );
  }

  return null;
};
