import type { MetadataRoute } from "next"; import { db } from "@/lib/db"; import service from "../../service.mjs";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = service.input().appUrl; const ps = await db.orm.public.Product.select("slug", "createdAt").all();
  return [...["", "/shop", "/about", "/contact", "/faq", "/privacy", "/terms"].map((p) => ({ url: base + p })), ...ps.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.createdAt }))];
}
