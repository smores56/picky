import { Kysely } from "kysely";
import type { Database } from "./types-old";
import { DataApiDialect } from "kysely-data-api";
import { RDSData } from "@aws-sdk/client-rds-data";
import { RDS } from "sst/node/rds";

const dataApi = new DataApiDialect({
  mode: "postgres",
  driver: {
    client: new RDSData({}),
    database: RDS["database"].defaultDatabaseName,
    secretArn: RDS["database"].secretArn,
    resourceArn: RDS["database"].clusterArn
  }
});

export const db = new Kysely<Database>({ dialect: dataApi });
