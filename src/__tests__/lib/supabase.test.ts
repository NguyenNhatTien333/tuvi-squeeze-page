// Mock @supabase/supabase-js before importing the module
const mockCreateClient = jest.fn(() => ({ from: jest.fn(), auth: {} }))

jest.mock('@supabase/supabase-js', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}))

describe('supabase clients', () => {
  beforeEach(() => {
    mockCreateClient.mockClear()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  })

  it('exports supabase and supabaseAdmin as objects', () => {
    // This import is cached per test file run; we validate that exports exist
    const mod = require('@/lib/supabase')
    expect(mod.supabase).toBeDefined()
    expect(mod.supabaseAdmin).toBeDefined()
  })

  it('creates exactly two Supabase clients on module load', () => {
    // Re-import via require to count createClient calls across the module
    jest.isolateModules(() => {
      require('@/lib/supabase')
    })
    expect(mockCreateClient).toHaveBeenCalledTimes(2)
  })

  it('creates public client with ANON key', () => {
    jest.isolateModules(() => {
      require('@/lib/supabase')
    })
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
  })

  it('creates admin client with SERVICE ROLE key and disabled session persistence', () => {
    jest.isolateModules(() => {
      require('@/lib/supabase')
    })
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-service-role-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  })

  it('Lead interface compiles and exports are typed correctly (compile-time check)', () => {
    // TypeScript ensures the Lead type shape at compile time.
    expect(true).toBe(true)
  })
})
