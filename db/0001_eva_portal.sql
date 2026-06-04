-- Eva Digital Booklet production schema.
-- Designed for Neon, Supabase, Vercel Postgres, or any standard Postgres database.

create table if not exists eva_users (
  id text primary key,
  display_name text not null,
  role text not null check (role in ('owner', 'premium-member', 'premium-learner')),
  locale text not null check (locale in ('en', 'fa')),
  can_teach boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eva_memberships (
  id bigserial primary key,
  user_id text not null references eva_users(id) on delete cascade,
  product_id text not null default 'eva-digital-booklet',
  status text not null check (status in ('active', 'paused', 'revoked')),
  price_paid numeric(10,2) not null default 4.99,
  currency text not null default 'USD',
  passcode_hash text unique,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists eva_source_documents (
  id text primary key,
  title text not null,
  privacy text not null default 'private',
  imported_pages integer not null default 0,
  text_characters integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eva_chapters (
  id text primary key,
  source_document_id text not null references eva_source_documents(id) on delete cascade,
  title text not null,
  page_ids jsonb not null default '[]'::jsonb,
  skill_tags jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eva_sections (
  id text primary key,
  chapter_id text not null references eva_chapters(id) on delete cascade,
  type text not null,
  page_ids jsonb not null default '[]'::jsonb,
  field_count integer not null default 0,
  checkbox_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eva_learning_items (
  id text primary key,
  activity_id text not null,
  title text not null,
  source_page_id text,
  type text not null,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eva_activities (
  id text primary key,
  kind text not null,
  title text not null,
  source_page_ids jsonb not null default '[]'::jsonb,
  skill_targets jsonb not null default '[]'::jsonb,
  level_targets jsonb not null default '[]'::jsonb,
  estimated_minutes integer not null default 0,
  scoring_mode text not null,
  trackable_signals jsonb not null default '[]'::jsonb,
  content_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table eva_activities
  add column if not exists content_json jsonb not null default '{}'::jsonb;

create table if not exists eva_questions (
  id text primary key,
  activity_id text not null,
  track text not null,
  question_type text not null default 'multiple-choice',
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  answer_index integer not null,
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table eva_questions
  add column if not exists question_type text not null default 'multiple-choice',
  add column if not exists options jsonb not null default '[]'::jsonb,
  add column if not exists rationale text;

create table if not exists eva_tts_segments (
  id text primary key,
  activity_id text not null,
  source_page_id text,
  title text not null,
  text text not null,
  locale text not null default 'en',
  voice_hint text not null,
  speed_default numeric(4,2) not null default 0.86,
  pronunciation_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eva_user_progress (
  user_id text not null references eva_users(id) on delete cascade,
  product_id text not null default 'eva-digital-booklet',
  active_stack_id text,
  active_chapter_id text,
  active_page_id text,
  active_lane_id text,
  active_premium_tab text,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists eva_user_responses (
  id bigserial primary key,
  user_id text not null references eva_users(id) on delete cascade,
  product_id text not null default 'eva-digital-booklet',
  activity_id text,
  question_id text,
  response_key text not null,
  response_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, response_key)
);

create table if not exists eva_review_queue (
  user_id text not null references eva_users(id) on delete cascade,
  product_id text not null default 'eva-digital-booklet',
  item_id text not null,
  reason text,
  priority integer not null default 1,
  status text not null default 'open' check (status in ('open', 'mastered', 'dismissed')),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id, item_id)
);

create table if not exists eva_teacher_notes (
  id bigserial primary key,
  teacher_user_id text not null references eva_users(id) on delete cascade,
  learner_user_id text not null references eva_users(id) on delete cascade,
  product_id text not null default 'eva-digital-booklet',
  page_id text not null,
  note text not null,
  updated_at timestamptz not null default now(),
  unique (teacher_user_id, learner_user_id, product_id, page_id)
);

create index if not exists eva_memberships_status_idx on eva_memberships (product_id, status);
create index if not exists eva_user_progress_updated_idx on eva_user_progress (updated_at desc);
create index if not exists eva_user_responses_user_idx on eva_user_responses (user_id, product_id);
create index if not exists eva_review_queue_user_status_idx on eva_review_queue (user_id, product_id, status);
create index if not exists eva_teacher_notes_learner_idx on eva_teacher_notes (learner_user_id, product_id);

insert into eva_users (id, display_name, role, locale, can_teach)
values
  ('ali', 'Ali', 'owner', 'fa', true),
  ('eva', 'Eva', 'premium-member', 'en', false),
  ('elham', 'Elham', 'premium-learner', 'fa', false)
on conflict (id) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  locale = excluded.locale,
  can_teach = excluded.can_teach,
  updated_at = now();

insert into eva_memberships (user_id, product_id, status, price_paid, currency)
values
  ('ali', 'eva-digital-booklet', 'active', 4.99, 'USD'),
  ('eva', 'eva-digital-booklet', 'active', 4.99, 'USD'),
  ('elham', 'eva-digital-booklet', 'active', 4.99, 'USD')
on conflict (user_id, product_id) do update set
  status = excluded.status,
  price_paid = excluded.price_paid,
  currency = excluded.currency,
  updated_at = now();
