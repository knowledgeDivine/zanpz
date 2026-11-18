import { db } from "./db"; import { and } from "@prisma/orm-postgres/orm-client"; import service from "../../service.mjs";
// Marks an order paid exactly once, only if Paystack confirms the full amount.
export async function markPaid(reference: string, paidKobo: number) {
 const o = await db.orm.public.Order.where({ reference }).include("items").first();
 if (!o || paidKobo < o.total) return;
 const r = await db.orm.public.Order.where((x) => and(x.id.eq(o.id), x.status.eq("PENDING"))).updateAndCount({ status: "PAID", paidAt: new Date() });
 if (r === 0) return;
 for (const i of o.items) {
  const p = await db.orm.public.Product.first({ id: i.productId });
  if (p) await db.orm.public.Product.where({ id: p.id }).update({ stock: Math.max(0, p.stock - i.qty) });
 }
}
export async function verifyPaystack(reference: string) {
 const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${service.input().paystackSecretKey.expose()}` }, cache: "no-store" });
 const j = await res.json();
 if (j?.data?.status === "success") await markPaid(reference, j.data.amount);
}
