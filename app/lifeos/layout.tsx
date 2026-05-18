import type { Metadata } from "next";
import { LifeOSHeader } from "@/components/lifeos-header";
import { LifeOSFooter } from "@/components/lifeos-footer";

const LIFEOS_URL = "https://lifeos.thecodebage.com";

export const metadata: Metadata = {
  metadataBase: new URL(LIFEOS_URL),
  icons: {
    icon: [
      { url: "/lifeos/favicon.ico" },
      { url: "/lifeos/logo-32.png", sizes: "32x32", type: "image/png" },
      { url: "/lifeos/logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/lifeos/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: { url: "/lifeos/favicon.ico" },
  },
  openGraph: {
    type: "website",
    url: LIFEOS_URL,
    siteName: "LifeOS",
    images: [
      {
        url: "/lifeos/og-lifeos.png",
        width: 1200,
        height: 630,
        alt: "LifeOS — Your second brain, fully local",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/lifeos/og-lifeos.png"],
  },
};

export default function LifeOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lifeos-shell">
      <LifeOSHeader />
      {children}
      <LifeOSFooter />
    </div>
  );
}
