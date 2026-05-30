#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

if (!title) {
  console.error('Usage: pnpm new:article "Title"');
  process.exit(1);
}

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const dir = path.join(process.cwd(), "content", "articles");
const filePath = path.join(dir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`Refusing to overwrite existing article: ${filePath}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  filePath,
  `---
title: "${title.replaceAll('"', '\\"')}"
description: "Add a clear one-sentence description."
date: "${date}"
updated: "${date}"
tags:
  - Learning
category: "Study Systems"
published: false
featured: false
---

## Core idea

Write the practical learning problem this article solves.

## Framework

- Step one
- Step two
- Step three

## Practice

Give the reader one useful next action.
`,
);

console.log(`Created ${filePath}`);
console.log("Next: edit the body, update tags/category, then set published: true when ready.");
