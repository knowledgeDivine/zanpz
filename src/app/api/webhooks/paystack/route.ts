import { createHmac, timingSafeEqual } from "crypto"; import { markPaid } from "@/lib/pay"; import service from "../../../../../service.mjs";
export async function POST(req: Request) {
 const raw = await req.text(); const sig = req.headers.get("x-paystack-signature") ?? "";
 const hash = createHmac("sha512", service.input().paystackSecretKey.expose()).update(raw).digest("hex");
 if (sig.length !== hash.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(hash))) return new Response("Invalid signature", { status: 401 });
 const e = JSON.parse(raw); if (e.event === "charge.success") await markPaid(e.data.reference, e.data.amount);
 return new Response("ok");
}
