"use client";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { useAuth } from "@/features/auth/auth.hook";
import type { AuditSection, ParsedAudit } from "../audit.type";

interface AuditPdfDocumentProps {
  audit: ParsedAudit;
}

Font.register({
  family: "Lato",
  src: "http://fonts.gstatic.com/s/lato/v13/v0SdcGFAl2aezM9Vq_aFTQ.ttf",
});

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
  mutedForeground: "#c9c9ca", // oklab(79.926% 0.00117 -0.0041)

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

  return (
    <Document
      author={auth.user?.username}
      title={`Haya Analysis - ${audit.url}`}
      creator={window.location.hostname}
      producer={window.location.hostname}
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        // fontFamily: "Lato",
        fontSize: 14,
        fontWeight: 400,
      }}
    >
      {pages.map((page) => (
        <Page
          key={page.pageUrl}
          // size="B3"
          size={{ width: 1058, height: 4868 }}
          style={{ padding: 32 }}
        >
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
              <Link>{audit.url}</Link>
            </View>
            <Text>Date: {generatedDate}</Text>
          </View>

          {/* Analysed pages */}
          <View
            style={{
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              padding: "32 24",
            }}
          >
            {/* Overview summary */}
            <Text style={{ fontSize: 16, marginBottom: 12 }}>
              Overview About Website
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
                <Text key={page.pageUrl}>{page.pageName}</Text>
              ))}
            </View>

            {/* TODO: More summaries coming soon. requires backend update */}

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
