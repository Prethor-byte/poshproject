-- Insert sample browser profiles
insert into public.browser_profiles (user_agent, viewport, timezone)
values 
    (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        '{"width": 1920, "height": 1080}'::jsonb,
        'America/New_York'
    ),
    (
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        '{"width": 1440, "height": 900}'::jsonb,
        'America/Los_Angeles'
    ),
    (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
        '{"width": 1366, "height": 768}'::jsonb,
        'America/Chicago'
    );

-- Create function to rotate browser profiles
create or replace function get_next_browser_profile(p_user_id uuid)
returns uuid
language plpgsql
as $$
declare
    profile_id uuid;
begin
    select id into profile_id
    from browser_profiles
    where (user_id is null or user_id = p_user_id)
    order by last_used nulls first, success_rate desc nulls last
    limit 1;

    if found then
        update browser_profiles
        set last_used = now()
        where id = profile_id;
    end if;

    return profile_id;
end;
$$;