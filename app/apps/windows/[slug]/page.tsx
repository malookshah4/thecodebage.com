import type { Metadata } from "next";
import { WINDOWS_APPS } from "@/lib/apps";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return WINDOWS_APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = WINDOWS_APPS.find((a) => a.slug === slug);
  const target = app?.customPath ?? "/apps/windows/";
  return {
    title: "Redirecting…",
    alternates: { canonical: target },
    other: { "http-equiv-refresh": `0; url=${target}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
