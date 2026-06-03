#!/usr/bin/env node
import { createHash } from "node:crypto";
import process from "node:process";
import postgres from "postgres";

const [userId, ...passcodeParts] = process.argv.slice(2);
const passcode = passcodeParts.join(" ").trim();
const databaseUrl = process.env.EVA_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing EVA_DATABASE_URL or DATABASE_URL.");
  process.exit(1);
}

if (!userId || !passcode) {
  console.error("Usage: pnpm eva:set-passcode <ali|eva|elham> \"member-passcode\"");
  process.exit(1);
}

const allowed = new Set(["ali", "eva", "elham"]);
if (!allowed.has(userId)) {
  console.error("Unknown member id. Use ali, eva, or elham.");
  process.exit(1);
}

const passcodeHash = createHash("sha256").update(passcode).digest("hex");
const sql = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
  prepare: false,
});

try {
  const updated = await sql`
    update eva_memberships
    set passcode_hash = ${passcodeHash}, updated_at = now()
    where user_id = ${userId} and product_id = 'eva-digital-booklet'
    returning user_id
  `;

  if (!updated.length) {
    console.error("No membership row found. Run pnpm eva:migrate first.");
    process.exitCode = 1;
  } else {
    console.log(`Passcode hash saved for ${userId}.`);
  }
} finally {
  await sql.end({ timeout: 5 });
}
