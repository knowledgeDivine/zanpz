"use client";
import { create } from "zustand"; import { persist } from "zustand/middleware";
export type CartItem = { id: string; slug: string; name: string; price: number; image: string; qty: number };
type S = { items: CartItem[]; add: (i: Omit<CartItem, "qty">) => void; setQty: (id: string, q: number) => void; clear: () => void };
export const useCart = create<S>()(persist((set) => ({ items: [],
 add: (i) => set((s) => s.items.find((x) => x.id === i.id) ? { items: s.items.map((x) => x.id === i.id ? { ...x, qty: x.qty + 1 } : x) } : { items: [...s.items, { ...i, qty: 1 }] }),
 setQty: (id, q) => set((s) => ({ items: q < 1 ? s.items.filter((x) => x.id !== id) : s.items.map((x) => x.id === id ? { ...x, qty: q } : x) })),
 clear: () => set({ items: [] }) }), { name: "zee-cart" }));
