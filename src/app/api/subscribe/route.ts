import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { ZodError } from 'zod'
import { leadSchema } from '@/schema/lead'

// Configure Edge Runtime
export const runtime = 'edge'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize Supabase Admin Client with Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

function getDatabaseErrorMessage(dbError: { code?: string; message?: string }) {
  if (dbError.code === 'PGRST205') {
    return 'Supabase chưa có bảng public.leads trong project hiện tại. Hãy chạy file supabase-schema.sql trong SQL Editor, rồi thử lại sau 5-10 giây để schema cache được làm mới.'
  }

  return 'Không thể lưu thông tin. Vui lòng thử lại.'
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Upsert lead into Supabase (insert or update if email exists)
    const { data: lead, error: dbError } = await supabaseAdmin
      .from('leads')
      .upsert(
        {
          full_name: validatedData.full_name,
          email: validatedData.email,
          utm_source: validatedData.utm_source || 'direct',
          status: 'subscribed',
          metadata: {},
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: getDatabaseErrorMessage(dbError) },
        { status: 500 }
      )
    }

    // Send welcome email with Resend
    const pdfUrl = process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL || ''
    
    try {
      await resend.emails.send({
        from: 'Nghiên cứu Tử Vi <onboarding@resend.dev>',
        to: validatedData.email,
        subject: '🎁 Quà tặng: Cẩm Nang Tử Vi "Tự đọc lá số" của bạn đã tới!',
        html: `
          <!DOCTYPE html>
          <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cẩm Nang Nghiên cứu Tử Vi</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0F1115;">
            <div style="background: linear-gradient(135deg, #1a1b1f 0%, #0a0a0c 100%); border-radius: 16px; padding: 40px; box-shadow: 0 8px 32px rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 10px; font-weight: 700;">✨ Nghiên cứu Tử Vi ✨</h1>
                <div style="width: 80px; height: 3px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 auto;"></div>
              </div>

              <!-- Greeting -->
              <p style="color: #E5E5E5; font-size: 16px; margin-bottom: 20px;">
                Chào <strong style="color: #D4AF37;">${validatedData.full_name}</strong>,
              </p>

              <!-- Main Content -->
              <div style="background: rgba(212, 175, 55, 0.05); border-left: 4px solid #D4AF37; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <p style="color: #E5E5E5; font-size: 15px; line-height: 1.8; margin: 0;">
                  Giữa muôn vàn nhân duyên, cảm ơn bạn đã chọn dừng chân tại <strong style="color: #D4AF37;">Nghiên cứu Tử Vi</strong>. 
                  Tài liệu mà bạn mong chờ không chỉ là kiến thức, mà là chiếc chìa khóa nhỏ giúp bạn thấu hiểu bản đồ vận mệnh của chính mình.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${pdfUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); color: #0F1115; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); transition: transform 0.3s ease;">
                  📜 Tải Cẩm Nang Tự đọc lá số Tử Vi
                </a>
              </div>

              <!-- Note -->
              <div style="background: rgba(255, 215, 0, 0.08); border: 1px solid rgba(212, 175, 55, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #D4AF37; font-size: 14px; margin: 0; font-weight: 600;">
                  💡 Lưu ý quan trọng:
                </p>
                <p style="color: #B8B8B8; font-size: 14px; margin: 10px 0 0 0;">
                  Sau khi xem xong cẩm nang, hãy quay lại trang "Duyên Lành" để không bỏ lỡ <strong style="color: #D4AF37;">lộ trình 7 ngày làm chủ lá số</strong> đang được trợ duyên đặc biệt.
                </p>
              </div>

              <!-- Footer -->
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 55, 0.2); text-align: center;">
                <p style="color: #B8B8B8; font-size: 14px; margin: 5px 0;">
                  Chúc bạn thân tâm an lạc,
                </p>
                <p style="color: #D4AF37; font-size: 15px; font-weight: 600; margin: 5px 0;">
                  Ban quản trị Nghiên cứu Tử Vi
                </p>
              </div>

            </div>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails - lead is already saved
      return NextResponse.json(
        { 
          success: true,
          message: 'Đăng ký thành công! Tuy nhiên có lỗi khi gửi email. Vui lòng liên hệ hỗ trợ.',
          lead 
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email.',
        lead 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
