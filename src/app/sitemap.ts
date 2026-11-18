import type { MetadataRoute } from "next"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const base = process.env.APP_URL ?? "http://localhost:3000"; const ps = await db.product.findMany({ select: { slug: true, createdAt: true } });
 return [...["", "/shop", "/about", "/contact", "/faq", "/privacy", "/terms"].map((p) => ({ url: base + p })), ...ps.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.createdAt }))];
}
