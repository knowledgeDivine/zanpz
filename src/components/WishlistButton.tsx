"use client";
import { useState } from "react";
export default function WishlistButton({ productId, saved }: { productId: string; saved: boolean }) {
 const [on, setOn] = useState(saved); const [err, setErr] = useState("");
 async function t() { const r = await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) }); const j = await r.json(); if (!r.ok) return setErr(j.error); setOn(j.saved); setErr(""); }
 return <div><button onClick={t} className="mt-3 text-sm underline" aria-pressed={on}>{on ? "Saved to wishlist" : "Save to wishlist"}</button>{err && <p className="text-sm text-red-600">{err}</p>}</div>;
}
