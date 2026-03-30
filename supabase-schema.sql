-- Nghiên cứu Tử Vi Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, 
    utm_source TEXT DEFAULT 'direct',
    status TEXT DEFAULT 'subscribed',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Create index on utm_source for analytics
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON public.leads(utm_source);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to read and write
CREATE POLICY "Service role can do everything"
ON public.leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Optional: Create policy for authenticated users to read their own data
-- Uncomment if you want users to be able to read their own lead data
-- CREATE POLICY "Users can read own data"
-- ON public.leads
-- FOR SELECT
-- TO authenticated
-- USING (auth.email() = email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW public.leads_analytics AS
SELECT 
    utm_source,
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE status = 'subscribed') as subscribed_count,
    DATE(created_at) as signup_date
FROM public.leads
GROUP BY utm_source, DATE(created_at)
ORDER BY signup_date DESC, total_leads DESC;

-- Grant access to the view
GRANT SELECT ON public.leads_analytics TO service_role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables created: leads';
    RAISE NOTICE 'Views created: leads_analytics';
    RAISE NOTICE 'RLS policies: enabled with service_role access';
END $$;
