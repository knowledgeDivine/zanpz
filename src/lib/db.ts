import service from "../../service.mjs";
import type { Contract } from "../prisma/contract";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";

type Db = PostgresClient<Contract>;

let cached: Db | undefined;

function client(): Db {
  if (!cached) cached = (service.load() as unknown as { db: { client: Db } }).db.client;
  return cached;
}

// The Prisma ORM 8 client, from the service's database dependency. load() is
// deferred to the first query so module imports stay safe at build time.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const c = client() as unknown as Record<string | symbol, unknown>;
    const v = c[prop];
    return typeof v === "function" ? (v as (...a: unknown[]) => unknown).bind(c) : v;
  },
}) as Db;
