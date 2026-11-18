// @ts-check
import { module } from "@prisma/composer";
import { envSecret, publicUrl, serviceOrigin } from "@prisma/composer-prisma-cloud";
import { postgres } from "@prisma/composer-prisma-cloud/orm";
import zeeService, { data } from "./service.mjs";

export default module("zanpz", ({ provision }) => {
  const db = provision(postgres({ name: "db", contract: data, config: "./prisma.config.ts" }));
  const web = provision(zeeService, {
    deps: { db },
    input: {
      appUrl: serviceOrigin("zanpz.zee"),
      nextAuthSecret: envSecret("NEXTAUTH_SECRET"), // Signs next-auth session cookies.
      paystackSecretKey: envSecret("PAYSTACK_SECRET_KEY"), // Verifies Paystack webhooks and starts payments.
      anthropicApiKey: envSecret("ANTHROPIC_API_KEY"), // Calls the Anthropic API for the shopping assistant.
    },
  });
  provision(publicUrl({ id: "site", url: publicUrl.prismaBuild(), target: web.http }));
});
