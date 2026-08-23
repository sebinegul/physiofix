import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/patient",
        "/login",
        "/forgot-password",
        "/reset-password",
        "/api/",
      ],
    },
    sitemap: "https://physiofix.net/sitemap.xml",
  };
}
