import type { Metadata, Viewport } from "next";
import { Lato, Syncopate } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { HayaProvider } from "@/components/HayaProvider";
import { Providers } from "@/components/providers";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
});

const syncopate = Syncopate({
  subsets: ["latin"],
  variable: "--font-syncopate",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://usehaya.io"),
  title: {
    template: "%s | Haya",
    default: "Haya - UX Analytics Platform",
  },
  description:
    "Seamless infrastructure for onchain UX analytics, empowering builders to identify and fix friction points in minutes, not weeks.",
  applicationName: "Haya",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Haya",
    url: "https://usehaya.io",
    title: "Haya - UX Analytics Platform",
    description:
      "Seamless infrastructure for onchain UX analytics, empowering builders to identify and fix friction points in minutes, not weeks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haya - UX Analytics Platform",
    description:
      "Seamless infrastructure for onchain UX analytics, empowering builders to identify and fix friction points in minutes, not weeks.",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          lato.variable,
          syncopate.variable,
          "relative size-full min-h-screen bg-background font-lato text-foreground antialiased",
        )}
      >
        <Providers>
          <HayaProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
