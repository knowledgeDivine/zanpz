"use client";
import { useState } from "react";
export default function Assistant() {
 const [open, setOpen] = useState(false); const [msgs, setMsgs] = useState<{ r: string; t: string }[]>([{ r: "ai", t: "Tell me what you need and your budget. I'll find it." }]); const [busy, setBusy] = useState(false);
 async function send(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const el = e.currentTarget; const t = String(new FormData(el).get("m")).trim(); if (!t) return; el.reset(); setMsgs((m) => [...m, { r: "me", t }]); setBusy(true);
  const r = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: t }) }); const j = await r.json(); setMsgs((m) => [...m, { r: "ai", t: j.reply }]); setBusy(false); }
 return (<div className="fixed bottom-5 right-5 z-20">
  {open && <div className="mb-3 flex h-96 w-80 flex-col rounded-lg border border-mist bg-white shadow-xl"><div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">{msgs.map((m, i) => <p key={i} className={m.r === "me" ? "ml-8 rounded-md bg-ink p-2 text-white" : "mr-8 whitespace-pre-wrap rounded-md bg-wash p-2"}>{m.t}</p>)}{busy && <p className="text-ink/50">Thinking</p>}</div>
   <form onSubmit={send} className="flex gap-2 border-t border-mist p-2"><input name="m" className="input" placeholder="Ask about products" aria-label="Message" /><button className="btn !px-3" disabled={busy}>Send</button></form></div>}
  <button className="btn rounded-full" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Close" : "Ask ZEE"}</button></div>);
}
