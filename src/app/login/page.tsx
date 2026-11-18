"use client";
import { signIn } from "next-auth/react"; import { useState } from "react"; import Link from "next/link";
export default function Login() { const [err, setErr] = useState("");
 async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget);
  const r = await signIn("credentials", { email: f.get("email"), password: f.get("password"), redirect: false }); if (r?.error) setErr("Email or password is incorrect."); else window.location.href = "/"; }
 return (<form onSubmit={go} className="mx-auto max-w-sm space-y-3 px-5 pt-16"><h1 className="font-display text-3xl font-bold">Sign in</h1>
  <input name="email" type="email" required placeholder="Email" className="input" /><input name="password" type="password" required placeholder="Password" className="input" />
  {err && <p role="alert" className="text-sm text-red-600">{err}</p>}<button className="btn w-full">Sign in</button><p className="text-sm">New here? <Link href="/register" className="underline">Create an account</Link></p></form>); }
