import { leadSchema } from '@/schema/lead'

describe('leadSchema', () => {
  describe('full_name validation', () => {
    it('accepts a valid full name', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('rejects full_name with fewer than 2 characters', () => {
      const result = leadSchema.safeParse({
        full_name: 'A',
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Họ tên phải có ít nhất 2 ký tự')
      }
    })

    it('rejects empty full_name', () => {
      const result = leadSchema.safeParse({
        full_name: '',
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
    })

    it('accepts full_name with exactly 2 characters', () => {
      const result = leadSchema.safeParse({
        full_name: 'AB',
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('accepts a valid email', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'user@example.com',
      })
      expect(result.success).toBe(true)
    })

    it('rejects an invalid email', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email không hợp lệ')
      }
    })

    it('rejects empty email', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects email missing @ symbol', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'userexample.com',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('utm_source field', () => {
    it('defaults utm_source to "direct" when not provided', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.utm_source).toBe('direct')
      }
    })

    it('accepts a custom utm_source', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'test@example.com',
        utm_source: 'facebook',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.utm_source).toBe('facebook')
      }
    })

    it('accepts undefined utm_source and defaults to "direct"', () => {
      const result = leadSchema.safeParse({
        full_name: 'Nguyễn Văn A',
        email: 'test@example.com',
        utm_source: undefined,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.utm_source).toBe('direct')
      }
    })
  })

  describe('full valid input', () => {
    it('parses a fully valid payload', () => {
      const input = {
        full_name: 'Trần Thị Bích',
        email: 'bich@example.com',
        utm_source: 'google',
      }
      const result = leadSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(input)
      }
    })
  })
})
