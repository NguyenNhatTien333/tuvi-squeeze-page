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
    <Card className="mystical-form-shell mx-auto min-h-[36rem] w-full max-w-2xl rounded-sm backdrop-blur-sm sm:min-h-[40rem]">
      <CardHeader className="px-8 pb-5 pt-8 sm:px-12 sm:pb-6 sm:pt-10">
        <CardTitle className="mystical-gold-title text-center font-playfair text-4xl leading-tight sm:text-5xl lg:text-6xl">
          Nhận Ngay Cẩm Nang Miễn Phí
        </CardTitle>
        <CardDescription className="text-center text-xl leading-relaxed text-mystical-offwhite/90 sm:text-2xl lg:text-3xl">
          Khám phá bản đồ vận mệnh của bạn qua 12 cung Tử Vi
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-12 sm:px-12 sm:pb-14">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7">
          <div className="space-y-3">
            <Label htmlFor="full_name" className="text-xl text-mystical-offwhite/95 sm:text-2xl">Họ và Tên *</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Nhập họ tên của bạn"
              {...register('full_name')}
              disabled={isSubmitting}
              className="mystical-input h-12 rounded-none border px-4 text-lg sm:h-14 sm:px-5 sm:text-xl"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-xl text-mystical-offwhite/95 sm:text-2xl">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register('email')}
              disabled={isSubmitting}
              className="mystical-input h-12 rounded-none border px-4 text-lg sm:h-14 sm:px-5 sm:text-xl"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="mystical-cta h-12 w-full rounded-none text-lg font-semibold tracking-wide shadow-[0_0_18px_rgba(228,197,116,0.18)] sm:h-14 sm:text-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                Đang xử lý...
              </>
            ) : (
              'Nhận Cẩm Nang Ngay'
            )}
          </Button>

          <p className="text-center text-base leading-relaxed text-mystical-offwhite/78 sm:text-lg">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Email của bạn sẽ được bảo mật tuyệt đối.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
