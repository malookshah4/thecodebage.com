import type { MetadataRoute } from "next";
import { ANDROID_APPS, WINDOWS_APPS, appHref } from "@/lib/apps";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const SITE = "https://thecodebage.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const appUrls: MetadataRoute.Sitemap = [...ANDROID_APPS, ...WINDOWS_APPS].map((a) => {
    const href = appHref(a);
    const url = href.startsWith("http") ? href : `${SITE}${href}`;
    return {
      url,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: a.featured ? 0.9 : 0.7,
    };
  });

  const blogUrls: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${SITE}/blog/${p.slug}/`,
    lastModified: new Date(`${p.date}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${SITE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/about/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/apps/android/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE}/apps/windows/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...appUrls,
    {
      url: `${SITE}/blog/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogUrls,
    {
      url: `${SITE}/apps/remote-mouse-pro/privacy/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE}/privacy/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE}/terms/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE}/support/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://lifeos.thecodebage.com/privacy/",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "https://lifeos.thecodebage.com/terms/",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
