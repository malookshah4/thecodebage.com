import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ANDROID_APPS, getApp } from "@/lib/apps";
import { AppDetail } from "@/components/site/app-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ANDROID_APPS.filter((a) => !a.customPath).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp("android", slug);
  if (!app) return {};
  return {
    title: app.title,
    description: app.summary,
    alternates: { canonical: `/apps/android/${slug}/` },
  };
}

export default async function AndroidAppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getApp("android", slug);
  if (!app || app.customPath) notFound();
  return <AppDetail app={app} />;
}
