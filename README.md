# EduPocket

EduPocket is Ali Rad's public educational content hub: practical notes, teaching systems, AI experiments, language-learning frameworks, and audio lessons.

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

## Deploy

```bash
vercel --prod
```

If a Vercel login is required, run `vercel login` first.

## Folder structure

- `.git`: project history
- `src/app`: routes, metadata, sitemap, robots, and page layouts
- `src/components`: site, MDX, and audio components
- `src/lib`: site config, content loaders, utilities
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

## Publish and feature behavior

- `published: false` hides the file from all public routes.
- `featured: true` includes the item in featured homepage sections.
- Tags generate `/tags/[tag]` routes automatically.

## Custom domain later

The app can use `NEXT_PUBLIC_SITE_URL` for canonical metadata and sitemap URLs. Set it to the final production URL in Vercel when the domain is ready.

## Future upgrade ideas

- Search
- Newsletter or waitlist
- CMS editing workflow
- Vercel Blob, Cloudflare R2, or S3 for larger audio
- Course pages
- Downloadable PDFs
