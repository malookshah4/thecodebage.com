import type { Metadata } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono, Fraunces } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const SITE_URL = "https://thecodebage.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "codeBage — Utilities that respect your time",
    template: "%s · codeBage",
  },
  description:
    "codeBage — software utilities built with care. Maker of Remote Mouse Pro — turn your phone into a wireless trackpad, keyboard, and OCR scanner for your PC.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "codeBage",
    title: "codeBage — Utilities that respect your time",
    description:
      "Maker of Remote Mouse Pro. LAN-only, privacy-first utilities for everyday computing.",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: "codeBage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "codeBage — Utilities that respect your time",
    description:
      "Maker of Remote Mouse Pro. LAN-only, privacy-first utilities for everyday computing.",
    images: ["/og.jpeg"],
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
      className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
