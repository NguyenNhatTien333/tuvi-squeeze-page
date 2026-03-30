import { ParticlesBg } from '@/components/shared/ParticlesBg'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Mail, Download, Video } from 'lucide-react'

export default function ThankYouPage() {
  const pdfUrl = process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL || ''
  const youtubeVideoId = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || ''

  return (
    <div className="relative min-h-screen overflow-hidden bg-mystical-dark">
      <ParticlesBg />
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl space-y-8">
          
          {/* Success Message */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-mystical-accent/20 border-2 border-mystical-accent">
                <CheckCircle2 className="w-12 h-12 text-mystical-accent" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground">
              Cảm Ơn Bạn Đã Đăng Ký!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Giữa muôn vàn nhân duyên, cảm ơn bạn đã chọn dừng chân tại <span className="text-mystical-accent font-semibold">Nghiên cứu Tử Vi</span>
            </p>
          </div>

          {/* Email Instructions Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-mystical-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-mystical-accent" />
                <CardTitle className="font-playfair">Kiểm Tra Hộp Thư Email Của Bạn</CardTitle>
              </div>
              <CardDescription>
                Tài liệu mà bạn mong chờ đã được gửi đến email của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  📬 Hãy tìm kiếm email có từ khóa {/* @ts-ignore */}<Badge variant="outline" className="font-mono text-mystical-accent border-mystical-accent/30">"tuvi"</Badge> trong hộp thư của bạn
                </p>
                <p className="text-sm text-muted-foreground">
                  💡 Nếu không thấy email trong hộp thư đến, vui lòng kiểm tra thư mục Spam/Junk
                </p>
              </div>
              
              {pdfUrl && (
                <Button 
                  className="w-full bg-mystical-accent hover:bg-mystical-glow text-mystical-dark font-semibold"
                  asChild
                >
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Hoặc Tải Cẩm Nang Ngay
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Countdown Timer */}
          <Card className="bg-card/50 backdrop-blur-sm border-mystical-accent/20">
            <CardHeader>
              <CardTitle className="font-playfair text-center">
                Cơ Hội Đặc Biệt Cho Bạn
              </CardTitle>
              <CardDescription className="text-center">
                Chương trình trợ duyên đặc biệt dành cho những học viên mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CountdownTimer />
              
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sau khi xem xong cẩm nang, hãy quay lại để không bỏ lỡ{' '}
                  <span className="text-mystical-accent font-semibold">
                    Lộ Trình 7 Ngày Làm Chủ Lá Số
                  </span>{' '}
                  đang được trợ duyên đặc biệt
                </p>
              </div>
            </CardContent>
          </Card>

          {/* YouTube Video */}
          {youtubeVideoId && (
            <Card className="bg-card/50 backdrop-blur-sm border-mystical-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-mystical-accent" />
                  <CardTitle className="font-playfair">Khám Phá Sức Mạnh Của Tử Vi</CardTitle>
                </div>
                <CardDescription>
                  Xem video ngay để hiểu hơn về cách Tử Vi có thể thay đổi cuộc đời bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="Nghiên cứu Tử Vi Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center pt-8 border-t border-mystical-accent/20">
            <p className="text-sm text-muted-foreground">
              Chúc bạn thân tâm an lạc,
              <br />
              <span className="text-mystical-accent font-semibold">Ban quản trị Nghiên cứu Tử Vi</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
