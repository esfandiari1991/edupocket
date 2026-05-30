# EduPocket Content Guide

Use MDX files for articles, lessons, and podcasts. Keep content practical, structured, and free of placeholder text.

## Article frontmatter

```md
---
title: "Getting Started with AI Learning"
description: "A practical guide to using AI as a structured learning partner."
faTitle: "شروع یادگیری با هوش مصنوعی"
faDescription: "یک راهنمای کاربردی برای استفاده از هوش مصنوعی به عنوان همراه یادگیری."
date: "2026-05-30"
updated: "2026-05-30"
tags:
  - AI Learning
  - Learning
category: "AI Learning"
faCategory: "یادگیری با هوش مصنوعی"
published: true
featured: true
faContent: |
  متن فارسی مقاله را اینجا بنویسید.
---
```

## Lesson frontmatter

```md
---
title: "The A-R-E Speaking Framework"
description: "A simple framework for structured IELTS and academic speaking answers."
faTitle: "چارچوب اسپیکینگ A-R-E"
faDescription: "توضیح فارسی درس را اینجا بنویسید."
date: "2026-05-30"
updated: "2026-05-30"
level: "B1-C1"
faLevel: "B1 تا C1"
skill: "Speaking"
faSkill: "اسپیکینگ"
tags:
  - IELTS
  - Speaking
published: true
featured: true
faContent: |
  متن فارسی درس را اینجا بنویسید.
---
```

## Podcast frontmatter

```md
---
title: "How to Learn with AI Without Becoming Lazy"
description: "A short audio lesson about using AI as a thinking partner, not a shortcut."
faTitle: "چطور با هوش مصنوعی یاد بگیریم بدون اینکه تنبل شویم"
faDescription: "توضیح فارسی اپیزود را اینجا بنویسید."
date: "2026-05-30"
updated: "2026-05-30"
episode: 1
season: 1
audioSrc: "/audio/how-to-learn-with-ai-without-becoming-lazy.mp3"
duration: "08:42"
language: "English"
faLanguage: "انگلیسی"
transcript: true
tags:
  - AI Learning
  - Study Systems
published: true
featured: true
faContent: |
  متن فارسی یادداشت اپیزود را اینجا بنویسید.
---
```

## Bilingual fields

Every public content file supports Persian fields:

- `faTitle`
- `faDescription`
- `faCategory` for articles
- `faSkill` and `faLevel` for lessons
- `faLanguage` for podcasts
- `faContent` for the Persian MDX body

Keep English in the regular body below frontmatter and Persian in `faContent`. The language slider switches between them instantly.

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
