"use client";
import { SearchNormal } from "iconsax-reactjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  DashboardHeader,
  GradientBackground,
} from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { QueryState } from "@/components/query-states";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LogicalPagination } from "@/components/ui/pagination";
import { useFilters } from "@/hooks/use-filters";
import { useResources } from "../resource.hook";

const SubscribeToResourcesForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: { email: string }) => {
    console.log(values);
  };

  return (
    <form className="flex gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
      <Field>
        <Input
          className="rounded-full"
          placeholder="Enter email"
          {...form.register("email")}
        />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>
      <Button className="animate-border-glow rounded-full">Subscribe</Button>
    </form>
  );
};

export const ResourcesPage = () => {
  const [view, setView] = useState<"all" | "pdf" | "media">("all");
  const [filters, setFilters] = useFilters();

  const resources = useResources();

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 [--resource-card-height:189px] [--resource-card-width:212px] md:p-6">
      <GradientBackground />
      <DashboardHeader
        title="Unlock Premium Growth Resources for Smarter Conversions"
        cta={<SubscribeToResourcesForm />}
      />

      <div className="flex items-center justify-between gap-1">
        <Button
          appearance={view === "all" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("all")}
        >
          All resources
        </Button>
        <Button
          appearance={view === "pdf" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("pdf")}
        >
          PDF
        </Button>
        <Button
          appearance={view === "media" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("media")}
        >
          Media
        </Button>

        <div className="relative ml-auto w-50 transition-[width] duration-300 ease-in-out focus-within:w-full">
          <Input
            type="search"
            className="rounded-full border-secondary pl-12"
            placeholder="Search resources"
            value={filters.originalSearch}
            onChange={(e) => {
              setFilters((f) => ({ ...f, search: e.target.value }));
            }}
          />
          <SearchNormal className="-translate-y-1/2 absolute top-1/2 left-4 size-4" />
        </div>
      </div>

      {resources.data && resources.data.data.length === 0 && (
        <div className="flex grow flex-col items-center justify-center text-sm">
          <FolderIcon className="size-40" />
          <p>No resources yet</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {resources.isPending || resources.isError ? (
          <QueryState
            query={resources}
            errorPrefix="Error fetching resources"
          />
        ) : (
          resources.data.data.map((resource) => {
            return (
              <DashboardCard
                key={resource._id}
                content={
                  <span className="max-w-32 truncate font-semibold text-body-4 text-white">
                    {resource.title}
                  </span>
                }
              />
            );
          })
        )}
      </div>

      {resources.data && (
        <LogicalPagination
          currentPage={resources.data.pagination.currentPage}
          totalPages={resources.data.pagination.totalPages}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )}
    </div>
  );
};
