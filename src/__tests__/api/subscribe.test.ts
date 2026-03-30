/**
 * Tests for src/app/api/subscribe/route.ts
 *
 * Strategy:
 * - Mock @supabase/supabase-js and resend at the module level
 * - Import the POST handler and exercise each code path
 *
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockEmailsSend = jest.fn()
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockEmailsSend },
  })),
}))

const mockUpsert = jest.fn()
const mockSelect = jest.fn()
const mockSingle = jest.fn()
const mockFrom = jest.fn(() => ({
  upsert: mockUpsert.mockReturnValue({
    select: mockSelect.mockReturnValue({
      single: mockSingle,
    }),
  }),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/subscribe', () => {
  let POST: (req: NextRequest) => Promise<Response>

  beforeEach(async () => {
    jest.resetModules()
    jest.clearAllMocks()

    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL = 'https://example.com/pdf'

    const mod = await import('@/app/api/subscribe/route')
    POST = mod.POST
  })

  describe('successful subscription', () => {
    beforeEach(() => {
      mockSingle.mockResolvedValue({
        data: { id: 'uuid-123', full_name: 'Nguyễn Văn A', email: 'test@example.com' },
        error: null,
      })
      mockEmailsSend.mockResolvedValue({ id: 'email-id-1', error: null })
    })

    it('returns 200 with success message on valid input', async () => {
      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'test@example.com' })
      const res = await POST(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.message).toContain('thành công')
    })

    it('upserts the lead with correct fields', async () => {
      const req = makeRequest({
        full_name: 'Nguyễn Văn A',
        email: 'test@example.com',
        utm_source: 'facebook',
      })
      await POST(req)

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'Nguyễn Văn A',
          email: 'test@example.com',
          utm_source: 'facebook',
          status: 'subscribed',
        }),
        expect.objectContaining({ onConflict: 'email', ignoreDuplicates: false })
      )
    })

    it('defaults utm_source to "direct" when not provided', async () => {
      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'test@example.com' })
      await POST(req)

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({ utm_source: 'direct' }),
        expect.anything()
      )
    })

    it('sends a welcome email to the registered address', async () => {
      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'test@example.com' })
      await POST(req)

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'test@example.com' })
      )
    })

    it('includes the user name in the email HTML', async () => {
      const req = makeRequest({ full_name: 'Trần Thị Bích', email: 'bich@example.com' })
      await POST(req)

      const callArg = mockEmailsSend.mock.calls[0][0]
      expect(callArg.html).toContain('Trần Thị Bích')
    })

    it('uses the updated mystical copywriting subject and CTA text', async () => {
      const req = makeRequest({ full_name: 'Trần Thị Bích', email: 'bich@example.com' })
      await POST(req)

      const callArg = mockEmailsSend.mock.calls[0][0]
      expect(callArg.subject).toBe('🎁 Quà tặng: Cẩm Nang Tử Vi "Tự đọc lá số" của bạn đã tới!')
      expect(callArg.html).toContain('📜 Tải Cẩm Nang Tự đọc lá số Tử Vi')
      expect(callArg.html).toContain('lộ trình 7 ngày làm chủ lá số')
    })
  })

  describe('database error', () => {
    it('returns 500 when Supabase upsert fails', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'DB connection failed' },
      })

      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'test@example.com' })
      const res = await POST(req)
      const json = await res.json()

      expect(res.status).toBe(500)
      expect(json.error).toBeDefined()
    })

    it('returns an actionable message when the leads table is missing', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: {
          code: 'PGRST205',
          message: "Could not find the table 'public.leads' in the schema cache",
        },
      })

      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'test@example.com' })
      const res = await POST(req)
      const json = await res.json()

      expect(res.status).toBe(500)
      expect(json.error).toContain('public.leads')
      expect(json.error).toContain('supabase-schema.sql')
    })
  })

  describe('email sending error', () => {
    it('returns 200 with a warning when email fails but lead is saved', async () => {
      mockSingle.mockResolvedValue({
        data: { id: 'uuid-123', full_name: 'Nguyễn Văn A', email: 'test@example.com' },
        error: null,
      })
      mockEmailsSend.mockRejectedValue(new Error('Resend API down'))

      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'test@example.com' })
      const res = await POST(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
    })
  })

  describe('validation errors', () => {
    it('returns 400 for missing full_name', async () => {
      const req = makeRequest({ email: 'test@example.com' })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid email', async () => {
      const req = makeRequest({ full_name: 'Nguyễn Văn A', email: 'bad-email' })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })

    it('returns 400 for full_name too short', async () => {
      const req = makeRequest({ full_name: 'A', email: 'test@example.com' })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })
  })
})
