#!/usr/bin/env node
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const checks = [
  { route: "/", statuses: [200] },
  { route: "/articles", statuses: [200] },
  { route: "/lessons", statuses: [200] },
  { route: "/english-lab", statuses: [200] },
  { route: "/eva-digital-booklet", statuses: [200] },
  { route: "/eva-digital-booklet/studio", statuses: [307, 308], redirect: "manual" },
  { route: "/podcasts", statuses: [200] },
  { route: "/about", statuses: [200] },
  { route: "/articles/getting-started-with-ai-learning", statuses: [200] },
  { route: "/lessons/the-a-r-e-speaking-framework", statuses: [200] },
  { route: "/podcasts/how-to-learn-with-ai-without-becoming-lazy", statuses: [200] },
];

let failed = false;

for (const check of checks) {
  const { route, statuses, redirect = "follow" } = check;
  const url = new URL(route, baseUrl).toString();
  try {
    const response = await fetch(url, { method: "GET", redirect });
    const ok = statuses.includes(response.status);
    console.log(`${ok ? "OK" : "FAIL"} ${response.status} ${url}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL 000 ${url} ${(error && error.message) || error}`);
  }
}

process.exit(failed ? 1 : 0);
