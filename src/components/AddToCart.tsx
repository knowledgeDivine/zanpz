"use client";
import { useState } from "react"; import { useCart } from "@/lib/cart";
export default function AddToCart({ p }: { p: { id: string; slug: string; name: string; price: number; image: string; stock: number } }) {
 const add = useCart((s) => s.add); const [done, setDone] = useState(false);
 return <button className="btn w-full" disabled={p.stock < 1} onClick={() => { add(p); setDone(true); setTimeout(() => setDone(false), 1500); }}>{p.stock < 1 ? "Sold out" : done ? "Added to cart" : "Add to cart"}</button>;
}
