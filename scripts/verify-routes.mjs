#!/usr/bin/env node
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/articles",
  "/lessons",
  "/podcasts",
  "/about",
  "/articles/getting-started-with-ai-learning",
  "/lessons/the-a-r-e-speaking-framework",
  "/podcasts/how-to-learn-with-ai-without-becoming-lazy",
];

let failed = false;

for (const route of routes) {
  const url = new URL(route, baseUrl).toString();
  try {
    const response = await fetch(url, { method: "GET" });
    const ok = response.status >= 200 && response.status < 400;
    console.log(`${ok ? "OK" : "FAIL"} ${response.status} ${url}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL 000 ${url} ${(error && error.message) || error}`);
  }
}

process.exit(failed ? 1 : 0);
