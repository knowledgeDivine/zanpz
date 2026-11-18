import { NextResponse } from "next/server"; import { z } from "zod"; import { getServerSession } from "next-auth"; import { db } from "@/lib/db"; import { getAuthOptions } from "@/lib/auth"; import { and } from "@prisma/orm-postgres/orm-client";
export async function POST(req: Request) {
 const sessionUser = (await getServerSession(getAuthOptions()))?.user as { id?: string } | undefined; const uid = sessionUser?.id; if (!uid) return NextResponse.json({ error: "Sign in to review." }, { status: 401 });
 const p = z.object({ productId: z.string(), rating: z.number().int().min(1).max(5), body: z.string().min(3).max(1000) }).safeParse(await req.json()); if (!p.success) return NextResponse.json({ error: "Add a rating and a short comment." }, { status: 400 });
 const mine = await db.orm.public.Order
  .where((o) => and(o.userId.eq(uid), o.status.in(["PAID", "SHIPPED", "DELIVERED"])))
  .include("items", (items) => items.where((i) => i.productId.eq(p.data.productId)).limit(1))
  .all();
 if (!mine.some((o) => o.items.length > 0)) return NextResponse.json({ error: "Only customers who bought this product can review it." }, { status: 403 });
 const existing = await db.orm.public.Review.where((r) => and(r.userId.eq(uid), r.productId.eq(p.data.productId))).first();
 if (existing) await db.orm.public.Review.where({ id: existing.id }).update({ rating: p.data.rating, body: p.data.body });
 else await db.orm.public.Review.create({ userId: uid, productId: p.data.productId, rating: p.data.rating, body: p.data.body });
 return NextResponse.json({ ok: true });
}
