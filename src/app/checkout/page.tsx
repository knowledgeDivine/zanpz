"use client";
import { useState } from "react"; import { useCart } from "@/lib/cart"; import { naira } from "@/lib/format";
export default function Checkout() {
 const items = useCart((s) => s.items); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
 async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setErr("");
  const f = Object.fromEntries(new FormData(e.currentTarget)) as any;
  const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, coupon: f.coupon || undefined, items: items.map((i) => ({ productId: i.id, qty: i.qty })) }) });
  const j = await r.json(); if (!r.ok) { setErr(j.error ?? "Checkout failed"); setBusy(false); return; } window.location.href = j.url; }
 if (!items.length) return <p className="px-5 pt-16 text-center">Your cart is empty.</p>;
 return (<form onSubmit={submit} className="mx-auto max-w-lg space-y-3 px-5 pt-12"><h1 className="mb-4 font-display text-3xl font-bold">Checkout</h1>
  {["name", "email", "phone", "address", "city", "coupon"].map((n) => <input key={n} name={n} required={n !== "coupon"} placeholder={n === "coupon" ? "Coupon code (optional)" : n[0].toUpperCase() + n.slice(1)} type={n === "email" ? "email" : "text"} className="input" />)}
  <p className="text-sm">Subtotal {naira(items.reduce((a, i) => a + i.price * i.qty, 0))}. Shipping and discounts are calculated securely at payment.</p>
  {err && <p role="alert" className="text-sm text-red-600">{err}</p>}<button className="btn w-full" disabled={busy}>{busy ? "Redirecting to Paystack" : "Pay with Paystack"}</button></form>);
}
