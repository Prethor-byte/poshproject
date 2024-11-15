-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type task_type as enum ('share', 'follow', 'relist');
create type task_status as enum ('pending', 'running', 'completed', 'failed');
create type subscription_status as enum ('free', 'basic', 'pro');

-- Create users table
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    created_at timestamptz default now(),
    last_login timestamptz,
    subscription_status subscription_status default 'free',
    subscription_expires_at timestamptz,
    poshmark_username text unique,
    poshmark_password text,
    settings jsonb default '{}'::jsonb,
    constraint valid_email check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create automation_tasks table
create table if not exists public.automation_tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    task_type task_type not null,
    status task_status default 'pending',
    created_at timestamptz default now(),
    scheduled_for timestamptz,
    completed_at timestamptz,
    settings jsonb default '{}'::jsonb,
    priority integer default 2,
    constraint valid_priority check (priority between 1 and 5)
);

-- Create task_results table
create table if not exists public.task_results (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid references public.automation_tasks(id) on delete cascade,
    status text not null,
    error_message text,
    created_at timestamptz default now(),
    metadata jsonb default '{}'::jsonb
);

-- Create browser_profiles table
create table if not exists public.browser_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    user_agent text not null,
    viewport jsonb not null,
    timezone text not null,
    last_used timestamptz,
    success_rate decimal(5,2),
    constraint valid_success_rate check (success_rate >= 0 and success_rate <= 100)
);

-- Create user_sessions table
create table if not exists public.user_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    poshmark_session_id text,
    cookies jsonb,
    created_at timestamptz default now(),
    expires_at timestamptz,
    last_used timestamptz,
    is_valid boolean default true
);

-- Create rate_limits table
create table if not exists public.rate_limits (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    action_type text not null,
    last_action timestamptz default now(),
    count integer default 0,
    constraint valid_count check (count >= 0)
);

-- Create indexes for better query performance
create index if not exists idx_tasks_user_id on public.automation_tasks(user_id);
create index if not exists idx_tasks_status on public.automation_tasks(status);
create index if not exists idx_tasks_scheduled_for on public.automation_tasks(scheduled_for);
create index if not exists idx_results_task_id on public.task_results(task_id);
create index if not exists idx_sessions_user_id on public.user_sessions(user_id);
create index if not exists idx_rate_limits_user_action on public.rate_limits(user_id, action_type);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.automation_tasks enable row level security;
alter table public.task_results enable row level security;
alter table public.browser_profiles enable row level security;
alter table public.user_sessions enable row level security;
alter table public.rate_limits enable row level security;

-- Create policies
create policy "Users can view own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update own data"
    on public.users for update
    using (auth.uid() = id);

create policy "Users can view own tasks"
    on public.automation_tasks for select
    using (auth.uid() = user_id);

create policy "Users can create own tasks"
    on public.automation_tasks for insert
    with check (auth.uid() = user_id);

create policy "Users can update own tasks"
    on public.automation_tasks for update
    using (auth.uid() = user_id);

create policy "Users can delete own tasks"
    on public.automation_tasks for delete
    using (auth.uid() = user_id);

-- Functions for user management
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.users (id, email)
    values (new.id, new.email);
    return new;
end;
$$;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();