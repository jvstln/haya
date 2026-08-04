import { ImageResponse } from "next/og";
import { BRAND, HayaBrandMark, latoFonts } from "@/lib/og-image";

export const alt = "Haya — AI-powered UX Analytics Platform";
export const size = { width: 1200, height: 628 };
export const contentType = "image/png";

export default function Image() {
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
          gap: 14,
          width: "100%",
        }}
      >
        <HayaBrandMark size={46} />
        <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 1 }}>
          Haya
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
          width: "100%",
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
          AI-powered UX analytics
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 26,
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1.08,
          }}
        >
          <div>Find friction.</div>
          <div>Fix UX in minutes.</div>
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 400,
            color: BRAND.muted,
          }}
        >
          Seamless infrastructure for onchain UX analytics — identify and fix
          friction points in minutes, not weeks.
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
    { ...size, fonts: latoFonts() },
  );
}
