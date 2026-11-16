import type { MetadataRoute } from "next";

const BASE_URL = "https://www.emeraldspotless.ie";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/pricing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/booking`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/location`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
