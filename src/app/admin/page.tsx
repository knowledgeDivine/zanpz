import { redirect } from "next/navigation"; import { getServerSession } from "next-auth"; import { db } from "@/lib/db"; import { getAuthOptions, isAdmin } from "@/lib/auth"; import { naira } from "@/lib/format"; import { createProduct, deleteProduct, setStatus } from "./actions";
export const dynamic = "force-dynamic";
export default async function Admin() {
 if (!isAdmin(await getServerSession(getAuthOptions()))) redirect("/login");
 const [rev, orders, customers, products, recent] = await Promise.all([db.orm.public.Order.where((o) => o.status.neq("PENDING")).aggregate((a) => ({ total: a.sum("total") })), db.orm.public.Order.aggregate((a) => ({ total: a.count() })), db.orm.public.User.where({ role: "CUSTOMER" }).aggregate((a) => ({ total: a.count() })), db.orm.public.Product.orderBy((p) => p.createdAt.desc()).limit(20).all(), db.orm.public.Order.orderBy((o) => o.createdAt.desc()).limit(10).all()]);
 const stats = [["Revenue", naira(rev.total ?? 0)], ["Orders", orders.total], ["Customers", customers.total], ["Products", products.length]];
 return (<div className="mx-auto max-w-6xl px-5 pt-10"><h1 className="font-display text-3xl font-bold">Dashboard</h1>
  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{stats.map(([k, v]) => <div key={k as string} className="rounded-md border border-mist bg-white p-4"><p className="text-sm text-ink/60">{k}</p><p className="font-display text-2xl font-bold">{v}</p></div>)}</div>
  <h2 className="mt-10 font-display text-xl font-bold">Add product</h2>
  <form action={createProduct} className="mt-3 grid gap-3 md:grid-cols-3"><input name="name" required placeholder="Name" className="input" /><input name="category" required placeholder="Category" className="input" /><input name="image" required type="url" placeholder="Image URL" className="input" />
   <input name="price" required type="number" min="1" placeholder="Price (₦)" className="input" /><input name="discountPct" type="number" min="0" max="90" placeholder="Discount %" className="input" /><input name="stock" required type="number" min="0" placeholder="Stock" className="input" />
   <textarea name="description" required placeholder="Description" className="input md:col-span-2" /><label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" />Feature on homepage</label><button className="btn md:col-span-3">Save product</button></form>
  <h2 className="mt-10 font-display text-xl font-bold">Orders</h2>
  <div className="mt-3 divide-y divide-mist rounded-md border border-mist bg-white">{recent.map((o) => <form key={o.id} action={setStatus} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm"><input type="hidden" name="id" value={o.id} /><span>{o.name} · {naira(o.total)}</span>
   <span className="flex gap-2"><select name="status" defaultValue={o.status} className="input w-auto">{["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => <option key={s}>{s}</option>)}</select><button className="btn !py-2">Update</button></span></form>)}</div>
  <h2 className="mt-10 font-display text-xl font-bold">Products</h2>
  <div className="mt-3 divide-y divide-mist rounded-md border border-mist bg-white">{products.map((p) => <form key={p.id} action={deleteProduct} className="flex items-center justify-between p-3 text-sm"><input type="hidden" name="id" value={p.id} /><span>{p.name} · {naira(p.price)} · {p.stock} in stock</span><button className="text-red-600 underline">Delete</button></form>)}</div></div>);
}
