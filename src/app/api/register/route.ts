import { NextResponse } from "next/server"; import { z } from "zod"; import bcrypt from "bcryptjs"; import { db } from "@/lib/db";
import { limited } from "@/lib/limit";
export async function POST(req: Request) {
 if (limited(req, "reg", 5)) return NextResponse.json({ error: "Too many attempts. Wait a minute." }, { status: 429 });
 const p = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) }).safeParse(await req.json());
 if (!p.success) return NextResponse.json({ error: "Use a valid email and a password of 8+ characters." }, { status: 400 });
 const email = p.data.email.toLowerCase(); if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "That email is already registered." }, { status: 409 });
 await db.user.create({ data: { email, name: p.data.name, password: await bcrypt.hash(p.data.password, 12) } }); return NextResponse.json({ ok: true });
}
