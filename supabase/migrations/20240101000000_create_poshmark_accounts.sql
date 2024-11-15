-- Create a secure table for storing Poshmark account credentials
create table if not exists public.poshmark_accounts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    email text not null,
    -- We'll store an encrypted version of the password
    encrypted_password text not null,
    username text,
    last_login timestamp with time zone,
    cookies jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.poshmark_accounts enable row level security;

-- Create policy to only allow users to see their own accounts
create policy "Users can only see their own Poshmark accounts"
    on public.poshmark_accounts
    for all
    using (auth.uid() = user_id);

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
    on public.poshmark_accounts
    for each row
    execute function public.handle_updated_at();
