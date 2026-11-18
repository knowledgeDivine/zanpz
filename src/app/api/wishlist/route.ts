import { NextResponse } from "next/server"; import { getServerSession } from "next-auth"; import { db } from "@/lib/db"; import { getAuthOptions } from "@/lib/auth"; import { and } from "@prisma/orm-postgres/orm-client";
export async function POST(req: Request) {
 const uid = ((await getServerSession(getAuthOptions()))?.user as any)?.id; if (!uid) return NextResponse.json({ error: "Sign in to save items." }, { status: 401 });
 const { productId } = await req.json(); const pid = String(productId);
 const had = await db.orm.public.WishlistItem.where((w) => and(w.userId.eq(uid), w.productId.eq(pid))).first();
 if (had) await db.orm.public.WishlistItem.where({ id: had.id }).delete(); else await db.orm.public.WishlistItem.create({ userId: uid, productId: pid });
 return NextResponse.json({ saved: !had });
}
