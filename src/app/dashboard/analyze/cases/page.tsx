"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAnalyses } from "@/features/analysis/analysis.api";
import Link from "next/link";

const AllCases = () => {
  const analysis = useAnalyses();

  return (
    <div className="flex h-full w-full flex-col space-y-7 p-5">
      {analysis.isPending ? (
        <div className="grid place-content-center size-full">
          <Spinner className="size-12" />
        </div>
      ) : analysis.isError ? (
        <div className="grid place-content-center gap-2 size-full">
          <p className="text-center text-destructive">Something went wrong</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => analysis.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        analysis.data.map((analysis) => (
          <Link
            href={`/dashboard/analyze/cases/${analysis._id}`}
            key={analysis._id}
            className="bg-border rounded-md p-2 flex flex-col gap-1 hover:text-white"
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
  );
};

export default AllCases;
