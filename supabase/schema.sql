create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  full_name text not null,
  email text unique not null,
  created_at timestamp with time zone default now()
);

create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  genre text not null,
  isbn text unique,
  cover_url text,
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists loans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  book_id uuid references books(id) not null,
  loan_date date not null default current_date,
  due_date date not null,
  status text check (status in ('active', 'returned', 'overdue')) default 'active',
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;
create policy "Profiles are viewable by the owner" on profiles for select using (auth.uid() = id);
create policy "Profiles are insertable by the owner" on profiles for insert with check (auth.uid() = id);
create policy "Profiles are updatable by the owner" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

alter table books enable row level security;
create policy "Books are viewable by all" on books for select using (true);

alter table loans enable row level security;
create policy "Users can view own loans" on loans for select using (auth.uid() = user_id);
create policy "Users can create own loans" on loans for insert with check (auth.uid() = user_id);
create policy "Users can update own loans" on loans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
