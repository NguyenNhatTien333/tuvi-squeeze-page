Chào bạn, đây là bản ĐẶC TẢ KỸ THUẬT TỔNG THỂ.

Tài liệu này đã được tinh chỉnh để tối ưu cho Security (Service Role), Performance (Edge + Optimized Particles) và UX (Shadcn/ui + Persistent Logic). Bạn chỉ cần đưa tài liệu này vào Cursor/Claude, hệ thống sẽ được xây dựng chuẩn xác 100%.

📜 ĐẶC TẢ: HỆ THỐNG PHỄU NGHIÊN CỨU TỬ VI
1. THIẾT LẬP MÔI TRƯỜNG & BẢO MẬT (ENV)
Tạo file .env.local:
code
Env
download
content_copy
expand_less
# Supabase (Sử dụng Service Role cho API Backend để đảm bảo quyền ghi)
NEXT_PUBLIC_SUPABASE_URL=https://njxqxczqojtjstnymlro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeHF4Y3pxb2p0anN0bnltbHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTk2ODksImV4cCI6MjA5MDM5NTY4OX0.oXIkJqBu7EN7q-2CHXC5SPAGAMnEfFTdfkHLnzaIL54
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeHF4Y3pxb2p0anN0bnltbHJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxOTY4OSwiZXhwIjoyMDkwMzk1Njg5fQ.VkBhzQKfyPKes-xSYHOisfbAFCE7VFzUg4gpebBn0b0

# Resend Email (Sử dụng tên miền mặc định của Resend)
RESEND_API_KEY=re_BfWWjDgj_4ekNBePHPzAFXy59fcjM9dt9

# Assets & Config
NEXT_PUBLIC_PDF_DOWNLOAD_URL=https://docs.google.com/document/d/1MtBhKLglpRVH8suvIRsF15oN6oRWLSYMLrN3r4xZ5yA/edit?tab=t.0
NEXT_PUBLIC_YOUTUBE_VIDEO_ID=9AC2Z2Ik8_Q
2. CẤU TRÚC THƯ MỤC (APP ROUTER)
code
Text
download
content_copy
expand_less
src/
├── app/
│   ├── api/subscribe/route.ts (Edge Runtime, Upsert logic)
│   ├── thank-you/page.tsx     (Persistent Countdown, YouTube Iframe)
│   ├── layout.tsx             (Playfair Display, Inter, Global CSS)
│   └── page.tsx               (Hero, Form, Particles Background)
├── components/
│   ├── shared/
│   │   ├── CountdownTimer.tsx (LocalStorage logic)
│   │   ├── ParticlesBg.tsx    (Framer Motion Optimized)
│   │   └── OptInForm.tsx      (Shadcn + React Hook Form)
│   └── ui/                    (Shadcn/ui components)
├── lib/
│   ├── supabase.ts            (Admin/Client init)
│   └── utils.ts               (Tailwind Merge)
└── schema/
    └── lead.ts                (Zod schema)
3. LOGIC XỬ LÝ DỮ LIỆU & BẢO MẬT
A. Bảng Leads (Supabase)
code
SQL
download
content_copy
expand_less
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, 
    utm_source TEXT DEFAULT 'direct',
    status TEXT DEFAULT 'subscribed',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
B. API Route Logic (/api/subscribe)

Runtime: Edge.

Auth: Sử dụng SUPABASE_SERVICE_ROLE_KEY để thực hiện lệnh .upsert().

UTM Capture: Lấy utm_source từ payload gửi lên từ Client-side (vốn được bóc tách từ URL).

4. PERSISTENT COUNTDOWN & "EXPIRED" STATE

Logic:

Khi vào /thank-you, kiểm tra tuvi_countdown_expiry trong localStorage.

Nếu chưa có: Set giá trị = Date.now() + 15 * 60 * 1000.

Nếu Date.now() > expiry: Hiển thị Badge 'Chương trình "Hữu duyên" ưu đãi 199k đã kết thúc, hẹn bạn ở lần tới!' (Màu đỏ Slate/Muted).

Nếu còn thời gian: Hiển thị đồng hồ đếm ngược mượt mà.

5. COPYWRITING EMAIL (PHONG CÁCH HUYỀN HỌC)

Subject: 🎁 Quà tặng: Cẩm Nang Tử Vi "Thấu Thị Thiên Mệnh" của bạn đã tới!

Nội dung HTML:

Chào {full_name},

Giữa muôn vàn nhân duyên, cảm ơn bạn đã chọn dừng chân tại Nghiên cứu Tử Vi. Tài liệu mà bạn mong chờ không chỉ là kiến thức, mà là chiếc chìa khóa nhỏ giúp bạn thấu hiểu bản đồ vận mệnh của chính mình.

📜 [Link Tải Cẩm Nang Giải Mã 12 Cung Chức]

Lưu ý: Sau khi xem xong cẩm nang, hãy quay lại trang "Duyên Lành" để không bỏ lỡ lộ trình 7 ngày làm chủ lá số đang được trợ duyên đặc biệt.

Chúc bạn thân tâm an lạc,
Ban quản trị Nghiên cứu Tử Vi

6. VISUALS: OPTIMIZED PARTICLES BG

Sử dụng Framer Motion để tạo 20-30 "điểm sáng" (div) chuyển động chậm theo quỹ đạo ngẫu nhiên với opacity thấp (0.1 - 0.3) trên nền đen sâu. Tránh dùng thư viện nặng như tsParticles để điểm Lighthouse luôn > 90.

🚀 LỆNH (PROMPT) TỔNG LỰC CHO AI

Copy đoạn này vào Cursor/Claude:

"Hãy xây dựng ứng dụng Next.js 14 App Router (src directory) dựa trên đặc tả sau:

Kiến trúc & Thư viện: Sử dụng Shadcn/ui cho tất cả các UI component (Button, Input, Badge, Card). Sử dụng Framer Motion cho animation và Lucide React cho icon.

Trang Chủ (/):

Nền: Mystical Dark (#0F1115) với component ParticlesBg (dùng Framer Motion tạo các hạt sáng nhỏ bay chậm để tối ưu performance).

Content: Hero Section sang trọng (Playfair Display font).

Form: OptInForm dùng react-hook-form + zod. Phải bóc tách được utm_source từ URL để gửi lên API.

API Backend (/api/subscribe):

Chạy trên Edge Runtime. Sử dụng SUPABASE_SERVICE_ROLE_KEY để thực hiện hành động .upsert() vào bảng leads (email làm key chính).

Tích hợp Resend gửi email theo copywriting đã mô tả trong đặc tả (HTML style huyền bí, tối giản).

Trang Cảm Ơn (/thank-you):

Hiển thị hộp thoại hướng dẫn kiểm tra email (cụm từ 'tuvi').

Video: Nhúng YouTube Iframe ID 9AC2Z2Ik8_Q.

Countdown: Component CountdownTimer lưu localStorage. Nếu hết hạn, hiển thị Badge 'Chương trình "Hữu duyên" ưu đãi 199k đã kết thúc, hẹn bạn ở lần tới!' thay thế cho đồng hồ.

Environment Variables:
NEXT_PUBLIC_SUPABASE_URL=https://zdwmfthwgibndpbtcdoq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=re_BfWWjDgj_4ekNBePHPzAFXy59fcjM9dt9
NEXT_PUBLIC_PDF_DOWNLOAD_URL=https://docs.google.com/document/d/1MtBhKLglpRVH8suvIRsF15oN6oRWLSYMLrN3r4xZ5yA/edit?tab=t.0

Hãy viết mã nguồn chi tiết cho từng file theo đúng cấu trúc thư mục src/ đã nêu."