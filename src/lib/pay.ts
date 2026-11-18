import { db } from "./db";
// Marks an order paid exactly once, only if Paystack confirms the full amount.
export async function markPaid(reference: string, paidKobo: number) {
 const o = await db.order.findUnique({ where: { reference }, include: { items: true } });
 if (!o || paidKobo < o.total) return;
 const r = await db.order.updateMany({ where: { id: o.id, status: "PENDING" }, data: { status: "PAID", paidAt: new Date() } });
 if (r.count === 0) return;
 for (const i of o.items) await db.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.qty } } });
}
export async function verifyPaystack(reference: string) {
 const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }, cache: "no-store" });
 const j = await res.json();
 if (j?.data?.status === "success") await markPaid(reference, j.data.amount);
}
