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
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-mystical-accent/20">
      <CardHeader>
        <CardTitle className="text-2xl font-playfair text-center text-mystical-accent">
          Nhận Ngay Cẩm Nang Miễn Phí
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Khám phá bản đồ vận mệnh của bạn qua 12 cung Tử Vi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và Tên *</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Nhập họ tên của bạn"
              {...register('full_name')}
              disabled={isSubmitting}
              className="bg-background/50"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register('email')}
              disabled={isSubmitting}
              className="bg-background/50"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-mystical-accent hover:bg-mystical-glow text-mystical-dark font-semibold"
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

          <p className="text-xs text-center text-muted-foreground">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Email của bạn sẽ được bảo mật tuyệt đối.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
