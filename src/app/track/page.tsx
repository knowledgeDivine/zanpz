import { redirect } from "next/navigation";
export default function Track() {
 async function go(f: FormData) { "use server"; redirect(`/order/${String(f.get("ref")).trim()}`); }
 return (<form action={go} className="mx-auto max-w-sm space-y-3 px-5 pt-16"><h1 className="font-display text-3xl font-bold">Track an order</h1><input name="ref" required placeholder="Order reference (starts with ZEE-)" className="input" /><button className="btn w-full">Track</button></form>);
}
