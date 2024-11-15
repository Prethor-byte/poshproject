-- Drop the old table if it exists
drop table if exists public.poshmark_accounts;

-- Create a new table for Poshmark sessions
create table if not exists public.poshmark_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    username text,
    session_data jsonb not null,
    last_verified timestamp with time zone,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.poshmark_sessions enable row level security;

-- Create policy to only allow users to see their own sessions
create policy "Users can only see their own Poshmark sessions"
    on public.poshmark_sessions
    for all
    using (auth.uid() = user_id);

-- Create index for faster lookups
create index idx_poshmark_sessions_user_id on public.poshmark_sessions(user_id);

-- Create function to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update
    on public.poshmark_sessions
    for each row
    execute function public.handle_updated_at();
