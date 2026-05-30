# EduPocket

EduPocket is Ali Rad's public educational content hub: practical notes, teaching systems, AI experiments, language-learning frameworks, and audio lessons.

The site is bilingual. Visitors can switch between English and Persian from the animated language slider in the header. It also includes an interactive English Lab for placement-style practice, skill drills, and lesson discovery.

## Official local path

```text
/Users/ali/Documents/OpenAI/Projects/EduPocket
```

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- File-based MDX content
- `gray-matter`, `reading-time`, `next-mdx-remote`, `remark-gfm`
- Vercel deployment

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
pnpm lint
pnpm check
pnpm build
```

## Playwright and deployment QA

EduPocket v1 does not require Playwright for production deployment. The required gates are lint, TypeScript check, production build, route checks, and manual or browser QA when available.

Playwright is not installed as a direct dependency, no Playwright config is present, and no build, lint, check, postinstall, prepare, or Vercel command runs browser e2e tests. If automated e2e testing is added later, keep it optional and separate from production deployment.

## Deploy

```bash
vercel --prod
```

If a Vercel login is required, run `vercel login` first.

Current Vercel production URL:

```text
https://edupocket-rho.vercel.app
```

The custom domain `https://edupocket.org` is attached in Vercel. It will serve the site after the DNS record for the apex domain points to Vercel.

## Folder structure

- `.git`: project history
- `src/app`: routes, metadata, sitemap, robots, and page layouts
- `src/components`: site, MDX, audio, and English Lab components
- `src/lib`: site config, content loaders, utilities
- `src/lib/english-lab.ts`: English Lab sample tests, prompts, and skill data
- `src/lib/i18n.ts`: shared bilingual labels, date formatting, and content metadata helpers
- `src/types`: shared content types
- `content/articles`: article MDX files
- `content/lessons`: micro-lesson MDX files
- `content/podcasts`: podcast MDX files
- `public/audio`: podcast audio files
- `public/covers`: future cover artwork
- `public/icons`: icon assets
- `public/images`: visual assets
- `scripts`: content creation and route verification scripts
- `legacy-static`: preserved previous static prototype

## Add content

```bash
pnpm new:article "Title"
pnpm new:lesson "Title"
pnpm new:podcast "Title"
```

Articles, lessons, and podcasts are drafts by default. Set `published: true` to publish.

Podcast audio files go in `public/audio`. The podcast script creates an `audioSrc` like `/audio/title.mp3`; place the matching file there and update `duration`.

Each content file should include Persian fields (`faTitle`, `faDescription`, and `faContent`). Articles also support `faCategory`, lessons support `faSkill` and `faLevel`, and podcasts support `faLanguage`.

## Publish and feature behavior

- `published: false` hides the file from all public routes.
- `featured: true` includes the item in featured homepage sections.
- Tags generate `/tags/[tag]` routes automatically.

## Production URL later

The app can use `NEXT_PUBLIC_SITE_URL` for canonical metadata and sitemap URLs. Set it in Vercel if the production URL changes.

## Future upgrade ideas

- Search
- Newsletter or waitlist
- CMS editing workflow
- Vercel Blob, Cloudflare R2, or S3 for larger audio
- Course pages
- Downloadable PDFs
