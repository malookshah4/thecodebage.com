import type { Metadata } from "next";
import { WINDOWS_APPS } from "@/lib/apps";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return WINDOWS_APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = WINDOWS_APPS.find((a) => a.slug === slug);
  const target = app?.customPath ?? "/apps/windows/";
  return {
    title: "Redirecting…",
    alternates: { canonical: target },
  };
}

export default async function WindowsAppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = WINDOWS_APPS.find((a) => a.slug === slug);
  const target = app?.customPath ?? "/apps/windows/";
  return (
    <main style={{ padding: 40 }}>
      <p>
        Redirecting to <a href={target}>{target}</a>…
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(target)});`,
        }}
      />
    </main>
  );
}
