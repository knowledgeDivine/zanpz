"use client";
import { signIn } from "next-auth/react"; import { useState } from "react";
export default function Register() { const [err, setErr] = useState("");
 async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as any;
  const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); const j = await r.json();
  if (!r.ok) return setErr(j.error); await signIn("credentials", { email: f.email, password: f.password, callbackUrl: "/" }); }
 return (<form onSubmit={go} className="mx-auto max-w-sm space-y-3 px-5 pt-16"><h1 className="font-display text-3xl font-bold">Create account</h1>
  <input name="name" required placeholder="Full name" className="input" /><input name="email" type="email" required placeholder="Email" className="input" /><input name="password" type="password" minLength={8} required placeholder="Password (8+ characters)" className="input" />
  {err && <p role="alert" className="text-sm text-red-600">{err}</p>}<button className="btn w-full">Create account</button></form>); }
