import NextAuth from "next-auth"; import { getAuthOptions } from "@/lib/auth";
const h = (...args: any[]) => (NextAuth(getAuthOptions()) as (...a: any[]) => any)(...args);
export { h as GET, h as POST };
