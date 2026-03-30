import { z } from 'zod'

export const leadSchema = z.object({
  full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  utm_source: z.string().optional().default('direct'),
})

export type LeadInput = z.infer<typeof leadSchema>
