import { ParticlesBg } from '@/components/shared/ParticlesBg'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Mail, Download, Video } from 'lucide-react'

export default function ThankYouPage() {
  const pdfUrl = process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL || ''
  const youtubeVideoId = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || ''

  return (
    <div className="mystical-surface mystical-texture mystical-nebula relative min-h-screen overflow-hidden bg-mystical-dark">
      <ParticlesBg />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
        <div className="w-full max-w-4xl space-y-8 sm:space-y-10">
          {/* Success Message */}
          <section className="space-y-5 text-center sm:space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full border border-mystical-goldMuted/50 bg-mystical-goldMuted/10 p-3 sm:p-4">
                <CheckCircle2 className="h-10 w-10 text-mystical-champagne sm:h-12 sm:w-12" />
              </div>
            </div>
            <h1 className="mystical-gold-title font-playfair text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Cảm Ơn Bạn Đã Đăng Ký!
            </h1>
            <p className="mystical-body-copy mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
              Giữa muôn vàn nhân duyên, cảm ơn bạn đã chọn dừng chân tại{' '}
              <span className="font-semibold text-mystical-champagne">Nghiên cứu Tử Vi</span>
            </p>
          </section>

          {/* Email Instructions Card */}
          <section className="mystical-form-shell rounded-xl p-5 sm:p-7">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-mystical-goldMuted" />
                <h2 className="font-playfair text-2xl font-semibold text-mystical-champagne sm:text-3xl">Kiểm Tra Hộp Thư Email Của Bạn</h2>
              </div>
              <p className="mystical-body-copy text-base sm:text-lg">
                Tài liệu mà bạn mong chờ đã được gửi đến email của bạn
              </p>

              <div className="space-y-3 rounded-lg border border-mystical-goldMuted/20 bg-black/20 p-4 sm:p-5">
                <p className="text-lg leading-relaxed text-mystical-offwhite/90 sm:text-2xl">
                  📬 Hãy tìm kiếm email có từ khóa {/* @ts-ignore */}<Badge variant="outline" className="font-mono text-mystical-accent border-mystical-accent/30">"tuvi"</Badge> trong hộp thư của bạn
                </p>
                <p className="text-lg leading-relaxed text-mystical-offwhite/90 sm:text-2xl">
                  💡 Nếu không thấy email trong hộp thư đến, vui lòng kiểm tra thư mục Spam/Junk
                </p>
              </div>

              {pdfUrl && (
                <Button
                  className="mystical-cta h-12 w-full text-base font-semibold"
                  asChild
                >
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Hoặc Tải Cẩm Nang Ngay
                  </a>
                </Button>
              )}
            </div>
          </section>

          {/* Countdown Timer */}
          <section className="mystical-form-shell rounded-xl p-5 sm:p-7">
            <div className="space-y-6">
              <h2 className="text-center font-playfair text-3xl font-semibold text-mystical-champagne sm:text-4xl">
                Cơ Hội Đặc Biệt Cho Bạn
              </h2>
              <p className="mystical-body-copy text-center text-lg sm:text-2xl">
                Chương trình trợ duyên đặc biệt dành cho những học viên mới
              </p>

              <CountdownTimer />

              <div className="text-center space-y-3">
                <p className="text-lg leading-relaxed text-mystical-offwhite/90 sm:text-2xl">
                  Sau khi xem xong cẩm nang, hãy quay lại để không bỏ lỡ{' '}
                  <span className="font-semibold text-mystical-champagne">
                    Lộ Trình 7 Ngày Làm Chủ Lá Số
                  </span>{' '}
                  đang được trợ duyên đặc biệt
                </p>
              </div>
            </div>
          </section>

          {/* YouTube Video */}
          {youtubeVideoId && (
            <section className="mystical-form-shell rounded-xl p-5 sm:p-7">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-mystical-goldMuted" />
                  <h2 className="font-playfair text-2xl font-semibold text-mystical-champagne sm:text-3xl">Khám Phá Sức Mạnh Của Tử Vi</h2>
                </div>
                <p className="mystical-body-copy text-base sm:text-lg">
                  Xem video ngay để hiểu hơn về cách Tử Vi có thể thay đổi cuộc đời bạn
                </p>
                <div className="aspect-video w-full overflow-hidden rounded-lg border border-mystical-goldMuted/25">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="Nghiên cứu Tử Vi Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="border-t border-mystical-goldMuted/20 pt-8 text-center">
            <p className="text-xl leading-relaxed text-mystical-offwhite/88 sm:text-4xl">
              Chúc bạn thân tâm an lạc,
              <br />
              <span className="font-semibold text-mystical-champagne">Ban quản trị Nghiên cứu Tử Vi</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
