-- Supabase RLS for meeting room app
-- Assumption: tables already exist and app users access them via Supabase Auth

alter table public.rooms
  add column if not exists created_by uuid default auth.uid();

alter table public.reservations
  add column if not exists created_by uuid default auth.uid();

alter table public.participants
  add column if not exists created_by uuid default auth.uid();

alter table public.equipment
  add column if not exists created_by uuid default auth.uid();

alter table public.rooms
  alter column created_by set default auth.uid();

alter table public.reservations
  alter column created_by set default auth.uid();

alter table public.participants
  alter column created_by set default auth.uid();

alter table public.equipment
  alter column created_by set default auth.uid();

create index if not exists idx_rooms_created_by
  on public.rooms (created_by);

create index if not exists idx_reservations_created_by
  on public.reservations (created_by);

create index if not exists idx_participants_created_by
  on public.participants (created_by);

create index if not exists idx_equipment_created_by
  on public.equipment (created_by);

alter table public.rooms enable row level security;
alter table public.reservations enable row level security;
alter table public.participants enable row level security;
alter table public.equipment enable row level security;

drop policy if exists "rooms_select_own" on public.rooms;
create policy "rooms_select_own"
on public.rooms
for select
to authenticated
using (created_by = auth.uid());

drop policy if exists "rooms_insert_own" on public.rooms;
create policy "rooms_insert_own"
on public.rooms
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "rooms_update_own" on public.rooms;
create policy "rooms_update_own"
on public.rooms
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "rooms_delete_own" on public.rooms;
create policy "rooms_delete_own"
on public.rooms
for delete
to authenticated
using (created_by = auth.uid());

drop policy if exists "reservations_select_own" on public.reservations;
create policy "reservations_select_own"
on public.reservations
for select
to authenticated
using (created_by = auth.uid());

drop policy if exists "reservations_insert_own" on public.reservations;
create policy "reservations_insert_own"
on public.reservations
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "reservations_update_own" on public.reservations;
create policy "reservations_update_own"
on public.reservations
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "reservations_delete_own" on public.reservations;
create policy "reservations_delete_own"
on public.reservations
for delete
to authenticated
using (created_by = auth.uid());

drop policy if exists "participants_select_own" on public.participants;
create policy "participants_select_own"
on public.participants
for select
to authenticated
using (created_by = auth.uid());

drop policy if exists "participants_insert_own" on public.participants;
create policy "participants_insert_own"
on public.participants
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "participants_update_own" on public.participants;
create policy "participants_update_own"
on public.participants
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "participants_delete_own" on public.participants;
create policy "participants_delete_own"
on public.participants
for delete
to authenticated
using (created_by = auth.uid());

drop policy if exists "equipment_select_own" on public.equipment;
create policy "equipment_select_own"
on public.equipment
for select
to authenticated
using (created_by = auth.uid());

drop policy if exists "equipment_insert_own" on public.equipment;
create policy "equipment_insert_own"
on public.equipment
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "equipment_update_own" on public.equipment;
create policy "equipment_update_own"
on public.equipment
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "equipment_delete_own" on public.equipment;
create policy "equipment_delete_own"
on public.equipment
for delete
to authenticated
using (created_by = auth.uid());
