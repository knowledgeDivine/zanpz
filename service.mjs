// @ts-check
import nextjs from "@prisma/composer/nextjs";
import { compute } from "@prisma/composer-prisma-cloud";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import { rawHttpContract } from "@prisma/composer/http";
import { z } from "zod";
import { field, secretString } from "@prisma/composer/zod";
import contractJson from "./src/prisma/contract.json" with { type: "json" };

/** The app's data contract, emitted from prisma/schema.prisma by `prisma contract emit`. */
export const data = dataContract(contractJson);

export default compute({
  name: "zee",
  deps: { db: postgres(data) },
  input: z.object({
    // The public origin of the shop, used for Paystack callbacks and SEO URLs.
    appUrl: field(z.string()),
    // Signs next-auth session cookies.
    nextAuthSecret: secretString(),
    // Verifies Paystack webhooks and starts payments.
    paystackSecretKey: secretString(),
    // Calls the Anthropic API for the shopping assistant.
    anthropicApiKey: secretString(),
  }),
  build: nextjs({ module: import.meta.url, appDir: "." }),
  expose: { http: rawHttpContract },
});
