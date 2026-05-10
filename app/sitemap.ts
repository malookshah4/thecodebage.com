import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://thecodebage.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/apps/remote-mouse-pro/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
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
  ];
}
