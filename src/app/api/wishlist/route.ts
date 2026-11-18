import { NextResponse } from "next/server"; import { getServerSession } from "next-auth"; import { db } from "@/lib/db"; import { authOptions } from "@/lib/auth";
export async function POST(req: Request) {
 const uid = ((await getServerSession(authOptions))?.user as any)?.id; if (!uid) return NextResponse.json({ error: "Sign in to save items." }, { status: 401 });
 const { productId } = await req.json(); const where = { userId_productId: { userId: uid, productId: String(productId) } };
 const had = await db.wishlistItem.findUnique({ where });
 if (had) await db.wishlistItem.delete({ where }); else await db.wishlistItem.create({ data: { userId: uid, productId: String(productId) } });
 return NextResponse.json({ saved: !had });
}
