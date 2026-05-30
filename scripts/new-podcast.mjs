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

function nextEpisodeNumber(dir) {
  if (!fs.existsSync(dir)) return 1;
  const episodes = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => fs.readFileSync(path.join(dir, file), "utf8").match(/^episode:\s*(\d+)/m)?.[1])
    .filter(Boolean)
    .map(Number);
  return episodes.length === 0 ? 1 : Math.max(...episodes) + 1;
}

if (!title) {
  console.error('Usage: pnpm new:podcast "Title"');
  process.exit(1);
}

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const dir = path.join(process.cwd(), "content", "podcasts");
const filePath = path.join(dir, `${slug}.mdx`);
const episode = nextEpisodeNumber(dir);

if (fs.existsSync(filePath)) {
  console.error(`Refusing to overwrite existing podcast: ${filePath}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  filePath,
  `---
title: "${title.replaceAll('"', '\\"')}"
description: "Add a clear one-sentence episode description."
date: "${date}"
updated: "${date}"
episode: ${episode}
season: 1
audioSrc: "/audio/${slug}.mp3"
duration: "00:00"
language: "English"
transcript: true
tags:
  - Learning
published: false
featured: false
---

## Episode summary

Summarize the audio lesson.

## Main ideas

- Idea one
- Idea two
- Idea three

## Study prompt

Give the listener one useful next action.
`,
);

console.log(`Created ${filePath}`);
console.log(`Next: place audio at public/audio/${slug}.mp3, update duration, then set published: true when ready.`);
