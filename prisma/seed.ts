import postgres from "@prisma/orm-postgres/runtime"; import { contractFromJson } from "@prisma/orm-postgres/static"; import bcrypt from "bcryptjs";
import type { Contract } from "../src/prisma/contract"; import contractJson from "../src/prisma/contract.json";
const db = postgres({ contract: contractFromJson<Contract>(contractJson), url: process.env.DATABASE_URL! });
async function main() {
 const email = process.env.SEED_ADMIN_EMAIL!;
 if (!(await db.orm.public.User.where({ email }).first())) await db.orm.public.User.create({ email, name: "Super Admin", role: "SUPER_ADMIN", password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD!, 12) });
 if (!(await db.orm.public.Coupon.where({ code: "WELCOME10" }).first())) await db.orm.public.Coupon.create({ code: "WELCOME10", percent: 10 });
 const cats = ["Sneakers","Bags","Watches","Audio"];
 for (const [i,n] of cats.entries()) {
  const slug = n.toLowerCase();
  let c = await db.orm.public.Category.where({ slug }).first();
  if (!c) c = await db.orm.public.Category.create({ name: n, slug });
  for (let j=1;j<=2;j++) { const ps = `${slug}-${j}`;
   if (await db.orm.public.Product.where({ slug: ps }).first()) continue;
   await db.orm.public.Product.create({ slug:ps, name:`ZEE ${n.slice(0,-1)} ${j}`, description:`A demo ${n.toLowerCase()} product. Replace it from the admin dashboard.`, price:(15000+i*12000+j*5000)*100, discountPct: j===2?15:0, stock:25, featured:true, categoryId:c.id, images:[`https://picsum.photos/seed/${ps}/800/1000`] }); }
 }
}
main().finally(() => db.close());
