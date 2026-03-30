'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

const STORAGE_KEY = 'tuvi_countdown_expiry'
const COUNTDOWN_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get or set expiry time
    let expiryTime = localStorage.getItem(STORAGE_KEY)
    
    if (!expiryTime) {
      const newExpiry = Date.now() + COUNTDOWN_DURATION
      localStorage.setItem(STORAGE_KEY, newExpiry.toString())
      expiryTime = newExpiry.toString()
    }

    const checkTime = () => {
      const remaining = parseInt(expiryTime!) - Date.now()
      
      if (remaining <= 0) {
        setIsExpired(true)
        setTimeLeft(0)
      } else {
        setTimeLeft(remaining)
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted || timeLeft === null) {
    return null
  }

  if (isExpired) {
    return (
      <div className="flex justify-center">
        {/* @ts-ignore */}
        <Badge variant="destructive" className="text-sm py-2 px-4">
          Chương trình "Hữu duyên" ưu đãi 199k đã kết thúc, hẹn bạn ở lần tới!
        </Badge>
      </div>
    )
  }

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  return (
    <div className="flex items-center justify-center gap-3 bg-mystical-accent/10 border border-mystical-accent/30 rounded-lg p-4">
      <Clock className="w-5 h-5 text-mystical-accent" />
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold font-playfair text-mystical-accent">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="text-sm text-muted-foreground">còn lại</span>
      </div>
    </div>
  )
}
