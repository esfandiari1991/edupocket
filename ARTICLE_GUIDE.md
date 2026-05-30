# EduPocket Content Guide

Use MDX files for articles, lessons, and podcasts. Keep content practical, structured, and free of placeholder text.

## Article frontmatter

```md
---
title: "Getting Started with AI Learning"
description: "A practical guide to using AI as a structured learning partner."
date: "2026-05-30"
updated: "2026-05-30"
tags:
  - AI Learning
  - Learning
category: "AI Learning"
published: true
featured: true
---
```

## Lesson frontmatter

```md
---
title: "The A-R-E Speaking Framework"
description: "A simple framework for structured IELTS and academic speaking answers."
date: "2026-05-30"
updated: "2026-05-30"
level: "B1-C1"
skill: "Speaking"
tags:
  - IELTS
  - Speaking
published: true
featured: true
---
```

## Podcast frontmatter

```md
---
title: "How to Learn with AI Without Becoming Lazy"
description: "A short audio lesson about using AI as a thinking partner, not a shortcut."
date: "2026-05-30"
updated: "2026-05-30"
episode: 1
season: 1
audioSrc: "/audio/how-to-learn-with-ai-without-becoming-lazy.mp3"
duration: "08:42"
language: "English"
transcript: true
tags:
  - AI Learning
  - Study Systems
published: true
featured: true
---
```

## Tagging rules

- Use clear title-case tags.
- Reuse existing tags when possible.
- Tags create public tag pages automatically.
- Avoid creating tags for future features until there is published content for them.

## Featured behavior

`featured: true` makes content eligible for homepage highlights. Keep featured content current and useful.

## Draft behavior

`published: false` hides a file from public pages, sitemap, tags, and detail routes.

## Templates

Use:

```bash
pnpm new:article "Title"
pnpm new:lesson "Title"
pnpm new:podcast "Title"
```
