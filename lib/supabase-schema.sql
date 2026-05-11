-- =====================================================
-- PITPET HOTEL — DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =====================================================
-- TABLE: tutors
-- =====================================================
create table if not exists tutors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  emergency_contact text,
  created_at  timestamptz default now()
);

-- =====================================================
-- TABLE: pets
-- =====================================================
create table if not exists pets (
  id                   uuid primary key default gen_random_uuid(),
  tutor_id             uuid references tutors(id) on delete cascade,
  name                 text not null,
  breed                text,
  birth_date           date,
  weight               numeric(5,2),
  gender               text check (gender in ('male', 'female')),
  castrated            boolean default false,
  temperament          text,
  energy_level         text check (energy_level in ('low', 'medium', 'high')),
  gets_along_dogs      boolean default true,
  gets_along_humans    boolean default true,
  separation_anxiety   boolean default false,
  destructive_behavior boolean default false,
  food_aggression      boolean default false,
  has_bitten           boolean default false,
  created_at           timestamptz default now()
);

-- =====================================================
-- TABLE: parasite_control
-- =====================================================
create table if not exists parasite_control (
  id                  uuid primary key default gen_random_uuid(),
  pet_id              uuid references pets(id) on delete cascade unique,
  last_deworming      date,
  flea_tick_active    boolean default false,
  last_antiparasitic  date,
  long_nails          boolean default false,
  ear_issues          boolean default false,
  skin_issues         boolean default false
);

-- =====================================================
-- TABLE: vaccines
-- =====================================================
create table if not exists vaccines (
  id          uuid primary key default gen_random_uuid(),
  pet_id      uuid references pets(id) on delete cascade,
  type        text not null check (type in ('rabies', 'v8v10', 'kennel_cough')),
  applied_at  date,
  expires_at  date,
  proof_url   text,
  status      text check (status in ('valid', 'expiring_soon', 'expired', 'missing'))
);

-- =====================================================
-- TABLE: assessments
-- =====================================================
create table if not exists assessments (
  id                uuid primary key default gen_random_uuid(),
  pet_id            uuid references pets(id) on delete cascade,
  approved          boolean default false,
  status            text check (status in ('APPROVED', 'APPROVED_WITH_WARNINGS', 'BLOCKED')),
  risk_level        text check (risk_level in ('low', 'medium', 'high', 'critical')),
  sanitary_notes    text[] default '{}',
  operational_notes text[] default '{}',
  sanitary_score    integer default 100,
  created_at        timestamptz default now()
);

-- =====================================================
-- TABLE: required_services
-- =====================================================
create table if not exists required_services (
  id              uuid primary key default gen_random_uuid(),
  assessment_id   uuid references assessments(id) on delete cascade,
  service_type    text not null,
  mandatory       boolean default false,
  reason          text,
  price           numeric(8,2)
);

-- =====================================================
-- TABLE: uploaded_documents
-- =====================================================
create table if not exists uploaded_documents (
  id        uuid primary key default gen_random_uuid(),
  pet_id    uuid references pets(id) on delete cascade,
  type      text not null,
  file_url  text not null
);

-- =====================================================
-- TABLE: bookings
-- =====================================================
create table if not exists bookings (
  id                uuid primary key default gen_random_uuid(),
  check_in          date not null,
  check_out         date not null,
  nights            integer not null,
  weight_tier_index integer not null,
  weight_label      text not null,
  subtotal          numeric(10,2) not null,
  status            text not null default 'pending_form'
                    check (status in ('pending_form', 'form_sent', 'submitted', 'confirmed')),
  precheckin_token  text unique,
  tutor_id          uuid references tutors(id),
  assessment_id     uuid references assessments(id),
  created_at        timestamptz default now()
);

-- =====================================================
-- STORAGE BUCKET: vaccine-proofs
-- =====================================================
-- Run in Supabase Dashboard > Storage:
-- Create bucket named "vaccine-proofs"
-- Keep "Public bucket" DISABLED (private) — vaccine documents are sensitive health data.
-- The app uses createSignedUrl() with a 10-minute expiry to let admins view files safely.
-- Add this RLS policy to allow server-side uploads:
--
-- create policy "Allow authenticated uploads"
--   on storage.objects for insert
--   with check (bucket_id = 'vaccine-proofs');

-- =====================================================
-- ROW LEVEL SECURITY (optional — for public submissions)
-- Uncomment if you want public insert access:
-- =====================================================
-- alter table tutors enable row level security;
-- alter table pets enable row level security;
-- alter table vaccines enable row level security;
-- alter table assessments enable row level security;
-- alter table required_services enable row level security;
-- alter table uploaded_documents enable row level security;
-- alter table parasite_control enable row level security;
-- alter table bookings enable row level security;
--
-- create policy "Allow public insert" on tutors for insert with check (true);
-- create policy "Allow public insert" on pets for insert with check (true);
-- create policy "Allow public insert" on vaccines for insert with check (true);
-- create policy "Allow public insert" on assessments for insert with check (true);
-- create policy "Allow public insert" on required_services for insert with check (true);
-- create policy "Allow public insert" on uploaded_documents for insert with check (true);
-- create policy "Allow public insert" on parasite_control for insert with check (true);
--
-- create policy "Allow public select own" on pets for select using (true);

-- =====================================================
-- VIEWS: admin helpers
-- =====================================================
create or replace view pets_with_assessment as
select
  p.*,
  t.name as tutor_name,
  t.phone as tutor_phone,
  t.email as tutor_email,
  a.status as assessment_status,
  a.risk_level,
  a.sanitary_score,
  a.created_at as assessed_at
from pets p
left join tutors t on t.id = p.tutor_id
left join assessments a on a.pet_id = p.id;

create or replace view vaccine_alerts as
select
  v.*,
  p.name as pet_name,
  t.name as tutor_name,
  t.phone as tutor_phone
from vaccines v
join pets p on p.id = v.pet_id
join tutors t on t.id = p.tutor_id
where v.status in ('expired', 'expiring_soon', 'missing');
