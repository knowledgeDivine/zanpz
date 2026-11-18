import { redirect } from "next/navigation"; import Link from "next/link"; import { getServerSession } from "next-auth"; import { db } from "@/lib/db"; import { authOptions } from "@/lib/auth"; import { naira } from "@/lib/format"; import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
export default async function Account() {
 const uid = ((await getServerSession(authOptions))?.user as any)?.id; if (!uid) redirect("/login");
 const [user, orders, wish] = await Promise.all([db.user.findUnique({ where: { id: uid } }), db.order.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" }, include: { items: true } }), db.wishlistItem.findMany({ where: { userId: uid }, include: { product: true } })]);
 return (<div className="mx-auto max-w-6xl px-5 pt-10"><h1 className="font-display text-3xl font-bold">Hi, {user?.name ?? "there"}</h1>
  <h2 className="mt-8 font-display text-xl font-bold">Orders</h2>
  {orders.length ? <div className="mt-3 divide-y divide-mist rounded-md border border-mist bg-white">{orders.map((o) => <Link key={o.id} href={`/order/${o.reference}`} className="flex justify-between p-3 text-sm hover:bg-wash"><span>{o.createdAt.toLocaleDateString("en-NG")} · {o.items.length} item(s)</span><span>{naira(o.total)} · {o.status}</span></Link>)}</div> : <p className="mt-3 text-sm">No orders yet. <Link href="/shop" className="underline">Start shopping</Link></p>}
  <h2 className="mt-10 font-display text-xl font-bold">Wishlist</h2>
  {wish.length ? <div className="mt-3 grid grid-cols-2 gap-5 md:grid-cols-4">{wish.map((w) => <ProductCard key={w.id} p={w.product} />)}</div> : <p className="mt-3 text-sm">Nothing saved yet.</p>}</div>);
}
