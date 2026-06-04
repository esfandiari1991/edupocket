import "server-only";

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import {
  evaSeedUsers,
  normalizeStoredState,
  type EvaSeedUser,
  type EvaStoredStudioState,
  type EvaUserId,
} from "@/lib/eva-learning-db";

const productId = "eva-digital-booklet" as const;

type EvaSql = ReturnType<typeof postgres>;
type EvaClientPersistenceMode = "database" | "local-database" | "development";

type EvaLocalMembership = {
  userId: EvaUserId;
  productId: typeof productId;
  status: "active";
  pricePaid: 4.99;
  currency: "USD";
};

type EvaLocalResponse = {
  userId: EvaUserId;
  productId: typeof productId;
  responseKey: string;
  responseJson: { answerIndex?: number; text?: string };
  updatedAt: string;
};

type EvaLocalReviewQueueItem = {
  userId: EvaUserId;
  productId: typeof productId;
  itemId: string;
  status: "open";
  updatedAt: string;
};

type EvaLocalTeacherNote = {
  teacherUserId: EvaUserId;
  learnerUserId: EvaUserId;
  productId: typeof productId;
  pageId: string;
  note: string;
  updatedAt: string;
};

type EvaLocalStore = {
  version: 1;
  productId: typeof productId;
  users: EvaSeedUser[];
  memberships: EvaLocalMembership[];
  userProgress: Record<EvaUserId, EvaStoredStudioState>;
  userResponses: EvaLocalResponse[];
  reviewQueue: EvaLocalReviewQueueItem[];
  teacherNotes: EvaLocalTeacherNote[];
  updatedAt: string;
};

declare global {
  var evaPostgresSql: EvaSql | undefined;
  var evaLocalStoreQueue: Promise<unknown> | undefined;
}

function databaseUrl() {
  return process.env.EVA_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
}

export function isEvaPersistenceConfigured() {
  return Boolean(databaseUrl());
}

function isLocalFilePersistenceAllowed() {
  return !databaseUrl() && process.env.VERCEL !== "1" && process.env.EVA_DISABLE_LOCAL_EVA_STORE !== "1";
}

export function getEvaClientPersistenceMode(): EvaClientPersistenceMode {
  if (databaseUrl()) return "database";
  if (isLocalFilePersistenceAllowed()) return "local-database";
  return "development";
}

export function hashEvaPasscode(passcode: string) {
  return createHash("sha256").update(passcode.trim()).digest("hex");
}

function sqlClient() {
  const url = databaseUrl();
  if (!url) throw new Error("Eva persistence is not configured.");

  if (!globalThis.evaPostgresSql) {
    globalThis.evaPostgresSql = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  return globalThis.evaPostgresSql;
}

function localStorePath() {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "eva-portal-store.json");
}

function emptyProgressRecord(): Record<EvaUserId, EvaStoredStudioState> {
  return {
    ali: normalizeStoredState(null),
    eva: normalizeStoredState(null),
    elham: normalizeStoredState(null),
  };
}

