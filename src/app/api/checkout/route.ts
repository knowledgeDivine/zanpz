import { NextResponse } from "next/server"; import { z } from "zod"; import { randomUUID } from "crypto"; import { getServerSession } from "next-auth";
import { db } from "@/lib/db"; import { authOptions } from "@/lib/auth"; import { salePrice } from "@/lib/format";
const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(7), address: z.string().min(5), city: z.string().min(2), coupon: z.string().optional(),
 items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1).max(20) })).min(1) });
import { limited } from "@/lib/limit";
export async function POST(req: Request) {
 if (limited(req, "co", 10)) return NextResponse.json({ error: "Too many attempts. Wait a minute." }, { status: 429 });
 const parsed = schema.safeParse(await req.json()); if (!parsed.success) return NextResponse.json({ error: "Please check your details." }, { status: 400 });
 const d = parsed.data; const session = await getServerSession(authOptions);
 const products = await db.product.findMany({ where: { id: { in: d.items.map((i) => i.productId) } } });
 let subtotal = 0; const lines: any[] = [];
 for (const i of d.items) { const p = products.find((x) => x.id === i.productId);
  if (!p || p.stock < i.qty) return NextResponse.json({ error: `${p?.name ?? "An item"} is no longer available in that quantity.` }, { status: 409 });
  subtotal += salePrice(p) * i.qty; lines.push({ productId: p.id, name: p.name, price: salePrice(p), qty: i.qty }); }
 let discount = 0;
 if (d.coupon) { const c = await db.coupon.findUnique({ where: { code: d.coupon.toUpperCase() } });
  if (!c || !c.active || (c.expiresAt && c.expiresAt < new Date())) return NextResponse.json({ error: "That coupon is not valid." }, { status: 400 });
  discount = Math.round(subtotal * c.percent / 100); }
 const shipping = subtotal - discount >= 10000000 ? 0 : 250000; const total = subtotal - discount + shipping; const reference = "ZEE-" + randomUUID();
 await db.order.create({ data: { reference, userId: (session?.user as any)?.id, name: d.name, email: d.email, phone: d.phone, address: d.address, city: d.city, subtotal, discount, shipping, total, items: { create: lines } } });
 const res = await fetch("https://api.paystack.co/transaction/initialize", { method: "POST", headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ email: d.email, amount: total, reference, currency: "NGN", callback_url: `${process.env.APP_URL}/order/${reference}` }) });
 const j = await res.json(); if (!j.status) return NextResponse.json({ error: "Could not start payment. Try again." }, { status: 502 });
 return NextResponse.json({ url: j.data.authorization_url });
}
