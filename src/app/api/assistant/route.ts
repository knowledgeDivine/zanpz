import { NextResponse } from "next/server"; import { db } from "@/lib/db"; import { naira, salePrice } from "@/lib/format"; import { limited } from "@/lib/limit"; import service from "../../../../service.mjs";
export async function POST(req: Request) {
 if (limited(req, "ai", 8)) return NextResponse.json({ reply: "You're sending messages quickly. Try again in a minute." }, { status: 429 });
 const { message } = await req.json(); if (typeof message !== "string" || !message.trim()) return NextResponse.json({ reply: "Ask me about any product." });
 const ps = await db.orm.public.Product.where((p) => p.stock.gt(0)).include("category").limit(60).all();
 const catalog = ps.map((p) => `${p.name} | ${p.category.name} | ${naira(salePrice(p))} | /product/${p.slug}`).join("\n");
 const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": service.input().anthropicApiKey.expose(), "anthropic-version": "2023-06-01", "content-type": "application/json" },
  body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 400, system: `You are ZEE's shopping assistant. Recommend only products from this in-stock catalog (name | category | price | link). Respect budgets, compare when asked, and keep replies under 120 words. If nothing fits, say so.\n${catalog}`, messages: [{ role: "user", content: message.slice(0, 500) }] }) });
 const j = await r.json(); return NextResponse.json({ reply: j?.content?.[0]?.text ?? "The assistant is unavailable right now." });
}
