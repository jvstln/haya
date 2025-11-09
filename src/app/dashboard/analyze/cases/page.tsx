"use client";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  useAnalyses,
  useDeleteAnalyses,
} from "@/features/analysis/analysis.api";

const AllCases = () => {
  const analyses = useAnalyses();
  const deleteAnalysis = useDeleteAnalyses();

  return (
    <div className="grid gap-5 p-5">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl">All completed analysis</h1>
        {(analyses.data?.length || 0) > 0 && (
          <ConfirmationDialog
            onConfirm={async () => deleteAnalysis.mutateAsync()}
          >
            <Button variant="destructive" size="icon" className="ml-auto">
              <Trash2Icon />
            </Button>
          </ConfirmationDialog>
        )}
      </div>

      <div className="flex h-full w-full flex-col space-y-7">
        {analyses.isPending ? (
          <div className="grid size-full place-content-center">
            <Spinner className="size-12" />
          </div>
        ) : analyses.isError ? (
          <div className="grid size-full place-content-center gap-4">
            <p className="text-center text-destructive">Something went wrong</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => analyses.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : analyses.data.length === 0 ? (
          <EmptyState
            title="No analysis yet"
            description={
              <Button asChild>
                <Link href="/dashboard/analyze">Start analyzing</Link>
              </Button>
            }
          />
        ) : (
          analyses.data.map((analysis) => (
            <Link
              href={`/dashboard/analyze/cases/${analysis._id}`}
              key={analysis._id}
              className="flex flex-col gap-1 rounded-md bg-border p-2 hover:text-white"
            >
              <h3 className="text-xl">{analysis.url}</h3>
              <div className="text-sm">
                <p className="">{analysis.analysis_type}</p>
                <p className="">{analysis.createdAt}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AllCases;
