-- ============================================================
-- PUC Student Portal — Full Supabase Migration (Idempotent)
-- Run this in Supabase SQL Editor (all at once)
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. LOOKUP TABLES
-- ============================================================

create table if not exists public.departments (
  code text primary key,
  name text not null,
  is_active boolean default false
);

create table if not exists public.semesters (
  semester int primary key
);

create table if not exists public.sections (
  section char(1) primary key
);

create table if not exists public.admins (
  id bigint generated always as identity primary key,
  name text not null,
  role text not null,
  phone text not null,
  whatsapp_url text not null,
  created_at timestamptz default now()
);

create table if not exists public.class_reps (
  id bigint generated always as identity primary key,
  semester int not null references public.semesters(semester),
  section char(1) not null references public.sections(section),
  name text not null,
  phone text not null,
  whatsapp_url text not null,
  unique (semester, section)
);

-- ============================================================
-- 2. COURSES & ASSESSMENT COMPONENTS
-- ============================================================

create table if not exists public.courses (
  course_id text primary key,
  code text not null,
  name text not null,
  semester int not null references public.semesters(semester),
  credits numeric(3,2) not null,
  instructor text default '—'
);

create table if not exists public.course_assessment_components (
  id bigint generated always as identity primary key,
  course_id text not null references public.courses(course_id) on delete cascade,
  component_key text not null,
  label text not null,
  max_marks numeric(5,2) not null,
  unique (course_id, component_key)
);

-- ============================================================
-- 3. PROFILES (linked to Supabase Auth)
-- ============================================================

