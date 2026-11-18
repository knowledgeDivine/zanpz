import { notFound } from "next/navigation";
const P: Record<string, { t: string; b: string[] }> = {
 about: { t: "About ZEE", b: ["ZEE is a Nigerian online store built around fewer, better products.", "Every order is priced and verified on our servers, and payments go through Paystack."] },
 contact: { t: "Contact us", b: ["Email support@zee.com with your order reference and we'll reply within one business day."] },
 faq: { t: "Frequently asked questions", b: ["How long is delivery? Lagos orders usually arrive in 1 to 3 days, other states in 3 to 7.", "How much is shipping? ₦2,500, and free on orders over ₦100,000.", "Can I cancel an order? Yes, before it ships. Contact support with your reference.", "Is my card safe? Card details go straight to Paystack and never touch our servers."] },
 privacy: { t: "Privacy policy", b: ["We collect your name, email, phone and delivery address to fulfil orders. Passwords are stored hashed. We never sell your data.", "Payments are processed by Paystack. Ask support to delete your account and data at any time."] },
 terms: { t: "Terms and conditions", b: ["By ordering you agree to provide accurate delivery details. Prices are in Nigerian Naira.", "Orders are confirmed once payment is verified. Refunds follow the returns window shown at purchase."] } };
export const generateStaticParams = () => Object.keys(P).map((page) => ({ page }));
export default function Page({ params }: { params: { page: string } }) {
 const c = P[params.page]; if (!c) notFound();
 return <article className="mx-auto max-w-2xl space-y-4 px-5 pt-14"><h1 className="font-display text-4xl font-bold">{c.t}</h1>{c.b.map((x, i) => <p key={i}>{x}</p>)}</article>;
}
