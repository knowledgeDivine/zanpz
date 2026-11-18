import { notFound } from "next/navigation"; import { db } from "@/lib/db"; import { naira, salePrice } from "@/lib/format"; import ProductCard from "@/components/ProductCard"; import AddToCart from "@/components/AddToCart"; import WishlistButton from "@/components/WishlistButton"; import ReviewForm from "@/components/ReviewForm"; import { getServerSession } from "next-auth"; import { getAuthOptions } from "@/lib/auth"; import { and } from "@prisma/orm-postgres/orm-client";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: any) { const p = await db.orm.public.Product.where({ slug: params.slug }).first(); return { title: p?.name ?? "Product", description: p?.description.slice(0, 150) }; }
export default async function Product({ params }: { params: { slug: string } }) {
 const p = await db.orm.public.Product.where({ slug: params.slug }).include("reviews").first(); if (!p) notFound();
 const uid = ((await getServerSession(getAuthOptions()))?.user as any)?.id; const saved = uid ? !!(await db.orm.public.WishlistItem.where((w) => and(w.userId.eq(uid), w.productId.eq(p.id))).first()) : false; const related = await db.orm.public.Product.where((r) => and(r.categoryId.eq(p.categoryId), r.id.neq(p.id))).limit(4).all();
 const img = (p.images as string[])[0]; const avg = p.reviews.length ? (p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length).toFixed(1) : null;
 return (<div className="mx-auto grid max-w-6xl gap-10 px-5 pt-10 md:grid-cols-2">
  <img src={img} alt={p.name} className="aspect-[4/5] w-full rounded-md object-cover" />
  <div className="self-center"><h1 className="font-display text-4xl font-bold">{p.name}</h1>
   <p className="mt-3 text-2xl">{p.discountPct > 0 && <s className="mr-3 text-ink/40">{naira(p.price)}</s>}{naira(salePrice(p))}</p>
   {avg && <p className="mt-2 text-sm">{avg} / 5 from {p.reviews.length} reviews</p>}
   <p className="mt-6 max-w-prose">{p.description}</p><p className="mt-4 text-sm">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</p>
   <div className="mt-6 max-w-xs"><AddToCart p={{ id: p.id, slug: p.slug, name: p.name, price: salePrice(p), image: img, stock: p.stock }} /><WishlistButton productId={p.id} saved={saved} /></div></div>
  <div className="md:col-span-2"><h2 className="font-display text-xl font-bold">Reviews</h2>{p.reviews.length ? p.reviews.map((r) => <p key={r.id} className="mt-2 text-sm">{"★".repeat(r.rating)} {r.body}</p>) : <p className="mt-2 text-sm">No reviews yet.</p>}{uid && <ReviewForm productId={p.id} />}
   {related.length > 0 && <><h2 className="mt-12 font-display text-xl font-bold">You may also like</h2><div className="mt-4 grid grid-cols-2 gap-5 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></>}</div></div>);
}
