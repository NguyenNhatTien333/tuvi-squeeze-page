'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, type LeadInput } from '@/schema/lead'
import { extractUTMSource } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export function OptInForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [utmSource, setUtmSource] = useState('direct')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<LeadInput, 'utm_source'> & { utm_source?: string }>({
    resolver: zodResolver(leadSchema) as any,
  })

  useEffect(() => {
    // Extract UTM source from URL
    if (typeof window !== 'undefined') {
      setUtmSource(extractUTMSource(window.location.href))
    }
  }, [])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          utm_source: utmSource,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra')
      }

      // Redirect to thank you page
      router.push('/thank-you')
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mystical-form-shell w-full max-w-lg mx-auto backdrop-blur-sm rounded-sm">
      <CardHeader>
        <CardTitle className="mystical-gold-title text-center font-playfair text-3xl sm:text-4xl">
          Nhận Ngay Cẩm Nang Miễn Phí
        </CardTitle>
        <CardDescription className="text-center text-lg text-mystical-offwhite/90">
          Khám phá bản đồ vận mệnh của bạn qua 12 cung Tử Vi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-mystical-offwhite/95">Họ và Tên *</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Nhập họ tên của bạn"
              {...register('full_name')}
              disabled={isSubmitting}
              className="mystical-input h-11 rounded-none border"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-mystical-offwhite/95">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register('email')}
              disabled={isSubmitting}
              className="mystical-input h-11 rounded-none border"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="mystical-cta w-full h-11 rounded-none font-semibold tracking-wide"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Nhận Cẩm Nang Ngay'
            )}
          </Button>

          <p className="text-center text-xs leading-relaxed text-mystical-offwhite/78 sm:text-sm">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Email của bạn sẽ được bảo mật tuyệt đối.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
