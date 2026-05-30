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
  console.error('Usage: pnpm new:lesson "Title"');
  process.exit(1);
}

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const dir = path.join(process.cwd(), "content", "lessons");
const filePath = path.join(dir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`Refusing to overwrite existing lesson: ${filePath}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  filePath,
  `---
title: "${title.replaceAll('"', '\\"')}"
description: "Add a clear one-sentence lesson description."
faTitle: "عنوان فارسی درس را وارد کنید"
faDescription: "توضیح کوتاه فارسی درس را وارد کنید."
date: "${date}"
updated: "${date}"
level: "A2-B2"
faLevel: "A2 تا B2"
skill: "Study Skills"
faSkill: "مهارت مطالعه"
tags:
  - Learning
published: false
featured: false
faContent: |
  ## هدف

  زبان آموز بعد از این درس باید چه کاری بتواند انجام دهد؟

  ## مدل

  یک نمونه قوی نشان دهید.

  ## تمرین

  یک تمرین متمرکز بدهید.

  ## تمرکز بازخورد

  مهم ترین نکته برای بررسی را نام ببرید.
---

## Target

What should the learner be able to do after this lesson?

## Model

Show one strong example.

## Practice

Give one focused practice task.

## Feedback focus

Name the most important thing to check.
`,
);

console.log(`Created ${filePath}`);
console.log("Next: edit the lesson, then set published: true when ready.");
