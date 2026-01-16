"use client";
import { Document, Image, Link, Page, Text, View } from "@react-pdf/renderer";
import { Fragment } from "react";
import { useAuth } from "@/features/auth/auth.hook";
import type { AuditSection, ParsedAudit } from "../audit.type";

interface AuditPdfDocumentProps {
  audit: ParsedAudit;
}

export const colors = {
  // Base colors (from globals.css)
  background: "#F8FAFC",
  foreground: "#333333",
  header: "#1E1E1E",
  primary: "#7A63FF", // oklch(60.795% 0.2218 284.387)
  primaryForeground: "#FFFFFF",
  primaryCompliment: "#ffafa4",
  secondary: "#1E1E1E",
  secondaryForeground: "#a3a3a4",

  // UI colors
  border: "#303131",
  card: "#303131",
  muted: "#121212",

  // Status colors
  destructive: "#DC2626", // oklch(60% 0.2 25) ≈ red
  success: "#16A34A", // oklch(60% 0.2 140) ≈ green

  // PDF-specific
  problemBg: "#2D1F1F",
  problemText: "#F87171",
  solutionBg: "#1F2D1F",
  solutionText: "#4ADE80",
} as const;

export const AuditPdfDocument = ({ audit }: AuditPdfDocumentProps) => {
  const pages = audit.content?.pages ?? [];
  const auth = useAuth();
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sectionCount = pages.reduce(
    (acc, page) => acc + page.sections.length,
    0
  );

  const problemCount = pages.reduce(
    (acc, page) =>
      acc +
      page.sections.reduce(
        (acc, section) => acc + (section.aiAnalysis?.problems?.length || 0),
        0
      ),
    0
  );

  const solutionCount = pages.reduce(
    (acc, page) =>
      acc +
      page.sections.reduce(
        (acc, section) => acc + (section.aiAnalysis?.solutions?.length || 0),
        0
      ),
    0
  );

  const pageProps = {
    size: { width: 1058, height: 4650 },
    style: { padding: 32, backgroundColor: colors.background },
  };

  const viewSectionProps = {
    style: {
      borderRadius: 16,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: colors.border,
      padding: "32 24",
      gap: 16,
    },
  };

  return (
    <Document
      author={auth.user?.username}
      title={`Haya Analysis - ${audit.url}`}
      creator={window.location.hostname}
      producer={window.location.hostname}
      style={{
        color: colors.foreground,
        // fontFamily: "Lato", // Involves registering of font which may or may not work causing the pdf to not display
        fontSize: 14,
        fontWeight: 400,
      }}
    >
      <Page {...pageProps}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "semibold",
                color: colors.card,
              }}
            >
              UX Audit Report
            </Text>
            <Text>{audit.url}</Text>
          </View>
          <Text>Date: {generatedDate}</Text>
        </View>

        <View {...viewSectionProps}>
          {/* Analysis Summary */}
          <Text
            style={{ fontSize: 18, fontWeight: "semibold", marginBottom: 8 }}
          >
            Analysis Summary
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {/* Stat Card - Pages */}
            <View
              style={{
                flex: 1,
                borderRadius: 10,
                padding: 16,
                gap: 8,
                backgroundColor: colors.background,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {pages.length}
              </Text>
              <Text>Pages Analyzed</Text>
            </View>

            {/* Stat Card - Sections */}
            <View
              style={{
                flex: 1,
                borderRadius: 10,
                padding: 16,
                gap: 8,
                backgroundColor: colors.background,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {sectionCount}
              </Text>
              <Text>Sections Reviewed</Text>
            </View>

            {/* Stat Card - Problems */}
            <View
              style={{
                flex: 1,
                borderRadius: 10,
                padding: 16,
                gap: 8,
                backgroundColor: "#FEF2F2",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.destructive,
                }}
              >
                {problemCount}
              </Text>
              <Text>Problems Found</Text>
            </View>

            {/* Stat Card - Solutions */}
            <View
              style={{
                flex: 1,
                borderRadius: 10,
                padding: 16,
                gap: 8,
                backgroundColor: "#ECFDF5",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.success,
                }}
              >
                {solutionCount}
              </Text>
              <Text>Solutions Proposed</Text>
            </View>
          </View>

          {/* Pages and Sections */}
          <Text
            style={{ fontSize: 16, fontWeight: "semibold", marginBottom: 8 }}
          >
            Pages & Sections Overview
          </Text>
          <View
            style={{
              borderRadius: 10,
              padding: 16,
              backgroundColor: colors.background,
              marginBottom: 40,
            }}
          >
            {audit.content?.pages?.map((page) => (
              <Fragment key={page.pageUrl}>
                <Link src={page.pageUrl} style={{ marginVertical: 8 }}>
                  {page.pageName}
                </Link>

                {page.sections.map((section) => (
                  <Text
                    key={section.meta.sectionNumber}
                    style={{ marginLeft: 10 }}
                  >
                    {section.meta.sectionNumber}. {section.category}
                  </Text>
                ))}
              </Fragment>
            ))}
          </View>

          {/* TODO: More summaries coming soon. requires backend update */}
        </View>
      </Page>

      {pages.map((page) => (
        <Page key={page.pageUrl} {...pageProps}>
          {/* Analysed pages */}
          <View {...viewSectionProps}>
            <Text
              style={{ fontSize: 18, fontWeight: "semibold", marginBottom: 40 }}
            >
              Findings Breakdown by Sections
            </Text>

            {/* Sections */}
            {page.sections.map((section) => (
              <AuditPdfSection
                key={section.meta.sectionNumber}
                section={section}
              />
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

interface AuditPdfSectionProps {
  section: AuditSection;
}

const AuditPdfSection = ({ section }: AuditPdfSectionProps) => {
  const problems = section.aiAnalysis?.problems ?? [];
  const solutions = section.aiAnalysis?.solutions ?? [];

  return (
    <View wrap={false} style={{ marginBottom: 40 }}>
      <Text
        style={{
          marginBottom: 12,
          fontSize: 16,
        }}
      >
        Findings {section.meta.sectionNumber}
      </Text>

      <View
        style={{ borderRadius: 10, padding: 16, gap: 24, borderWidth: 0.2 }}
      >
        <Image src={section.screenshotUrl} />
        <Text style={{ fontSize: 16 }}>Problems</Text>
        {problems.map((problem) => (
          <Text
            key={problem}
            style={{
              padding: 16,
              borderRadius: 10,
              gap: 12,
              backgroundColor: "#FEF2F2",
            }}
          >
            {problem}
          </Text>
        ))}
        <Text style={{ fontSize: 16 }}>Solutions</Text>
        {solutions.map((solution) => (
          <Text
            key={solution}
            style={{
              padding: 16,
              borderRadius: 10,
              gap: 12,
              backgroundColor: "#ECFDF5",
            }}
          >
            {solution}
          </Text>
        ))}
      </View>
    </View>
  );
};
