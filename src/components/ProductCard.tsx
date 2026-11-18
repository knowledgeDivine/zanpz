import Link from "next/link"; import { naira, salePrice } from "@/lib/format";
export default function ProductCard({ p }: { p: any }) {
 return (<Link href={`/product/${p.slug}`} className="group block">
  <div className="aspect-[4/5] overflow-hidden rounded-md bg-mist"><img src={(p.images as string[])[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
  <div className="mt-3 flex items-baseline justify-between gap-3"><h3 className="font-medium">{p.name}</h3>
   <p className="text-sm">{p.discountPct > 0 && <s className="mr-2 text-ink/40">{naira(p.price)}</s>}<b>{naira(salePrice(p))}</b></p></div>
  {p.stock < 1 && <p className="text-sm text-cobalt">Sold out</p>}</Link>);
}
