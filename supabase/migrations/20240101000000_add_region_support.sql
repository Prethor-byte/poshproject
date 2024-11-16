-- Add region support to poshmark_sessions table
ALTER TABLE poshmark_sessions
ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'US' CHECK (region IN ('US', 'CA'));

-- Add region-specific proxy configuration table
CREATE TABLE IF NOT EXISTS proxy_configs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    region text NOT NULL CHECK (region IN ('US', 'CA')),
    hostname text NOT NULL,
    port integer NOT NULL CHECK (port > 0 AND port < 65536),
    username text,
    password text,
    is_active boolean DEFAULT true,
    last_used timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(hostname, port)
);

-- Add proxy usage statistics table
CREATE TABLE IF NOT EXISTS proxy_stats (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    proxy_id uuid REFERENCES proxy_configs(id) ON DELETE CASCADE,
    region text NOT NULL CHECK (region IN ('US', 'CA')),
    success_count integer DEFAULT 0,
    failure_count integer DEFAULT 0,
    last_success timestamp with time zone,
    last_failure timestamp with time zone,
    average_response_time double precision,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE proxy_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE proxy_stats ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to view proxy configurations
CREATE POLICY proxy_configs_view_policy ON proxy_configs
    FOR SELECT
    TO authenticated
    USING (true);

-- Only allow administrators to modify proxy configurations
CREATE POLICY proxy_configs_modify_policy ON proxy_configs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- Allow viewing proxy stats for authenticated users
CREATE POLICY proxy_stats_view_policy ON proxy_stats
    FOR SELECT
    TO authenticated
    USING (true);

-- Only allow the system to modify proxy stats
CREATE POLICY proxy_stats_modify_policy ON proxy_stats
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- Add function to update proxy stats
CREATE OR REPLACE FUNCTION update_proxy_stats(
    p_proxy_id uuid,
    p_region text,
    p_success boolean,
    p_response_time double precision
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO proxy_stats (proxy_id, region)
    VALUES (p_proxy_id, p_region)
    ON CONFLICT (proxy_id) DO UPDATE
    SET
        success_count = CASE WHEN p_success THEN proxy_stats.success_count + 1 ELSE proxy_stats.success_count END,
        failure_count = CASE WHEN NOT p_success THEN proxy_stats.failure_count + 1 ELSE proxy_stats.failure_count END,
        last_success = CASE WHEN p_success THEN now() ELSE proxy_stats.last_success END,
        last_failure = CASE WHEN NOT p_success THEN now() ELSE proxy_stats.last_failure END,
        average_response_time = CASE
            WHEN p_response_time IS NOT NULL THEN
                (COALESCE(proxy_stats.average_response_time, 0) * COALESCE(proxy_stats.success_count, 0) + p_response_time) /
                (COALESCE(proxy_stats.success_count, 0) + 1)
            ELSE proxy_stats.average_response_time
        END,
        updated_at = now();
END;
$$;
