#!/usr/bin/env node
import { createHash } from "node:crypto";
import { stdin, stdout, stderr } from "node:process";

function hashPasscode(value) {
  return createHash("sha256").update(String(value).trim()).digest("hex");
}

async function readStdin() {
  if (stdin.isTTY) return "";
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const raw = process.argv.slice(2).join(" ") || (await readStdin());
const passcode = raw.trim();

if (!passcode) {
  stderr.write("Usage: pnpm eva:hash-passcode \"member-passcode\"\\n");
  process.exit(1);
}

stdout.write(`${hashPasscode(passcode)}\\n`);
