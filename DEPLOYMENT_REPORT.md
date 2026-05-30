# EduPocket Deployment Report

## Status

Production build complete, committed, pushed to GitHub, deployed to Vercel, and verified live.

## Local path

`/Users/ali/Documents/OpenAI/Projects/EduPocket`

## Legacy workspace migration

Previous local prototype/workspace was found at /Users/ali/Documents/Claude/Projects/eduPocket.org and was safely migrated to /Users/ali/Documents/OpenAI/Projects/EduPocket.

## Scope

- Fresh Next.js production build.
- Bilingual Persian/English experience with an animated language slider.
- Founder photo treatment using Ali Rad's supplied images.
- Vercel production deployment first.
- External DNS/hosting providers are out of scope for this pass.
- Previous static prototype preserved under `legacy-static/`.

## Environment

- Date/time: 2026-05-30 17:16:12 EEST
- Node: v25.5.0
- npm: 11.8.0
- pnpm: 10.28.2
- Git: 2.52.0
- GitHub CLI: 2.92.0
- Vercel CLI: 50.8.1
- Package manager used: pnpm

## Commands run

```bash
pnpm install
pnpm lint
pnpm check
pnpm build
BASE_URL=http://localhost:3001 pnpm verify:routes
vercel login
vercel link --yes --project edupocket
printf %s 'https://edupocket.org' | vercel env add NEXT_PUBLIC_SITE_URL production --force --yes
vercel domains add edupocket.org
vercel domains add www.edupocket.org
vercel --prod --yes
vercel inspect https://edupocket-48e9nj4td-arads-projects-dad3a535.vercel.app
/usr/bin/curl -I -L
```

Visual QA screenshots were captured with Google Chrome headless because the Browser/Kapture extension did not connect.

## Quality gates

- Lint: passed
- TypeScript check: passed
- Production build: passed

## Local verification

- Production server: `http://localhost:3001`
- Verified routes with HTTP 200:
  - `/`
  - `/articles`
  - `/lessons`
  - `/podcasts`
  - `/about`
  - `/articles/getting-started-with-ai-learning`
  - `/lessons/the-a-r-e-speaking-framework`
  - `/podcasts/how-to-learn-with-ai-without-becoming-lazy`
- Visual checks:
  - Homepage desktop English screenshot: `/tmp/edupocket-home-en.png`
  - Homepage desktop Persian screenshot: `/tmp/edupocket-home-fa.png`
  - Homepage mobile Persian screenshot: `/tmp/edupocket-home-mobile-fa-final.png`
  - About Persian screenshot: `/tmp/edupocket-about-fa.png`
  - Podcast Persian screenshot: `/tmp/edupocket-podcast-fa.png`
  - Language toggle state: passed
  - Persian RTL layout and typography: passed
  - Supplied founder images: passed
  - Missing-audio state: passed
  - MDX content rendering: passed

## GitHub status

- Repository: `https://github.com/esfandiari1991/edupocket`
- Branch pushed: `feature/edupocket-final-by-codex`
- Initial production build commit: `fb3151d`
- Latest bilingual production commit: `4a34915`
- Vercel GitHub integration: connected during Vercel project linking.

## Vercel status

- Project: `arads-projects-dad3a535/edupocket`
- Deploy command: `vercel --prod --yes`
- Build status: passed
- Inspect URL: `https://vercel.com/arads-projects-dad3a535/edupocket/YFob446PkZTiCSFbtLNmeiNKiawb`
- Deployment status: Ready
- Production environment variable: `NEXT_PUBLIC_SITE_URL=https://edupocket.org`
- Note: the first Vercel deploy attempt failed because the local folder name contains uppercase letters and Vercel project names must be lowercase. The project was linked explicitly as `edupocket`, then production deployment succeeded.

## Production URL

- Stable production alias: `https://edupocket-rho.vercel.app`
- Immutable production deployment URL: `https://edupocket-48e9nj4td-arads-projects-dad3a535.vercel.app`
- Custom domain aliases added in Vercel: `https://edupocket.org`, `https://www.edupocket.org`
- Custom domain DNS status: pending DNS update by the domain owner.

## Live verification

Verified with `/usr/bin/curl -I -L`:

- `200` `https://edupocket-rho.vercel.app/`
- `200` `https://edupocket-rho.vercel.app/articles`
- `200` `https://edupocket-rho.vercel.app/lessons`
- `200` `https://edupocket-rho.vercel.app/podcasts`
- `200` `https://edupocket-rho.vercel.app/about`
- `200` `https://edupocket-rho.vercel.app/articles/getting-started-with-ai-learning`
- `200` `https://edupocket-rho.vercel.app/lessons/the-a-r-e-speaking-framework`
- `200` `https://edupocket-rho.vercel.app/podcasts/how-to-learn-with-ai-without-becoming-lazy`
- `200` `https://edupocket-rho.vercel.app/sitemap.xml`
- `200` `https://edupocket-rho.vercel.app/robots.txt`

Canonical sitemap/robots output was verified through the Vercel alias and now points to `https://edupocket.org` without path-breaking whitespace.

Custom domain check before DNS update:

- `200` `https://edupocket.org/`
- `404` `https://edupocket.org/articles`
- `404` `https://edupocket.org/sitemap.xml`
- `404` `https://edupocket.org/robots.txt`

Vercel is ready for the custom domain, but the domain's DNS must be pointed to Vercel before the full site resolves on `edupocket.org`.

## Custom domain handoff

Vercel CLI added both `edupocket.org` and `www.edupocket.org` to the project. The owner must now update DNS with one of these options:

- Recommended record option from Vercel CLI: add `A edupocket.org 76.76.21.21` and `A www.edupocket.org 76.76.21.21`.
- Nameserver option: change the domain nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.

After DNS propagation, rerun `vercel domains inspect edupocket.org`, `vercel domains inspect www.edupocket.org`, and live route checks on `https://edupocket.org`.

## Blockers

Custom domain DNS is the only remaining external handoff step.