function createLocalStore(): EvaLocalStore {
  return {
    version: 1,
    productId,
    users: evaSeedUsers,
    memberships: evaSeedUsers.map((user) => ({
      userId: user.id,
      productId,
      status: "active",
      pricePaid: 4.99,
      currency: "USD",
    })),
    userProgress: emptyProgressRecord(),
    userResponses: [],
    reviewQueue: [],
    teacherNotes: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeLocalStore(value: Partial<EvaLocalStore> | null | undefined): EvaLocalStore {
  const fallback = createLocalStore();
  const userProgress = emptyProgressRecord();
  for (const user of evaSeedUsers) {
    userProgress[user.id] = normalizeStoredState(value?.userProgress?.[user.id]);
  }

  return {
    ...fallback,
    ...(value ?? {}),
    version: 1,
    productId,
    users: evaSeedUsers,
    memberships: evaSeedUsers.map((user) => ({
      userId: user.id,
      productId,
      status: "active",
      pricePaid: 4.99,
      currency: "USD",
    })),
    userProgress,
    userResponses: value?.userResponses ?? [],
    reviewQueue: value?.reviewQueue ?? [],
    teacherNotes: value?.teacherNotes ?? [],
    updatedAt: value?.updatedAt ?? fallback.updatedAt,
  };
}

async function readLocalStore() {
  if (!isLocalFilePersistenceAllowed()) throw new Error("Eva local file persistence is not available in this environment.");

  const storePath = localStorePath();
  await fs.mkdir(path.dirname(storePath), { recursive: true });

  try {
    const raw = await fs.readFile(storePath, "utf8");
    return normalizeLocalStore(JSON.parse(raw) as Partial<EvaLocalStore>);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const store = createLocalStore();
    await writeLocalStore(store);
    return store;
  }
}

async function writeLocalStore(store: EvaLocalStore) {
  const storePath = localStorePath();
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  const temporaryPath = `${storePath}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, storePath);
}

async function updateLocalStore<T>(mutator: (store: EvaLocalStore) => T | Promise<T>) {
  const previous = globalThis.evaLocalStoreQueue ?? Promise.resolve();
  const next = previous
    .catch(() => undefined)
    .then(async () => {
      const store = await readLocalStore();
      const result = await mutator(store);
      store.updatedAt = new Date().toISOString();
      await writeLocalStore(store);
      return result;
    });

  globalThis.evaLocalStoreQueue = next.then(
    () => undefined,
    () => undefined,
  );

  return next;
}

function teacherNotesForLearner(store: EvaLocalStore, learnerUserId: EvaUserId) {
  return Object.fromEntries(
    store.teacherNotes
      .filter((entry) => entry.learnerUserId === learnerUserId && entry.note.trim())
      .map((entry) => [entry.pageId, entry.note]),
  );
}

function responsesFromState(userId: EvaUserId, state: EvaStoredStudioState, updatedAt: string): EvaLocalResponse[] {
  return [
    ...Object.entries(state.quizAnswers).map(([key, value]) => ({
      userId,
      productId,
      responseKey: `quiz:${key}`,
      responseJson: { answerIndex: value },
      updatedAt,
    })),
    ...Object.entries(state.examAnswers).map(([key, value]) => ({
      userId,
      productId,
      responseKey: `exam:${key}`,
      responseJson: { answerIndex: value },
      updatedAt,
    })),
    ...Object.entries(state.writingDrafts)
      .filter(([, value]) => value.trim())
      .map(([key, value]) => ({
        userId,
        productId,
        responseKey: `draft:${key}`,
        responseJson: { text: value },
        updatedAt,
      })),
  ];
}

function reviewQueueFromState(userId: EvaUserId, state: EvaStoredStudioState, updatedAt: string): EvaLocalReviewQueueItem[] {
  return Object.entries(state.reviewQueue)
    .filter(([, queued]) => queued)
    .map(([itemId]) => ({
      userId,
      productId,
      itemId,
      status: "open" as const,
      updatedAt,
    }));
}

function seedUserFromRow(row: {
  id: string;
  display_name: string;
  role: EvaSeedUser["role"];
  locale: EvaSeedUser["locale"];
  can_teach: boolean;
}): EvaSeedUser | null {
  if (!["ali", "eva", "elham"].includes(row.id)) return null;
  return {
    id: row.id as EvaUserId,
    displayName: row.display_name,
    role: row.role,
    locale: row.locale,
    canTeach: row.can_teach,
  };
}

export async function getEvaUserByPasscode(passcode: string): Promise<EvaSeedUser | null> {
  if (!isEvaPersistenceConfigured()) return null;

  const passcodeHash = hashEvaPasscode(passcode);
  const sql = sqlClient();
  const rows = await sql`
    select u.id, u.display_name, u.role, u.locale, u.can_teach
    from eva_memberships m
    join eva_users u on u.id = m.user_id
    where
      m.product_id = ${productId}
      and m.status = 'active'
      and m.passcode_hash = ${passcodeHash}
      and (m.expires_at is null or m.expires_at > now())
    limit 1
  `;

  return rows[0] ? seedUserFromRow(rows[0] as Parameters<typeof seedUserFromRow>[0]) : null;
}

export async function getEvaStoredState(userId: EvaUserId): Promise<EvaStoredStudioState> {
  if (!isEvaPersistenceConfigured()) {
    if (!isLocalFilePersistenceAllowed()) return normalizeStoredState(null);

    const store = await readLocalStore();
    const state = normalizeStoredState(store.userProgress[userId]);
    state.teacherNotes = teacherNotesForLearner(store, userId);
    return state;
  }

  const sql = sqlClient();
  const [rows, noteRows] = await Promise.all([
    sql`
      select state_json
      from eva_user_progress
      where user_id = ${userId} and product_id = ${productId}
      limit 1
    `,
    sql`
      select page_id, note
      from eva_teacher_notes
      where learner_user_id = ${userId} and product_id = ${productId}
    `,
  ]);

  const state = normalizeStoredState((rows[0]?.state_json as Partial<EvaStoredStudioState> | undefined) ?? null);
  for (const row of noteRows as unknown as Array<{ page_id: string; note: string }>) {
    state.teacherNotes[row.page_id] = row.note;
  }

  return state;
}

export async function getEvaStoredSnapshots(): Promise<Record<EvaUserId, EvaStoredStudioState>> {
  const entries = await Promise.all(evaSeedUsers.map(async (user) => [user.id, await getEvaStoredState(user.id)] as const));
  return Object.fromEntries(entries) as Record<EvaUserId, EvaStoredStudioState>;
}

export async function saveEvaStoredState(userId: EvaUserId, state: Partial<EvaStoredStudioState>) {
  const normalized = normalizeStoredState(state);

  if (!isEvaPersistenceConfigured()) {
    if (!isLocalFilePersistenceAllowed()) throw new Error("Eva persistence is not configured.");

    return updateLocalStore((store) => {
      const updatedAt = new Date().toISOString();
      const teacherNotes = teacherNotesForLearner(store, userId);
      store.userProgress[userId] = normalizeStoredState({ ...normalized, teacherNotes });
      store.userResponses = [
        ...store.userResponses.filter((entry) => entry.userId !== userId),
        ...responsesFromState(userId, normalized, updatedAt),
      ];
      store.reviewQueue = [
        ...store.reviewQueue.filter((entry) => entry.userId !== userId),
        ...reviewQueueFromState(userId, normalized, updatedAt),
      ];
      return store.userProgress[userId];
    });
  }

  const sql = sqlClient();

  await sql.begin(async (tx) => {
    await tx`
      insert into eva_user_progress (
        user_id,
        product_id,
        active_stack_id,
        active_chapter_id,
        active_page_id,
        active_lane_id,
        active_premium_tab,
        state_json,
        updated_at
      )
      values (
        ${userId},
        ${productId},
        ${normalized.activeStackId ?? null},
        ${normalized.activeChapterId ?? null},
        ${normalized.activePageId ?? null},
        ${normalized.activeLaneId ?? null},
        ${normalized.activePremiumTab ?? null},
        ${tx.json(normalized)},
        now()
      )
      on conflict (user_id, product_id) do update set
        active_stack_id = excluded.active_stack_id,
        active_chapter_id = excluded.active_chapter_id,
        active_page_id = excluded.active_page_id,
        active_lane_id = excluded.active_lane_id,
        active_premium_tab = excluded.active_premium_tab,
        state_json = excluded.state_json,
        updated_at = now()
    `;

    await tx`
      delete from eva_review_queue
      where user_id = ${userId} and product_id = ${productId}
    `;

    const reviewEntries = Object.entries(normalized.reviewQueue).filter(([, queued]) => queued);
    for (const [itemId] of reviewEntries) {
      await tx`
        insert into eva_review_queue (user_id, product_id, item_id, status, updated_at)
        values (${userId}, ${productId}, ${itemId}, 'open', now())
        on conflict (user_id, product_id, item_id) do update set
          status = 'open',
          updated_at = now()
      `;
    }

    const responseEntries = [
      ...Object.entries(normalized.quizAnswers).map(([key, value]) => [`quiz:${key}`, { answerIndex: value }] as const),
      ...Object.entries(normalized.examAnswers).map(([key, value]) => [`exam:${key}`, { answerIndex: value }] as const),
      ...Object.entries(normalized.writingDrafts)
        .filter(([, value]) => value.trim())
        .map(([key, value]) => [`draft:${key}`, { text: value }] as const),
    ];

    for (const [responseKey, responseJson] of responseEntries) {
      await tx`
        insert into eva_user_responses (user_id, product_id, response_key, response_json, updated_at)
        values (${userId}, ${productId}, ${responseKey}, ${tx.json(responseJson)}, now())
        on conflict (user_id, product_id, response_key) do update set
          response_json = excluded.response_json,
          updated_at = now()
      `;
    }
  });

  return normalized;
}

export async function saveEvaTeacherNote(teacherUserId: EvaUserId, learnerUserId: EvaUserId, pageId: string, note: string) {
  if (!isEvaPersistenceConfigured()) {
    if (!isLocalFilePersistenceAllowed()) throw new Error("Eva persistence is not configured.");

    await updateLocalStore((store) => {
      const cleaned = note.trim();
      store.teacherNotes = store.teacherNotes.filter(
        (entry) =>
          !(
            entry.teacherUserId === teacherUserId &&
            entry.learnerUserId === learnerUserId &&
            entry.productId === productId &&
            entry.pageId === pageId
          ),
      );

      if (cleaned) {
        store.teacherNotes.push({
          teacherUserId,
          learnerUserId,
          productId,
          pageId,
          note,
          updatedAt: new Date().toISOString(),
        });
      }

      const learnerState = normalizeStoredState(store.userProgress[learnerUserId]);
      if (cleaned) {
        learnerState.teacherNotes[pageId] = note;
      } else {
        delete learnerState.teacherNotes[pageId];
      }
      store.userProgress[learnerUserId] = learnerState;
    });
    return;
  }

  const sql = sqlClient();
  if (!note.trim()) {
    await sql`
      delete from eva_teacher_notes
      where teacher_user_id = ${teacherUserId}
        and learner_user_id = ${learnerUserId}
        and product_id = ${productId}
        and page_id = ${pageId}
    `;
    return;
  }

  await sql`
    insert into eva_teacher_notes (teacher_user_id, learner_user_id, product_id, page_id, note, updated_at)
    values (${teacherUserId}, ${learnerUserId}, ${productId}, ${pageId}, ${note}, now())
    on conflict (teacher_user_id, learner_user_id, product_id, page_id) do update set
      note = excluded.note,
      updated_at = now()
  `;
}
