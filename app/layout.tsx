import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://thecodebage.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "thecodebage — Utilities that respect your time",
    template: "%s · thecodebage",
  },
  description:
    "Software utilities built with care. Maker of Remote Mouse Pro — turn your phone into a wireless trackpad, keyboard, and OCR scanner for your PC.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "thecodebage",
    title: "thecodebage — Utilities that respect your time",
    description:
      "Maker of Remote Mouse Pro. LAN-only, privacy-first utilities for everyday computing.",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: "thecodebage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "thecodebage — Utilities that respect your time",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
