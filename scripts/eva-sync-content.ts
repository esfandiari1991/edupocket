#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import postgres, { type JSONValue } from "postgres";
import { buildEvaLearningDatabase } from "../src/lib/eva-learning-db";
import type { EvaBooklet } from "../src/lib/eva-private-content";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const databaseUrl = process.env.EVA_DATABASE_URL || process.env.DATABASE_URL;

  const bookletPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "eva-booklet.generated.json",
  );
  const booklet = JSON.parse(
    await fs.readFile(bookletPath, "utf8"),
  ) as EvaBooklet;
  const learningDb = buildEvaLearningDatabase(booklet);

  function printSummary(label: string) {
    console.log(label);
    console.table({
      users: learningDb.users.length,
      memberships: learningDb.memberships.length,
      sourceDocuments: learningDb.sourceDocuments.length,
      chapters: learningDb.chapters.length,
      sections: learningDb.sections.length,
      activities: learningDb.activities.length,
      learningItems: learningDb.learningItems.length,
      questions: learningDb.questions.length,
      ttsSegments: learningDb.ttsSegments.length,
      examTasks: learningDb.examTasks.length,
    });
  }

  if (dryRun) {
    printSummary("Eva content sync dry run. No database writes were made.");
    return;
  }

  if (!databaseUrl) {
    console.error(
      "Missing EVA_DATABASE_URL or DATABASE_URL. Run `pnpm eva:sync-content:dry` to inspect the local content graph.",
    );
    process.exit(1);
  }

  const chapterSortOrder = new Map(
    booklet.chapters.map((chapter, index) => [chapter.id, index + 1]),
  );

  const sql = postgres(databaseUrl, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
    prepare: false,
  });

  try {
    await sql.begin(async (tx) => {
      for (const user of learningDb.users) {
        await tx`
        insert into eva_users (id, display_name, role, locale, can_teach, updated_at)
        values (${user.id}, ${user.displayName}, ${user.role}, ${user.locale}, ${user.canTeach}, now())
        on conflict (id) do update set
          display_name = excluded.display_name,
          role = excluded.role,
          locale = excluded.locale,
          can_teach = excluded.can_teach,
          updated_at = now()
      `;
      }

      for (const membership of learningDb.memberships) {
        await tx`
        insert into eva_memberships (user_id, product_id, status, price_paid, currency, updated_at)
        values (${membership.userId}, ${membership.productId}, ${membership.status}, ${membership.pricePaid}, ${membership.currency}, now())
        on conflict (user_id, product_id) do update set
          status = excluded.status,
          price_paid = excluded.price_paid,
          currency = excluded.currency,
          updated_at = now()
      `;
      }

      for (const document of learningDb.sourceDocuments) {
        await tx`
        insert into eva_source_documents (id, title, privacy, imported_pages, text_characters, updated_at)
        values (${document.id}, ${document.title}, ${document.privacy}, ${document.importedPages}, ${document.textCharacters}, now())
        on conflict (id) do update set
          title = excluded.title,
          privacy = excluded.privacy,
          imported_pages = excluded.imported_pages,
          text_characters = excluded.text_characters,
          updated_at = now()
      `;
      }

      for (const chapter of learningDb.chapters) {
        await tx`
        insert into eva_chapters (id, source_document_id, title, page_ids, skill_tags, sort_order, updated_at)
        values (
          ${chapter.id},
          'eva-digital-booklet-source',
          ${chapter.title},
          ${tx.json(chapter.pageIds)},
          ${tx.json(chapter.skillTags)},
          ${chapterSortOrder.get(chapter.id) ?? 0},
          now()
        )
        on conflict (id) do update set
          title = excluded.title,
          page_ids = excluded.page_ids,
          skill_tags = excluded.skill_tags,
          sort_order = excluded.sort_order,
          updated_at = now()
      `;
      }

      for (const section of learningDb.sections) {
        await tx`
        insert into eva_sections (id, chapter_id, type, page_ids, field_count, checkbox_count, updated_at)
        values (
          ${section.id},
          ${section.chapterId},
          ${section.type},
          ${tx.json(section.pageIds)},
          ${section.fieldCount},
          ${section.checkboxCount},
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

      for (const activity of learningDb.activities) {
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
          content_json,
          updated_at
        )
        values (
          ${activity.id},
          ${activity.kind},
          ${activity.title},
          ${tx.json(activity.sourcePageIds)},
          ${tx.json(activity.skillTargets)},
          ${tx.json(activity.levelTargets)},
          ${activity.estimatedMinutes},
          ${activity.scoringMode},
          ${tx.json(activity.trackableSignals)},
          ${tx.json(activity.contentJson as JSONValue)},
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
          content_json = excluded.content_json,
          updated_at = now()
      `;
      }

      for (const item of learningDb.learningItems) {
        await tx`
        insert into eva_learning_items (id, activity_id, title, source_page_id, type, tags, updated_at)
        values (
          ${item.id},
          ${item.activityId},
          ${item.title},
          ${item.sourcePageId ?? null},
          ${item.type},
          ${tx.json(item.tags)},
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
      }

      for (const question of learningDb.questions) {
        await tx`
        insert into eva_questions (id, activity_id, track, question_type, prompt, options, answer_index, rationale, updated_at)
        values (
          ${question.id},
          ${question.activityId},
          ${question.track},
          ${question.type},
          ${question.prompt},
          ${tx.json(question.options)},
          ${question.answerIndex},
          ${question.rationale},
          now()
        )
        on conflict (id) do update set
          activity_id = excluded.activity_id,
          track = excluded.track,
          question_type = excluded.question_type,
          prompt = excluded.prompt,
          options = excluded.options,
          answer_index = excluded.answer_index,
          rationale = excluded.rationale,
          updated_at = now()
      `;
      }

      for (const segment of learningDb.ttsSegments) {
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
          pronunciation_focus,
          updated_at
        )
        values (
          ${segment.id},
          ${segment.activityId},
          ${segment.sourcePageId ?? null},
          ${segment.title},
          ${segment.text},
          ${segment.locale},
          ${segment.voiceHint},
          ${segment.speedDefault},
          ${segment.pronunciationFocus ?? null},
          now()
        )
        on conflict (id) do update set
          activity_id = excluded.activity_id,
          source_page_id = excluded.source_page_id,
          title = excluded.title,
          text = excluded.text,
          locale = excluded.locale,
          voice_hint = excluded.voice_hint,
          speed_default = excluded.speed_default,
          pronunciation_focus = excluded.pronunciation_focus,
          updated_at = now()
      `;
      }
    });

    printSummary("Eva content sync complete.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
