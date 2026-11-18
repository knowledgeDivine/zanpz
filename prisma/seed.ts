import { PrismaClient } from "@prisma/client"; import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main() {
 await db.user.upsert({ where:{email:process.env.SEED_ADMIN_EMAIL!}, update:{}, create:{ email:process.env.SEED_ADMIN_EMAIL!, name:"Super Admin", role:"SUPER_ADMIN", password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD!,12) }});
 await db.coupon.upsert({ where:{code:"WELCOME10"}, update:{}, create:{code:"WELCOME10", percent:10}});
 const cats = ["Sneakers","Bags","Watches","Audio"];
 for (const [i,n] of cats.entries()) {
  const slug = n.toLowerCase();
  const c = await db.category.upsert({ where:{slug}, update:{}, create:{name:n, slug}});
  for (let j=1;j<=2;j++) { const ps = `${slug}-${j}`;
   await db.product.upsert({ where:{slug:ps}, update:{}, create:{ slug:ps, name:`ZEE ${n.slice(0,-1)} ${j}`, description:`A demo ${n.toLowerCase()} product. Replace it from the admin dashboard.`, price:(15000+i*12000+j*5000)*100, discountPct: j===2?15:0, stock:25, featured:true, categoryId:c.id, images:[`https://picsum.photos/seed/${ps}/800/1000`] }}); }
 }
}
main().finally(()=>db.$disconnect());
