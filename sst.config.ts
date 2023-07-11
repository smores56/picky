import type { SSTConfig } from "sst";
import { SvelteKitSite, RDS } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "picky",
      region: "us-west-1"
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new SvelteKitSite(stack, "site");
      const database = new RDS(stack, "database", {
        engine: "postgresql13.9",
        defaultDatabaseName: "picky",
        migrations: "src/lib/server/db/migrations/",
        types: {
          path: "src/lib/server/db/types.ts",
          camelCase: true
        }
      });

      stack.addOutputs({
        url: site.url,
      });
    });
  }
} satisfies SSTConfig;
