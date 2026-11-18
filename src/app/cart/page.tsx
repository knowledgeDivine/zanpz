"use client";
import Link from "next/link"; import { useEffect, useState } from "react"; import { useCart } from "@/lib/cart"; import { naira } from "@/lib/format";
export default function Cart() {
 const { items, setQty } = useCart(); const [m, setM] = useState(false); useEffect(() => setM(true), []);
 if (!m) return null; const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
 if (!items.length) return <div className="mx-auto max-w-2xl px-5 pt-16"><h1 className="font-display text-3xl font-bold">Your cart is empty</h1><Link href="/shop" className="btn mt-6">Browse the shop</Link></div>;
 return (<div className="mx-auto max-w-3xl px-5 pt-12"><h1 className="mb-8 font-display text-3xl font-bold">Cart</h1>
  {items.map((i) => (<div key={i.id} className="flex items-center gap-4 border-b border-mist py-4"><img src={i.image} alt="" className="h-20 w-16 rounded object-cover" />
   <div className="flex-1"><p className="font-medium">{i.name}</p><p className="text-sm">{naira(i.price)}</p></div>
   <div className="flex items-center gap-3"><button aria-label="Decrease" onClick={() => setQty(i.id, i.qty - 1)}>−</button><span>{i.qty}</span><button aria-label="Increase" onClick={() => setQty(i.id, i.qty + 1)}>+</button></div></div>))}
  <p className="mt-6 text-right text-lg">Subtotal <b>{naira(sub)}</b></p><div className="mt-4 text-right"><Link href="/checkout" className="btn">Checkout</Link></div></div>);
}
