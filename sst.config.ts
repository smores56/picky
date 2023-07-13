import type { SSTConfig } from "sst";
import { SvelteKitSite, RDS } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "picky",
      region: "us-west-2"
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const database = new RDS(stack, "database", {
        engine: "postgresql13.9",
        defaultDatabaseName: "picky",
        migrations: "src/lib/server/db/migrations/",
        types: {
          path: "src/lib/server/db/types.ts",
          camelCase: true
        }
      });
      const site = new SvelteKitSite(stack, "site", {
        bind: [database]
      });

      stack.addOutputs({
        url: site.url,
      });
    });
  }
} satisfies SSTConfig;
