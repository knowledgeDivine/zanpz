import { db } from "@/lib/db"; import ProductCard from "@/components/ProductCard"; import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Shop({ searchParams }: { searchParams: { q?: string; cat?: string; sort?: string } }) {
 const { q, cat, sort } = searchParams;
 const orderBy: any = sort === "low" ? { price: "asc" } : sort === "high" ? { price: "desc" } : { createdAt: "desc" };
 const [products, cats] = await Promise.all([db.product.findMany({ where: { ...(q ? { name: { contains: q } } : {}), ...(cat ? { category: { slug: cat } } : {}) }, orderBy }), db.category.findMany()]);
 return (<div className="mx-auto max-w-6xl px-5 pt-10">
  <form className="mb-8 flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Search products" className="input max-w-xs" />
   <select name="cat" defaultValue={cat ?? ""} className="input max-w-[11rem]"><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
   <select name="sort" defaultValue={sort ?? ""} className="input max-w-[11rem]"><option value="">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
   <button className="btn">Apply</button></form>
  {products.length ? <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
   : <p>No products match. <Link href="/shop" className="underline">Clear filters</Link></p>}</div>);
}
