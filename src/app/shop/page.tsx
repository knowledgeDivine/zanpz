import { db } from "@/lib/db"; import ProductCard from "@/components/ProductCard"; import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Shop({ searchParams }: { searchParams: { q?: string; cat?: string; sort?: string } }) {
 const { q, cat, sort } = searchParams;
 const orderBy = sort === "low" ? (p: any) => p.price.asc() : sort === "high" ? (p: any) => p.price.desc() : (p: any) => p.createdAt.desc();
 let filtered = db.orm.public.Product;
 if (q) filtered = filtered.where((p) => p.name.ilike(`%${q}%`));
 if (cat) filtered = filtered.where((p) => p.category.some((c) => c.slug.eq(cat)));
 const [products, cats] = await Promise.all([filtered.orderBy(orderBy).all(), db.orm.public.Category.all()]);
 return (<div className="mx-auto max-w-6xl px-5 pt-10">
  <form className="mb-8 flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Search products" className="input max-w-xs" />
   <select name="cat" defaultValue={cat ?? ""} className="input max-w-[11rem]"><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
   <select name="sort" defaultValue={sort ?? ""} className="input max-w-[11rem]"><option value="">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
   <button className="btn">Apply</button></form>
  {products.length ? <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
   : <p>No products match. <Link href="/shop" className="underline">Clear filters</Link></p>}</div>);
}