create table if not exists public.profiles (
  student_id text primary key,
  user_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  semester int not null references public.semesters(semester),
  section char(1) not null references public.sections(section),
  department text not null references public.departments(code),
  batch int not null,
  linked_gmail text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_student_id text;
begin
  -- Check if there is an existing student profile with this linked gmail
  select student_id into v_student_id
  from public.profiles
  where linked_gmail = new.email;

  if v_student_id is not null then
    -- Link the existing profile to this Supabase user
    update public.profiles
    set user_id = new.id
    where student_id = v_student_id;
  else
    -- If no existing profile with this Gmail, and metadata has student_id, insert new profile
    if new.raw_user_meta_data->>'student_id' is not null then
      insert into public.profiles (student_id, user_id, name, phone, semester, section, department, batch, linked_gmail)
      values (
        new.raw_user_meta_data->>'student_id',
        new.id,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'phone',
        (new.raw_user_meta_data->>'semester')::int,
        new.raw_user_meta_data->>'section',
        new.raw_user_meta_data->>'department',
        50 - (new.raw_user_meta_data->>'semester')::int,
        new.email
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 4. USER DATA TABLES
-- ============================================================

create table if not exists public.grades (
  id bigint generated always as identity primary key,
  student_id text not null references public.profiles(student_id) on delete cascade,
  course_id text not null references public.courses(course_id) on delete cascade,
  component_key text not null,
  marks numeric(5,2) not null default 0,
  unique (student_id, course_id, component_key)
);

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  student_id text not null references public.profiles(student_id) on delete cascade,
  type text not null check (type in ('assignment', 'grade', 'announcement', 'message')),
  title text not null,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  student_id text not null references public.profiles(student_id) on delete cascade,
  sender text not null,
  subject text not null,
  preview text not null,
  body text not null default '',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 5. SCHEDULES
-- ============================================================

create table if not exists public.schedules (
  id bigint generated always as identity primary key,
  semester int not null references public.semesters(semester),
  section char(1) not null references public.sections(section),
  day text not null,
  start_time text not null,
  end_time text not null,
  duration text,
  course_code text not null,
  course_name text not null,
  room text not null,
  instructor text not null,
  color text
);

create index if not exists idx_schedules_sem_section on public.schedules(semester, section);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

alter table public.departments enable row level security;
alter table public.semesters enable row level security;
alter table public.sections enable row level security;
alter table public.admins enable row level security;
alter table public.class_reps enable row level security;
alter table public.courses enable row level security;
alter table public.course_assessment_components enable row level security;
alter table public.profiles enable row level security;
alter table public.grades enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;
alter table public.schedules enable row level security;

do $$
begin
  -- Drop old authenticated read policies if they exist, to prevent conflicts
  drop policy if exists "authenticated can read" on public.departments;
  drop policy if exists "authenticated can read" on public.semesters;
  drop policy if exists "authenticated can read" on public.sections;
  drop policy if exists "authenticated can read" on public.courses;
  drop policy if exists "authenticated can read" on public.course_assessment_components;
  drop policy if exists "authenticated can read" on public.schedules;
  drop policy if exists "authenticated can read" on public.admins;
  drop policy if exists "authenticated can read" on public.class_reps;

  -- Create public read policies
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'departments') then
    create policy "anyone can read" on public.departments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'semesters') then
    create policy "anyone can read" on public.semesters for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'sections') then
    create policy "anyone can read" on public.sections for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'courses') then
    create policy "anyone can read" on public.courses for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'course_assessment_components') then
    create policy "anyone can read" on public.course_assessment_components for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'schedules') then
    create policy "anyone can read" on public.schedules for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'admins') then
    create policy "anyone can read" on public.admins for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'anyone can read' and tablename = 'class_reps') then
    create policy "anyone can read" on public.class_reps for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users read own profile' and tablename = 'profiles') then
    create policy "users read own profile" on public.profiles for select using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users update own profile' and tablename = 'profiles') then
    create policy "users update own profile" on public.profiles for update using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users manage own grades' and tablename = 'grades') then
    create policy "users manage own grades" on public.grades for all using (student_id = (select student_id from public.profiles where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users insert own grades' and tablename = 'grades') then
    create policy "users insert own grades" on public.grades for insert with check (student_id = (select student_id from public.profiles where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users read own notifications' and tablename = 'notifications') then
    create policy "users read own notifications" on public.notifications for select using (student_id = (select student_id from public.profiles where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users read own messages' and tablename = 'messages') then
    create policy "users read own messages" on public.messages for select using (student_id = (select student_id from public.profiles where user_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'users update own messages' and tablename = 'messages') then
    create policy "users update own messages" on public.messages for update using (student_id = (select student_id from public.profiles where user_id = auth.uid()));
  end if;
end $$;

-- ============================================================
-- 7. SEED DATA
-- ============================================================

-- Departments
insert into public.departments (code, name, is_active) values
  ('CSE', 'Computer Science & Engineering', true),
  ('EEE', 'Electrical & Electronic Engineering', false),
  ('LLB', 'Bachelor of Laws', false),
  ('Economics', 'Department of Economics', false)
on conflict (code) do nothing;

-- Semesters
insert into public.semesters (semester) values (1), (2), (3), (4), (5), (6), (7), (8)
on conflict (semester) do nothing;

-- Sections
insert into public.sections (section) values ('A'), ('B'), ('C'), ('D'), ('E'), ('F')
on conflict (section) do nothing;

-- Admin
insert into public.admins (id, name, role, phone, whatsapp_url)
overriding system value
values
  (1, 'Anurag Barua Ador', 'B.Sc. in CSE ( PUC )', '+880 1568-031212', 'https://wa.me/8801568031212')
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  phone = excluded.phone,
  whatsapp_url = excluded.whatsapp_url;

-- Class Reps
insert into public.class_reps (id, semester, section, name, phone, whatsapp_url)
overriding system value
values
  (1, 2, 'A', 'Avijit Chakraborty', '+880 1816-360078', 'https://wa.me/8801816360078')
on conflict (id) do update set
  semester = excluded.semester,
  section = excluded.section,
  name = excluded.name,
  phone = excluded.phone,
  whatsapp_url = excluded.whatsapp_url;

-- ============================================================
-- 8. CUSTOM UTILITY FUNCTIONS / RPCS
-- ============================================================

-- Re-define update_student_profile to support updating semester and section
DROP FUNCTION IF EXISTS public.update_student_profile(text, text, text, text);

CREATE OR REPLACE FUNCTION public.update_student_profile(
  p_student_id text,
  p_name text default null,
  p_phone text default null,
  p_linked_gmail text default null,
  p_semester int default null,
  p_section text default null
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    name = COALESCE(p_name, name),
    phone = COALESCE(p_phone, phone),
    linked_gmail = COALESCE(p_linked_gmail, linked_gmail),
    semester = COALESCE(p_semester, semester),
    section = COALESCE(p_section, section),
    batch = CASE WHEN p_semester IS NOT NULL THEN 50 - p_semester ELSE batch END
  WHERE student_id = p_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

