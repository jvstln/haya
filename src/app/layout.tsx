import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Providers } from "@/components/providers";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Haya",
    default: "Haya - UX Analytics Platform",
  },
  description:
    "Seamless infrastructure for onchain UX analytics, empowering builders to identify and fix friction points in minutes, not weeks.",
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
          "bg-background font-lato text-foreground antialiased",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
