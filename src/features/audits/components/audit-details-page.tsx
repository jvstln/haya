"use client";
import { ArrowLeft, Share, Warning2 } from "iconsax-reactjs";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DashboardSlot } from "@/components/dashboard-ui";
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
import { MobileViewSwitch } from "@/components/ui/mobile-view-switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { HayaSpinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/auth.hook";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { useAudit } from "../audit.hook";
import { auditTypes } from "../audit.schema";
import { getIsAuditInProgress } from "../audit.service";
import { AuditDetailsImage } from "./audit-details-image";
import { AuditDetailsSummary } from "./audit-details-summary";
import { ConversionOptimization } from "./audit-details-views";
import { AuditLoadingDialog } from "./audit-loading-dialog";
import { DownloadFindingsDialog } from "./download-findings-dialog";
import { ShareFindingsPopover } from "./share-findings-popover";

type AuditDetailsPageProps = { auditId?: string };

export const AuditDetailsPage = ({ auditId }: AuditDetailsPageProps) => {
  const params = useParams();
  const [currentView, setCurrentView] = useState<"image" | "content">("image");
  const isMobile = useBreakpoint("max-md");

  const audit = useAudit(String(auditId ?? params.auditId));
  const _auth = useAuth();

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
    <DashboardSlot className="max-md:pb-28">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Button href="/dashboard/track-experience" appearance="soft" size="sm">
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

        <ShareFindingsPopover audit={audit.data}>
          <Button appearance="soft" className="ml-auto" size="sm">
            <Share />
            Share findings
          </Button>
        </ShareFindingsPopover>

        <DownloadFindingsDialog audit={audit.data}>
          <Button appearance="soft" size="sm">
            <Share />
            Download findings
          </Button>
        </DownloadFindingsDialog>
      </div>
      {/* Control to switch between image view and content view only on mobile */}
      <MobileViewSwitch
        currentView={currentView}
        onViewChange={setCurrentView}
        options={[
          { value: "image", label: "Image View" },
          { value: "content", label: "Content View" },
        ]}
      />

      <AuditDetailsSummary audit={audit} />

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
                  {getIsAuditInProgress(audit.data) && !audit.isPending && (
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
    </DashboardSlot>
  );
};
