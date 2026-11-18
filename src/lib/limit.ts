const hits = new Map<string, number[]>();
// Simple in-memory limiter (per server instance). Use Redis/Upstash when you deploy several instances.
export function limited(req: Request, key: string, max = 10, windowMs = 60000) {
 const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim(); const k = key + ip; const now = Date.now();
 const arr = (hits.get(k) ?? []).filter((t) => now - t < windowMs); arr.push(now); hits.set(k, arr); return arr.length > max;
}
