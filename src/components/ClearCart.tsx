"use client";
import { useEffect } from "react"; import { useCart } from "@/lib/cart";
export default function ClearCart() { const c = useCart((s) => s.clear); useEffect(() => c(), [c]); return null; }
