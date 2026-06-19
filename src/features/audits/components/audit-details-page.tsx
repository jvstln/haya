"use client";
import { ArrowLeft, Information, Share, Warning2 } from "iconsax-reactjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { HayaSpinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { useAudit } from "../audit.hook";
import { auditTypes } from "../audit.schema";
import { getIsAuditInProgress } from "../audit.service";
import { AuditDetailsImage } from "./audit-details-image";
import { ConversionOptimization } from "./audit-details-views";
import { AuditLoadingDialog } from "./audit-loading-dialog";
import { ShareFindingsDialog } from "./share-findings-dialog";

export const AuditDetailsPage = () => {
  const params = useParams();
  const [currentView, setCurrentView] = useState<"image" | "content">("image");
  const isMobile = useBreakpoint("max-md");

  const audit = useAudit(String(params.auditId));

  if (audit.isError) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center p-4">
        <Empty className="border-destructive/20 bg-destructive/5 shadow-sm">
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive"
          >
            <Warning2 size={40} variant="Bulk" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-destructive">
              Something went wrong
            </EmptyTitle>
            <EmptyDescription>
              {audit.error.message || "We couldn't load the audit details"}.
              Please try again or contact support if the problem persists.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => audit.refetch()}
              appearance="outline"
              color="secondary"
            >
              Try Again
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  if (getIsAuditInProgress(audit.data) && !audit.isPending) {
    return <AuditLoadingDialog open={true} />;
  }

  const auditType = auditTypes.find(
    ({ value }) => value === audit.data?.audit_type,
  );

  return (
    <div className="flex flex-col gap-6 from-0% from-primary/20 via-transparent p-4 max-md:bg-linear-to-b">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Button href="/dashboard/track-experience" appearance="soft">
          <ArrowLeft className="mr-1 size-4" />
          Back
        </Button>

        <a
          href={audit.data?.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          {audit.data?.url}
        </a>

        {auditType && (
          <Badge className="bg-[#FFAFA499]">{auditType.label}</Badge>
        )}

        <ShareFindingsDialog audit={audit.data}>
          <Button appearance="soft" className="ml-auto">
            <Share />
            Download findings
          </Button>
        </ShareFindingsDialog>
      </div>

      {/* Control to switch between image view and content view only on mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center p-4 backdrop-blur-2xs md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.9) 20% 80%, rgb(0 0 0 / 0.5))",
          boxShadow: "0px -10px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="mb-7 flex items-center justify-center gap-2 rounded-full bg-secondary p-2">
          <Button
            appearance={currentView === "image" ? "solid" : "ghost"}
            className="rounded-full"
            onClick={() => setCurrentView("image")}
          >
            Image View
          </Button>
          <Button
            appearance={currentView === "content" ? "solid" : "ghost"}
            className="rounded-full"
            onClick={() => setCurrentView("content")}
          >
            Content View
          </Button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      {audit.isPending ? (
        <div className="flex gap-4 *:grow">
          {Array.from({ length: 4 }).map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Element uniqueness doesnt matter
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
      ) : !audit.data.content?.audit_summary ? (
        <Card className="items-center text-center">
          <CardTitle className="text-amber-500 text-h3">
            No summary info collected
          </CardTitle>
          <span className="text-amber-300">
            You can try analyzing the url again.
          </span>
        </Card>
      ) : (
        <div className="flex gap-4 *:grow">
          <Card className="basis-2/5">
            <CardHeader className="text-muted-foreground">
              Top priority
            </CardHeader>
            <span className="text-h3">
              {audit.data.content.audit_summary?.top_priority}
            </span>
          </Card>

          {[
            // {
            //   label: "Business health",
            //   value: audit.data.content.audit_summary.business_health_verdict,
            //   accent: "--color-green-500",
            // },
            {
              label: "Top issues",
              value: audit.data.content.audit_summary?.critical_issues_count,
              accent: "--color-red-500",
            },
            {
              label: "Quick wins",
              value: audit.data.content.audit_summary?.quick_wins_count,
              accent: "--color-yellow-500",
            },
            {
              label: "Overall score",
              value: audit.data.content.audit_summary?.overall_score,
              accent: "--color-blue-500",
            },
            // {
            //   label: "Total findings",
            //   value: audit.data.content.audit_summary.total_findings,
            //   accent: "--color-blue-500",
            // },
          ].map((info) => (
            <Card key={info.label} className="basis-1/5">
              <div
                className="flex size-7 items-center justify-center rounded-md bg-current/10 p-1.25"
                style={{ color: `var(${info.accent})` }}
              >
                <Information />
              </div>
              <span className="text-h3">{info.value}</span>
              <span className="font-medium text-muted-foreground text-sm">
                {info.label}
              </span>
            </Card>
          ))}
        </div>
      )}

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Card: Discovered Problems */}
        <div className={cn(isMobile && currentView !== "image" && "hidden")}>
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Discovered Problems</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[800px] pr-4">
                <div className="flex flex-col gap-4">
                  {audit.isPending ? (
                    <div className="flex flex-col items-center gap-2 py-12">
                      <HayaSpinner />
                      <span className="text-muted-foreground text-sm">
                        Preparing images
                      </span>
                    </div>
                  ) : (
                    audit.data.content?.pages.map((page) => (
                      <AuditDetailsImage
                        key={page.pageUrl}
                        src={page.screenshotUrl}
                        alt={page.pageName}
                      />
                    ))
                  )}
                  {getIsAuditInProgress(audit.data) && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <HayaSpinner classNames={{ spinner: "size-8" }} />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Card: Report / Breakdown */}
        <div className={cn(isMobile && currentView !== "content" && "hidden")}>
          <Card className="flex h-full flex-col">
            <Tabs
              defaultValue={audit.data?.content?.categories?.[0]?.id}
              className="flex h-full flex-col"
            >
              <CardHeader>
                <CardTitle className="mb-4 text-h3">
                  Finding Category Breakdown
                </CardTitle>
                <ScrollArea className="w-full min-w-0 pb-2.5">
                  <TabsList>
                    {audit.data?.content?.categories?.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        render={(props, state) => (
                          <Button
                            {...props}
                            appearance={state.active ? "solid" : "ghost"}
                            color={"secondary"}
                            size="sm"
                          />
                        )}
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar
                    className="text-secondary"
                    orientation="horizontal"
                  />
                </ScrollArea>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 pt-6">
                {!audit.data?.content?.categories ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="text-h2">
                      No findings available for this product
                    </div>
                    <div className="text-amber-300">
                      You can try re-running the analysis for this url
                    </div>
                  </div>
                ) : (
                  audit.data?.content?.categories?.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <ConversionOptimization issues={category.issues} />
                    </TabsContent>
                  ))
                )}
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};
