import { ParticlesBg } from '@/components/shared/ParticlesBg'
import { OptInForm } from '@/components/shared/OptInForm'
import { Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mystical-dark">
      <ParticlesBg />
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-6 max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-mystical-accent" />
            <h2 className="text-sm font-semibold tracking-widest text-mystical-accent uppercase">
              Nghiên cứu Tử Vi
            </h2>
            <Sparkles className="w-8 h-8 text-mystical-accent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight">
            Khám Phá Bản Đồ{' '}
            <span className="text-mystical-accent">Vận Mệnh</span>
            <br />
            Của Chính Bạn
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Giữa muôn vàn nhân duyên, đây là lúc bạn mở ra con đường thấu hiểu thiên mệnh. 
            Nhận ngay <span className="text-mystical-accent font-semibold">Cẩm Nang Miễn Phí</span> giải mã 12 cung chức Tử Vi.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mystical-accent"></div>
              <span>100% Miễn Phí</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mystical-accent"></div>
              <span>Kiến Thức Chuẩn Xác</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mystical-accent"></div>
              <span>Dễ Hiểu & Thực Hành</span>
            </div>
          </div>
        </div>

        {/* Opt-in Form */}
        <OptInForm />
        
        {/* Footer Note */}
        <p className="mt-8 text-center text-xs text-muted-foreground max-w-md">
          Hơn <span className="text-mystical-accent font-semibold">10,000+</span> học viên 
          đã nhận cẩm nang và bắt đầu hành trình làm chủ vận mệnh
        </p>
      </main>
    </div>
  )
}
