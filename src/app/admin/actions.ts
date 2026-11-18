"use server";
import { getServerSession } from "next-auth"; import { revalidatePath } from "next/cache"; import { db } from "@/lib/db"; import { authOptions, isAdmin } from "@/lib/auth";
async function guard() { if (!isAdmin(await getServerSession(authOptions))) throw new Error("Forbidden"); }
export async function createProduct(f: FormData) { await guard();
 const name = String(f.get("name")); const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
 const cname = String(f.get("category")).trim(); const cslug = cname.toLowerCase().replace(/[^a-z0-9]+/g, "-");
 const c = await db.category.upsert({ where: { slug: cslug }, update: {}, create: { name: cname, slug: cslug } });
 await db.product.create({ data: { name, slug, description: String(f.get("description")), price: Math.round(Number(f.get("price")) * 100), discountPct: Number(f.get("discountPct") || 0), stock: Number(f.get("stock")), images: [String(f.get("image"))], featured: f.get("featured") === "on", categoryId: c.id } });
 revalidatePath("/", "layout"); }
export async function deleteProduct(f: FormData) { await guard(); try { await db.product.delete({ where: { id: String(f.get("id")) } }); } catch {} revalidatePath("/", "layout"); }
export async function setStatus(f: FormData) { await guard(); await db.order.update({ where: { id: String(f.get("id")) }, data: { status: String(f.get("status")) as any } }); revalidatePath("/admin"); }
