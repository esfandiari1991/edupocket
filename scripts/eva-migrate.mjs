#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import postgres from "postgres";

const databaseUrl = process.env.EVA_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing EVA_DATABASE_URL or DATABASE_URL.");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
  prepare: false,
});

try {
  const migrationPath = path.join(process.cwd(), "db", "0001_eva_portal.sql");
  const migration = await fs.readFile(migrationPath, "utf8");
  await sql.unsafe(migration);
  console.log("Eva portal migration applied.");
} finally {
  await sql.end({ timeout: 5 });
}
