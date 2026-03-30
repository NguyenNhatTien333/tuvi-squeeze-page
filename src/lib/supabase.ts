import { createClient } from '@supabase/supabase-js'

// Public client (for client-side operations)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client (for server-side operations with elevated privileges)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Type definitions for the leads table
export interface Lead {
  id: string
  full_name: string
  email: string
  utm_source: string
  status: string
  metadata: Record<string, any>
  created_at: string
}
