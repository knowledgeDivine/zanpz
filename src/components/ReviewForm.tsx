"use client";
import { useState } from "react";
export default function ReviewForm({ productId }: { productId: string }) {
 const [msg, setMsg] = useState("");
 async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget);
  const r = await fetch("/api/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, rating: Number(f.get("rating")), body: f.get("body") }) }); const j = await r.json(); setMsg(r.ok ? "Review saved. Refresh to see it." : j.error); }
 return (<form onSubmit={go} className="mt-10 max-w-md space-y-2"><h2 className="font-display text-xl font-bold">Review this product</h2>
  <select name="rating" className="input" defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select><textarea name="body" required minLength={3} className="input" placeholder="What did you think?" />
  <button className="btn">Post review</button>{msg && <p role="status" className="text-sm">{msg}</p>}</form>);
}
