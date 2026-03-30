import { ParticlesBg } from '@/components/shared/ParticlesBg'
import { OptInForm } from '@/components/shared/OptInForm'
import { Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="mystical-surface mystical-texture mystical-nebula relative min-h-screen overflow-hidden bg-mystical-dark">
      <ParticlesBg />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero Section */}
        <section className="mb-14 w-full max-w-4xl space-y-8 text-center sm:mb-20">
          <div className="mb-2 flex items-center justify-center gap-2 sm:mb-4">
            <Sparkles className="h-6 w-6 text-mystical-goldMuted/90 sm:h-7 sm:w-7" />
            <h2 className="mystical-gold-title font-playfair text-xl font-bold tracking-[0.18em] uppercase sm:text-3xl">
              ☆Nghiên cứu Tử Vi☆
            </h2>
            <Sparkles className="h-6 w-6 text-mystical-goldMuted/90 sm:h-7 sm:w-7" />
          </div>

          <h1 className="mystical-gold-title font-playfair text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Khám Phá Bản Đồ{' '}
            <span className="text-mystical-champagne">Vận Mệnh</span>
            <br />
            Của Chính Bạn
          </h1>

          <p className="mystical-body-copy mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
            Giữa muôn vàn nhân duyên, đây là lúc bạn mở ra con đường thấu hiểu thiên mệnh.
            Nhận ngay <span className="font-semibold text-mystical-champagne">Cẩm Nang Miễn Phí</span> giải mã 12 cung chức Tử Vi.
          </p>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 text-base sm:grid-cols-3 sm:gap-4">
            <div className="mystical-chip flex items-center justify-center gap-2 rounded-full px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-mystical-goldMuted" />
              <span className="whitespace-nowrap">100% Miễn Phí</span>
            </div>
            <div className="mystical-chip flex items-center justify-center gap-2 rounded-full px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-mystical-goldMuted" />
              <span className="whitespace-nowrap">Kiến Thức Chuẩn Xác</span>
            </div>
            <div className="mystical-chip flex items-center justify-center gap-2 rounded-full px-4 py-2.5">
              <div className="h-2 w-2 rounded-full bg-mystical-goldMuted" />
              <span className="whitespace-nowrap">Dễ Hiểu & Thực Hành</span>
            </div>
          </div>
        </section>

        {/* Opt-in Form */}
        <section className="w-full max-w-lg">
          <OptInForm />
        </section>

        {/* Footer Note */}
        <p className="mx-auto mt-12 max-w-xl text-center text-xl leading-relaxed text-mystical-offwhite/88 sm:mt-16 sm:text-4xl">
          Hơn <span className="font-semibold text-mystical-champagne">10,000+</span> học viên
          đã nhận cẩm nang và bắt đầu hành trình làm chủ vận mệnh
        </p>
      </main>
    </div>
  )
}
