import "./globals.css"; import type { Metadata } from "next"; import Link from "next/link";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google"; import { getServerSession } from "next-auth";
import { getAuthOptions, isAdmin } from "@/lib/auth"; import CartCount from "@/components/CartCount"; import Assistant from "@/components/Assistant";
const d = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const b = Public_Sans({ subsets: ["latin"], variable: "--f-body" });
export const metadata: Metadata = { title: { default: "ZEE", template: "%s | ZEE" }, description: "Quality products, delivered across Nigeria." };
export const dynamic = "force-dynamic";
export default async function Root({ children }: { children: React.ReactNode }) {
 const s = await getServerSession(getAuthOptions());
 return (<html lang="en" className={`${d.variable} ${b.variable}`}><body>
  <header className="sticky top-0 z-10 border-b border-mist bg-wash/90 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
   <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">ZEE</Link>
   <div className="flex items-center gap-6 text-sm font-medium">
    <Link href="/shop">Shop</Link>{isAdmin(s) && <Link href="/admin">Admin</Link>}
    {s && <Link href="/account">Account</Link>}{s ? <Link href="/api/auth/signout">Sign out</Link> : <Link href="/login">Sign in</Link>}
    <CartCount /></div></nav></header>
  <main>{children}</main><Assistant />
  <footer className="mt-24 border-t border-mist px-5 py-10 text-center text-sm text-ink/60">© {new Date().getFullYear()} ZEE. Secure checkout by Paystack. <span className="ml-3 space-x-3"><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/track">Track order</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></footer>
 </body></html>);
}
