import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WINDOWS_APPS, getApp } from "@/lib/apps";
import { AppDetail } from "@/components/site/app-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return WINDOWS_APPS.filter((a) => !a.customPath).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp("windows", slug);
  if (!app) return {};
  return {
    title: app.title,
    description: app.summary,
    alternates: { canonical: `/apps/windows/${slug}/` },
  };
}

export default async function WindowsAppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getApp("windows", slug);
  if (!app || app.customPath) notFound();
  return <AppDetail app={app} />;
}
