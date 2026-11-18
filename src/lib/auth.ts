import type { NextAuthOptions } from "next-auth"; import Credentials from "next-auth/providers/credentials"; import bcrypt from "bcryptjs"; import { db } from "./db"; import service from "../../service.mjs";
// next-auth needs the session secret at request time, so the options are built
// lazily from the service's input instead of at module scope.
export function getAuthOptions(): NextAuthOptions {
  const input = service.input();
  return {
   secret: input.nextAuthSecret.expose(),
   session: { strategy: "jwt" }, pages: { signIn: "/login" },
   providers: [Credentials({ credentials: { email: {}, password: {} }, async authorize(c) {
    const u = await db.orm.public.User.where({ email: String(c?.email).toLowerCase() }).first();
    if (!u || !(await bcrypt.compare(String(c?.password), u.password))) return null;
    return { id: u.id, email: u.email, name: u.name, role: u.role } as any; } })],
   callbacks: {
    jwt({ token, user }) { if (user) { token.role = (user as any).role; token.uid = user.id; } return token; },
    session({ session, token }) { (session.user as any).role = token.role; (session.user as any).id = token.uid; return session; } } };
}
export const isAdmin = (s: any) => ["ADMIN", "SUPER_ADMIN"].includes(s?.user?.role);
