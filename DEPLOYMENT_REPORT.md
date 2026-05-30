# EduPocket Deployment Report

## Status

Production build complete, committed, pushed to GitHub, deployed to Vercel, and verified live on the public Vercel project alias. Latest pass adds the polished motion system requested after the initial production deployment.

## Local path

`/Users/ali/Documents/OpenAI/Projects/EduPocket`

## Legacy workspace migration

Previous local prototype/workspace was found at /Users/ali/Documents/Claude/Projects/eduPocket.org and was safely migrated to /Users/ali/Documents/OpenAI/Projects/EduPocket.

## Scope

- Fresh Next.js production build.
- Bilingual Persian/English experience with an animated language slider.
- Founder photo treatment using Ali Rad's supplied images.
- Interactive English Lab route inspired by the learning structure of test-prep sites, with original EduPocket content and bilingual UI.
- Responsive hardening for small mobile widths, MDX code blocks, RTL text, and animated contact CTAs.
- Homepage alignment polish with a simplified section structure, stronger hero symmetry, and prominent collaboration CTAs.
- Polished motion system across the hero, CTAs, content cards, upcoming states, English Lab controls, and MDX media.
- Vercel production deployment first.
- External DNS/hosting providers are out of scope for this pass.
- Previous static prototype preserved under `legacy-static/`.

## Environment

- Date/time: 2026-05-30 18:17:06 EEST
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
vercel inspect https://edupocket-8bpw6dzb7-arads-projects-dad3a535.vercel.app
vercel domains inspect edupocket.org
vercel domains inspect www.edupocket.org
dig +short edupocket.org
dig +short www.edupocket.org
/usr/bin/curl -I -L
Google Chrome headless/CDP screenshots and viewport audits
```

Visual QA screenshots were captured with Google Chrome headless/CDP because the Browser/Kapture extension did not provide usable screenshot and tab-management access in this session.

## Quality gates

- Lint: passed
- TypeScript check: passed
- Production build: passed
- Responsive audit: passed across 108 page/language/viewport states with zero horizontal overflow failures after fixes
- Motion QA: passed with reduced-motion handling, true 390px mobile emulation, and zero horizontal overflow in English and Persian

## Local verification

- Production server: `http://localhost:3001`
- Verified routes with HTTP 200:
  - `/`
  - `/articles`
  - `/lessons`
  - `/english-lab`
  - `/podcasts`
  - `/about`
  - `/articles/getting-started-with-ai-learning`
  - `/lessons/the-a-r-e-speaking-framework`
  - `/podcasts/how-to-learn-with-ai-without-becoming-lazy`
- Visual checks:
  - Homepage desktop English screenshot: `/tmp/edupocket-home-en.png`
  - Homepage desktop Persian screenshot: `/tmp/edupocket-home-fa.png`
  - Homepage mobile Persian screenshot: `/tmp/edupocket-home-mobile-fa-final.png`
  - Latest motion homepage desktop screenshot: `/tmp/edupocket-cdp-home-1440-en.png`
  - Latest motion homepage mobile English screenshot: `/tmp/edupocket-cdp-home-390-en.png`
  - Latest motion homepage mobile Persian screenshot: `/tmp/edupocket-cdp-home-390-fa.png`
  - Latest motion English Lab desktop screenshot: `/tmp/edupocket-cdp-lab-1440-en.png`
  - Latest motion English Lab mobile screenshot: `/tmp/edupocket-cdp-lab-390-en.png`
  - About Persian screenshot: `/tmp/edupocket-about-fa.png`
  - Podcast Persian screenshot: `/tmp/edupocket-podcast-fa.png`
  - Language toggle state: passed
  - Persian RTL layout and typography: passed
  - Supplied founder images: passed
  - Missing-audio state: passed
  - MDX content rendering: passed
- Mobile/desktop responsive audit at 320, 360, 390, 768, 1024, and 1440 widths: passed
- English Lab desktop/mobile interaction states: passed
- Homepage alignment and overflow audit at 320, 390, 768, 1024, and 1440 widths in English and Persian: passed

## GitHub status

- Repository: `https://github.com/esfandiari1991/edupocket`
- Branch pushed: `feature/edupocket-final-by-codex`
- Initial production build commit: `fb3151d`
- Latest bilingual production commit: `4a34915`
- English Lab commit: `6e8bca9`
- Latest responsive hardening commit: `610d67d`
- Homepage alignment and collaboration CTA commit: `3b54d9b`
- Original media materials commit: `eb80f85`
- Latest motion system commit: `755f409`
- Vercel GitHub integration: connected during Vercel project linking.

## Vercel status

- Project: `arads-projects-dad3a535/edupocket`
- Deploy command: `vercel --prod --yes`
- Build status: passed
- Latest inspect URL: `https://vercel.com/arads-projects-dad3a535/edupocket/2L8nFFd6K9SucKagh65HgPFoSZsB`
- Deployment status: Ready
- Production environment variable: `NEXT_PUBLIC_SITE_URL=https://edupocket.org`
- Note: the first Vercel deploy attempt failed because the local folder name contains uppercase letters and Vercel project names must be lowercase. The project was linked explicitly as `edupocket`, then production deployment succeeded.

## Production URL

- Stable production alias: `https://edupocket-rho.vercel.app`
- Latest immutable production deployment URL: `https://edupocket-ifu9vr68b-arads-projects-dad3a535.vercel.app`
- Custom domain aliases added in Vercel: `https://edupocket.org`, `https://www.edupocket.org`
- Custom domain DNS status: pending DNS update by the domain owner.
- Generated deployment URLs currently return Vercel authentication (`401`) when visited directly. The public Vercel project alias below was verified and is the shareable live URL until custom DNS is updated.

## Live verification

Verified with HTTP HEAD checks:

- `200` `https://edupocket-rho.vercel.app/`
- `200` `https://edupocket-rho.vercel.app/english-lab`
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

- `https://edupocket.org/` currently resolves to `5.144.130.116`; the homepage returns `200`, but subroutes like `/articles` return `404`, so it is not serving the Vercel app correctly yet.
- `https://www.edupocket.org/` currently resolves through the same non-Vercel apex target.
- `vercel domains inspect edupocket.org` reports the domain is attached to the Vercel project but not configured properly until DNS is updated.

Vercel is ready for the custom domain, but the domain's DNS must be pointed to Vercel before the full site resolves on `edupocket.org`.

## Custom domain handoff

Vercel CLI added both `edupocket.org` and `www.edupocket.org` to the project. The owner must now update DNS with one of these options:

- Recommended record option from Vercel CLI: add `A edupocket.org 76.76.21.21` and `A www.edupocket.org 76.76.21.21`.
- Nameserver option: change the domain nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.

After DNS propagation, rerun `vercel domains inspect edupocket.org`, `vercel domains inspect www.edupocket.org`, and live route checks on `https://edupocket.org`.

## Blockers

Custom domain DNS is the only remaining external handoff step.
