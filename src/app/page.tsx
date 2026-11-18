import Link from "next/link"; import { db } from "@/lib/db"; import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
export default async function Home() {
 const [featured, cats] = await Promise.all([db.product.findMany({ where: { featured: true }, take: 8, orderBy: { createdAt: "desc" } }), db.category.findMany()]);
 return (<>
  <section className="mx-auto max-w-6xl overflow-hidden px-5 pt-16">
   <h1 className="rise font-display text-[34vw] font-extrabold leading-[0.8] tracking-tighter text-cobalt md:text-[22rem]">ZEE</h1>
   <div className="mt-8 flex flex-wrap items-end justify-between gap-6"><p className="max-w-md text-lg">Considered products from sneakers to sound, shipped across Nigeria and paid for securely.</p>
    <Link href="/shop" className="btn">Shop everything</Link></div></section>
  <section className="mx-auto mt-20 flex max-w-6xl flex-wrap gap-3 px-5">{cats.map((c) => <Link key={c.id} href={`/shop?cat=${c.slug}`} className="rounded-full border border-ink px-5 py-2 text-sm font-medium hover:bg-ink hover:text-white">{c.name}</Link>)}</section>
  <section className="mx-auto mt-10 max-w-6xl px-5"><h2 className="mb-6 font-display text-3xl font-bold">Featured</h2>
   {featured.length ? <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p>No products yet. Add some in the admin dashboard.</p>}</section></>);
}
