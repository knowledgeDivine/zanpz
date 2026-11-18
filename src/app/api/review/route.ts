import { NextResponse } from "next/server"; import { z } from "zod"; import { getServerSession } from "next-auth"; import { db } from "@/lib/db"; import { authOptions } from "@/lib/auth";
export async function POST(req: Request) {
 const uid = ((await getServerSession(authOptions))?.user as any)?.id; if (!uid) return NextResponse.json({ error: "Sign in to review." }, { status: 401 });
 const p = z.object({ productId: z.string(), rating: z.number().int().min(1).max(5), body: z.string().min(3).max(1000) }).safeParse(await req.json()); if (!p.success) return NextResponse.json({ error: "Add a rating and a short comment." }, { status: 400 });
 const bought = await db.orderItem.findFirst({ where: { productId: p.data.productId, order: { userId: uid, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } } } });
 if (!bought) return NextResponse.json({ error: "Only customers who bought this product can review it." }, { status: 403 });
 await db.review.upsert({ where: { userId_productId: { userId: uid, productId: p.data.productId } }, update: { rating: p.data.rating, body: p.data.body }, create: { ...p.data, userId: uid } });
 return NextResponse.json({ ok: true });
}
