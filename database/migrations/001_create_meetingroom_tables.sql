-- Supabase / PostgreSQL schema for meeting room app

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid(),
  room_code text not null unique,
  name text not null,
  floor text,
  capacity integer not null default 1 check (capacity > 0),
  hourly_rate integer not null default 0 check (hourly_rate >= 0),
  status text not null default 'available'
    check (status in ('available', 'occupied', 'maintenance')),
  location_note text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid(),
  room_id uuid not null references public.rooms(id) on delete restrict,
  title text not null,
  organizer_name text not null,
  organizer_email text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  attendee_count integer not null default 1 check (attendee_count > 0),
  status text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price integer not null default 0 check (total_price >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  name text not null,
  email text,
  company_name text,
  role text not null default 'guest'
    check (role in ('host', 'guest', 'approver')),
  attendance_status text not null default 'invited'
    check (attendance_status in ('invited', 'accepted', 'declined', 'checked_in')),
  created_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null,
  category text not null,
  quantity integer not null default 1 check (quantity > 0),
  status text not null default 'available'
    check (status in ('available', 'in_use', 'maintenance')),
  is_portable boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reservations_room_id_start_at
  on public.reservations (room_id, start_at);

create index if not exists idx_reservations_status
  on public.reservations (status);

create index if not exists idx_participants_reservation_id
  on public.participants (reservation_id);

create index if not exists idx_equipment_room_id
  on public.equipment (room_id);

drop trigger if exists set_rooms_updated_at on public.rooms;
create trigger set_rooms_updated_at
before update on public.rooms
for each row
execute function public.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row
execute function public.set_updated_at();

drop trigger if exists set_equipment_updated_at on public.equipment;
create trigger set_equipment_updated_at
before update on public.equipment
for each row
execute function public.set_updated_at();
