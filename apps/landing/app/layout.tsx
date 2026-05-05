import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@workspace/ui/globals.css";
import "./globals.css";
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haya | AI-Powered Behavioral Audit & Funnel Optimization",
  description: "See the friction, fix the funnel. Haya AI automatically identifies conversion blockers and behavioral friction points on your website or app in minutes.",
  keywords: ["AI audit", "behavioral audit", "funnel optimization", "UX design", "conversion rate optimization", "CRO"],
  authors: [{ name: "Haya Team" }],
  openGraph: {
    title: "Haya | AI-Powered Behavioral Audit",
    description: "Automatically identify and fix friction points in your user journey.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haya | AI-Powered Behavioral Audit",
    description: "Identify friction points in your funnel automatically.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
