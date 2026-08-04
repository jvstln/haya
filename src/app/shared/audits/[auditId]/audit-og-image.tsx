import { ImageResponse } from "next/og";
import type { Audit } from "@/features/audits/audit.type";
import { BRAND, HayaBrandMark, latoFonts } from "@/lib/og-image";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

function domainOf(url: string) {
  let domain = url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
  if (domain.length > 34) domain = `${domain.slice(0, 32)}…`;
  return domain;
}

function scoreColor(score: number | undefined) {
  if (score === undefined) return BRAND.muted;
  if (score >= 80) return "#4ADE80";
  if (score >= 60) return "#FBBF24";
  return "#F87171";
}

export function renderAuditOgImage(audit: Audit | null) {
  const domain = audit ? domainOf(audit.url) : null;
  const summary = audit?.content?.audit_summary;
  const score = summary?.overall_score;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "64px 72px",
        backgroundColor: BRAND.bg,
        color: BRAND.white,
        fontFamily: "Lato",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -180,
          right: -140,
          width: 560,
          height: 560,
          borderRadius: "9999px",
          background:
            "linear-gradient(135deg, rgba(122,99,255,0.5), rgba(255,175,164,0.12))",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: -220,
          left: -120,
          width: 480,
          height: 480,
          borderRadius: "9999px",
          background:
            "linear-gradient(135deg, rgba(255,175,164,0.18), rgba(122,99,255,0.3))",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <HayaBrandMark size={46} />
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 1 }}>
            Haya
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 400, color: BRAND.muted }}>
          usehaya.io
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexGrow: 1,
          width: "100%",
          gap: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 22px",
              borderRadius: "9999px",
              backgroundColor: "rgba(122,99,255,0.16)",
              border: "1px solid rgba(122,99,255,0.45)",
              color: BRAND.primaryBright,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            {domain ? "UX Audit Report" : "Haya UX Analytics"}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: domain ? 76 : 64,
              fontWeight: 900,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            {domain ?? "AI-powered UX audits"}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              fontWeight: 400,
              color: BRAND.muted,
            }}
          >
            {domain
              ? "AI-powered UX, conversion & accessibility analysis"
              : "Find and fix friction points in minutes, not weeks"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            minWidth: 260,
          }}
        >
          {score !== undefined ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <div
                  style={{
                    fontSize: 150,
                    fontWeight: 900,
                    letterSpacing: -3,
                    lineHeight: 1,
                    color: scoreColor(score),
                  }}
                >
                  {score}
                </div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 400,
                    color: BRAND.muted,
                    marginLeft: 10,
                  }}
                >
                  /100
                </div>
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 26,
                  fontWeight: 400,
                  color: BRAND.muted,
                  textAlign: "right",
                }}
              >
                {summary?.critical_issues_count ?? 0} critical ·{" "}
                {summary?.total_findings ?? 0} findings
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: BRAND.primaryBright,
              }}
            >
              {domain ? "Report ready" : "Start free"}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: 10,
          borderRadius: 6,
          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.peach})`,
        }}
      />
    </div>,
    { ...OG_IMAGE_SIZE, fonts: latoFonts() },
  );
}
