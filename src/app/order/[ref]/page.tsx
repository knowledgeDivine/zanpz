import { notFound } from "next/navigation"; import { db } from "@/lib/db"; import { verifyPaystack } from "@/lib/pay"; import { naira } from "@/lib/format"; import ClearCart from "@/components/ClearCart";
export const dynamic = "force-dynamic";
export default async function OrderPage({ params }: { params: { ref: string } }) {
 let o = await db.orm.public.Order.where({ reference: params.ref }).include("items").first(); if (!o) notFound();
 if (o.status === "PENDING") { await verifyPaystack(o.reference); o = await db.orm.public.Order.where({ reference: params.ref }).include("items").first() ?? o; }
 const paid = o!.status !== "PENDING";
 return (<div className="mx-auto max-w-xl px-5 pt-16">{paid && <ClearCart />}
  <h1 className="font-display text-3xl font-bold">{paid ? "Payment confirmed" : "Payment not confirmed yet"}</h1>
  <p className="mt-2">{paid ? "We are preparing your order." : "If you were charged, this page updates once Paystack confirms. Refresh in a minute."}</p>
  <ul className="mt-6 divide-y divide-mist">{o!.items.map((i) => <li key={i.id} className="flex justify-between py-2"><span>{i.name} × {i.qty}</span><span>{naira(i.price * i.qty)}</span></li>)}</ul>
  <p className="mt-4 text-right">Total <b>{naira(o!.total)}</b> · {o!.status}</p></div>);
}
