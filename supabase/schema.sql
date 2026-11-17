create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

alter table public.availability_slots
  drop constraint if exists availability_slots_slot_date_check;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  service_type text not null,
  hours integer not null check (hours between 1 and 8),
  preferred_date date not null,
  preferred_time time not null,
  slot_id uuid not null references public.availability_slots (id) on delete restrict,
  notes text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'refunded')),
  check (char_length(customer_name) between 2 and 120),
  check (char_length(email) between 5 and 254),
  check (char_length(phone) between 5 and 40),
  check (char_length(address) between 3 and 300),
  check (char_length(service_type) between 2 and 100),
  check (char_length(notes) <= 1000)
);

create unique index if not exists bookings_one_active_booking_per_slot
  on public.bookings (slot_id)
  where status <> 'cancelled';

create index if not exists bookings_preferred_date_idx
  on public.bookings (preferred_date, preferred_time);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.create_booking(
  p_slot_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_service_type text,
  p_hours integer,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slot_date date;
  v_slot_time time;
  v_booking_id uuid;
  v_created_at timestamptz;
begin
  if char_length(trim(p_customer_name)) not between 2 and 120
    or char_length(trim(p_email)) not between 5 and 254
    or p_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or char_length(trim(p_phone)) not between 5 and 40
    or char_length(trim(p_address)) not between 3 and 300
    or char_length(trim(p_service_type)) not between 2 and 100
    or p_hours not between 1 and 8
    or char_length(coalesce(p_notes, '')) > 1000
  then
    raise exception using errcode = '22023', message = 'Invalid booking details';
  end if;

  update public.availability_slots
  set is_available = false
  where id = p_slot_id
    and is_available
    and slot_date >= current_date
  returning slot_date, slot_time into v_slot_date, v_slot_time;

  if not found then
    raise exception using errcode = 'P0001', message = 'Selected appointment is no longer available';
  end if;

  insert into public.bookings (
    customer_name,
    email,
    phone,
    address,
    service_type,
    hours,
    preferred_date,
    preferred_time,
    slot_id,
    notes
  )
  values (
    trim(p_customer_name),
    trim(p_email),
    trim(p_phone),
    trim(p_address),
    trim(p_service_type),
    p_hours,
    v_slot_date,
    v_slot_time,
    p_slot_id,
    coalesce(p_notes, '')
  )
  returning id, created_at into v_booking_id, v_created_at;

  return jsonb_build_object(
    'id', v_booking_id,
    'created_at', v_created_at,
    'customer_name', trim(p_customer_name),
    'email', trim(p_email),
    'phone', trim(p_phone),
    'address', trim(p_address),
    'service_type', trim(p_service_type),
    'hours', p_hours,
    'preferred_date', v_slot_date,
    'preferred_time', v_slot_time,
    'slot_id', p_slot_id,
    'notes', coalesce(p_notes, ''),
    'status', 'pending',
    'payment_status', 'pending'
  );
end;
$$;

revoke all on function public.create_booking(uuid, text, text, text, text, text, integer, text) from public;
grant execute on function public.create_booking(uuid, text, text, text, text, text, integer, text) to anon, authenticated;

create or replace function public.admin_reschedule_booking(
  p_booking_id uuid,
  p_slot_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old_slot_id uuid;
  v_new_date date;
  v_new_time time;
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  select slot_id into v_old_slot_id
  from public.bookings
  where id = p_booking_id
    and status in ('pending', 'confirmed')
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'Booking cannot be rescheduled';
  end if;

  if v_old_slot_id = p_slot_id then
    return;
  end if;

  select slot_date, slot_time into v_new_date, v_new_time
  from public.availability_slots
  where id = p_slot_id
    and is_available
    and slot_date >= current_date
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'Selected appointment is no longer available';
  end if;

  update public.availability_slots
  set is_available = false
  where id = p_slot_id and is_available;

  if not found then
    raise exception using errcode = 'P0001', message = 'Selected appointment is no longer available';
  end if;

  update public.bookings
  set slot_id = p_slot_id,
      preferred_date = v_new_date,
      preferred_time = v_new_time
  where id = p_booking_id;

  update public.availability_slots
  set is_available = true
  where id = v_old_slot_id;
end;
$$;

revoke all on function public.admin_reschedule_booking(uuid, uuid) from public;
grant execute on function public.admin_reschedule_booking(uuid, uuid) to authenticated;

create or replace function public.release_cancelled_booking_slot()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    update public.availability_slots
    set is_available = true
    where id = new.slot_id;
  end if;

  return new;
end;
$$;

drop trigger if exists release_cancelled_booking_slot on public.bookings;
create trigger release_cancelled_booking_slot
after update of status on public.bookings
for each row
execute function public.release_cancelled_booking_slot();

alter table public.admin_users enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;

drop policy if exists admin_users_read_own_membership on public.admin_users;
create policy admin_users_read_own_membership
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists public_read_available_future_slots on public.availability_slots;
create policy public_read_available_future_slots
  on public.availability_slots for select to anon, authenticated
  using (is_available and slot_date >= current_date);

drop policy if exists admins_manage_availability on public.availability_slots;
create policy admins_manage_availability
  on public.availability_slots for all to authenticated
  using ((select public.is_admin()))
  with check (
    (select public.is_admin())
    and slot_date >= current_date
  );

drop policy if exists admins_read_bookings on public.bookings;
create policy admins_read_bookings
  on public.bookings for select to authenticated
  using ((select public.is_admin()));

drop policy if exists admins_update_bookings on public.bookings;
create policy admins_update_bookings
  on public.bookings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.availability_slots to authenticated;
grant select on public.availability_slots to anon;
grant select, update on public.bookings to authenticated;
