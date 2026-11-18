import type { MetadataRoute } from "next"; import service from "../../service.mjs";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots { const base = service.input().appUrl; return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account"] }, sitemap: `${base}/sitemap.xml` }; }
