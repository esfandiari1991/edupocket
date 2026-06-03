#!/usr/bin/env node
import process from "node:process";
import postgres from "postgres";
import booklet from "../src/lib/eva-booklet.generated.json" with { type: "json" };

const databaseUrl = process.env.EVA_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing EVA_DATABASE_URL or DATABASE_URL.");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
  prepare: false,
});

function activityKindForPage(page) {
  if (page.type.includes("reading") || page.type.includes("enrichment")) return "reading";
  if (page.type.includes("grammar")) return "grammar";
  if (page.type.includes("vocabulary")) return "lexical";
  if (page.type.includes("translation") || page.type.includes("exegesis")) return "translation";
  if (page.type.includes("listening")) return "pronunciation";
  if (page.type.includes("quiz")) return "quiz";
  if (page.type.includes("scenario") || page.type.includes("gallery")) return "religious-context";
  if (page.type.includes("progress")) return "review";
  return "source-page";
}

function estimateMinutes(page) {
  return Math.max(6, Math.min(32, Math.round(page.wordCount / 65) + page.fieldCount * 2 + page.checkboxCount));
}

function firstReadableText(page) {
  return page.blocks.find((block) => block.length > 80) ?? page.summary ?? page.title;
}

try {
  await sql.begin(async (tx) => {
    await tx`
      insert into eva_source_documents (id, title, privacy, imported_pages, text_characters, updated_at)
      values (
        'eva-digital-booklet-source',
        ${booklet.source.title},
        ${booklet.source.privacy},
        ${booklet.stats.pages},
        ${booklet.stats.textCharacters ?? null},
        now()
      )
      on conflict (id) do update set
        title = excluded.title,
        privacy = excluded.privacy,
        imported_pages = excluded.imported_pages,
        text_characters = excluded.text_characters,
        updated_at = now()
    `;

    for (const [index, chapter] of booklet.chapters.entries()) {
      await tx`
        insert into eva_chapters (id, source_document_id, title, page_ids, skill_tags, sort_order, updated_at)
        values (
          ${chapter.id},
          'eva-digital-booklet-source',
          ${chapter.title},
          ${tx.json(chapter.pageIds)},
          ${tx.json(chapter.skillTags)},
          ${index + 1},
          now()
        )
        on conflict (id) do update set
          title = excluded.title,
          page_ids = excluded.page_ids,
          skill_tags = excluded.skill_tags,
          sort_order = excluded.sort_order,
          updated_at = now()
      `;

      const chapterPages = booklet.pages.filter((page) => page.chapterId === chapter.id);
      const sectionTypes = Array.from(new Set(chapterPages.map((page) => page.type)));
      for (const type of sectionTypes) {
        const typedPages = chapterPages.filter((page) => page.type === type);
        await tx`
          insert into eva_sections (id, chapter_id, type, page_ids, field_count, checkbox_count, updated_at)
          values (
            ${`section-${chapter.id}-${type}`},
            ${chapter.id},
            ${type},
            ${tx.json(typedPages.map((page) => page.id))},
            ${typedPages.reduce((sum, page) => sum + page.fieldCount, 0)},
            ${typedPages.reduce((sum, page) => sum + page.checkboxCount, 0)},
            now()
          )
          on conflict (id) do update set
            type = excluded.type,
            page_ids = excluded.page_ids,
            field_count = excluded.field_count,
            checkbox_count = excluded.checkbox_count,
            updated_at = now()
        `;
      }
    }

    for (const page of booklet.pages) {
      const activityId = `activity-${page.id}`;
      await tx`
        insert into eva_activities (
          id,
          kind,
          title,
          source_page_ids,
          skill_targets,
          level_targets,
          estimated_minutes,
          scoring_mode,
          trackable_signals,
          updated_at
        )
        values (
          ${activityId},
          ${activityKindForPage(page)},
          ${page.title},
          ${tx.json([page.id])},
          ${tx.json(page.skillTags)},
          ${tx.json(page.levelTags)},
          ${estimateMinutes(page)},
          ${page.type.includes("quiz") ? "answer-key" : page.fieldCount > 0 ? "teacher-review" : "completion"},
          ${tx.json(["active page", "completion", "writing draft", "review queue", "TTS listened", "teacher note"])},
          now()
        )
        on conflict (id) do update set
          kind = excluded.kind,
          title = excluded.title,
          source_page_ids = excluded.source_page_ids,
          skill_targets = excluded.skill_targets,
          level_targets = excluded.level_targets,
          estimated_minutes = excluded.estimated_minutes,
          scoring_mode = excluded.scoring_mode,
          trackable_signals = excluded.trackable_signals,
          updated_at = now()
      `;

      await tx`
        insert into eva_learning_items (id, activity_id, title, source_page_id, type, tags, updated_at)
        values (
          ${`item-${page.id}`},
          ${activityId},
          ${page.title},
          ${page.id},
          ${page.type},
          ${tx.json([...page.skillTags, ...page.levelTags])},
          now()
        )
        on conflict (id) do update set
          activity_id = excluded.activity_id,
          title = excluded.title,
          source_page_id = excluded.source_page_id,
          type = excluded.type,
          tags = excluded.tags,
          updated_at = now()
      `;

      await tx`
        insert into eva_tts_segments (
          id,
          activity_id,
          source_page_id,
          title,
          text,
          locale,
          voice_hint,
          speed_default,
          updated_at
        )
        values (
          ${`tts-page-${page.id}`},
          ${activityId},
          ${page.id},
          ${`Page ${page.page}: ${page.title}`},
          ${firstReadableText(page)},
          'en',
          'calm-teacher',
          0.86,
          now()
        )
        on conflict (id) do update set
          title = excluded.title,
          text = excluded.text,
          voice_hint = excluded.voice_hint,
          speed_default = excluded.speed_default,
          updated_at = now()
      `;
    }
  });

  console.log(`Synced ${booklet.stats.pages} Eva pages and ${booklet.chapters.length} chapters into Postgres.`);
} finally {
  await sql.end({ timeout: 5 });
}
