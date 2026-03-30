# 🚀 HƯỚNG DẪN THIẾT LẬP NHANH

## ✅ Trạng Thái Hiện Tại

✓ Project Next.js 14 đã khởi tạo thành công  
✓ Tất cả dependencies đã cài đặt  
✓ Shadcn/ui components đã sẵn sàng  
✓ Cấu trúc thư mục đã hoàn thiện  
✓ Build thành công không lỗi  
✓ Dev server đang chạy tại **http://localhost:3000**

✓ Theme dark-luxury đã áp dụng (texture + nebula + gold system)

---

## 🔧 CẤU HÌNH BẮT BUỘC

### 1. Cập Nhật Environment Variables

Mở file `.env.local` và cập nhật các giá trị sau:

```env
# Supabase - LẤY TỪ DASHBOARD SUPABASE CỦA BẠN
NEXT_PUBLIC_SUPABASE_URL=https://njxqxczqojtjstnymlro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PASTE_YOUR_ANON_KEY_HERE]
SUPABASE_SERVICE_ROLE_KEY=[PASTE_YOUR_SERVICE_ROLE_KEY_HERE]

# Resend - ĐÃ CÓ SẴN
RESEND_API_KEY=re_BfWWjDgj_4ekNBePHPzAFXy59fcjM9dt9

# Assets - ĐÃ CÓ SẴN
NEXT_PUBLIC_PDF_DOWNLOAD_URL=https://docs.google.com/document/d/1MtBhKLglpRVH8suvIRsF15oN6oRWLSYMLrN3r4xZ5yA/edit?tab=t.0
NEXT_PUBLIC_YOUTUBE_VIDEO_ID=9AC2Z2Ik8_Q
```

**Cách lấy Supabase Keys:**
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn (`njxqxczqojtjstnymlro`)
3. Vào Settings > API
4. Copy `anon/public` key vào `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy `service_role` key vào `SUPABASE_SERVICE_ROLE_KEY`

### 2. Tạo Database Schema

1. Vào Supabase Dashboard > SQL Editor
2. Paste nội dung file `supabase-schema.sql`
3. Click **Run** để tạo bảng `leads`

Hoặc chạy lệnh SQL đơn giản này:

```sql
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, 
    utm_source TEXT DEFAULT 'direct',
    status TEXT DEFAULT 'subscribed',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything"
ON public.leads FOR ALL TO service_role
USING (true) WITH CHECK (true);
```

### 3. Khởi Động Lại Dev Server

```bash
# Dừng server hiện tại (Ctrl+C nếu đang chạy)
npm run dev
```

---

## 🧪 KIỂM TRA CHỨC NĂNG

### Test 1: Form Submission
1. Mở http://localhost:3000
2. Điền thông tin: Họ tên + Email
3. Click "Nhận Cẩm Nang Ngay"
4. Kiểm tra:
   - ✅ Redirect đến `/thank-you`
   - ✅ Lead xuất hiện trong Supabase `leads` table

### Test 2: Email Delivery
1. Check email inbox (email vừa đăng ký)
2. Tìm kiếm từ khóa "tuvi"
3. Kiểm tra:
   - ✅ Subject: 🎁 Quà tặng: Cẩm Nang Tử Vi...
   - ✅ Personalized greeting với tên
   - ✅ PDF download link hoạt động
   - ✅ Copywriting huyền bí đúng spec

### Test 3: UTM Tracking
1. Truy cập: http://localhost:3000/?utm_source=facebook
2. Submit form
3. Kiểm tra Supabase:
   - ✅ `utm_source` = "facebook" trong database

### Test 4: Countdown Timer
1. Vào trang `/thank-you`
2. Refresh page nhiều lần
3. Kiểm tra:
   - ✅ Timer tiếp tục đếm từ giá trị đã lưu
   - ✅ Không reset về 15:00

### Test 5: Expired State
1. Mở DevTools > Console
2. Chạy: `localStorage.setItem('tuvi_countdown_expiry', '0')`
3. Refresh page
4. Kiểm tra:
   - ✅ Badge đỏ hiện thị: "Chương trình \"Hữu duyên\" ưu đãi 199k đã kết thúc, hẹn bạn ở lần tới!"

### Test 6: YouTube Video
1. Vào `/thank-you`
2. Kiểm tra:
   - ✅ Video load và play được
   - ✅ Video ID = 9AC2Z2Ik8_Q

### Test 7: Duplicate Email
1. Submit form với email đã tồn tại
2. Kiểm tra Supabase:
   - ✅ Record được UPDATE (không tạo duplicate)
   - ✅ `updated_at` thay đổi

### Test 8: Visual QA (Dark Luxury)
1. Mở trang chủ trên mobile + desktop
2. Kiểm tra:
   - ✅ Tiêu đề chính hiển thị tông vàng đồng/champagne
   - ✅ Nền không còn đen phẳng, có chiều sâu (texture + nebula)
   - ✅ 3 dòng lợi ích hiển thị gold-muted
   - ✅ Viền input mảnh màu vàng đồng, focus ring dịu
   - ✅ Nút "Nhận Cẩm Nang Ngay" là phần nổi bật nhất
   - ✅ Không còn icon trang trí ở đầu trang và cuối trang
   - ✅ Đoạn cam kết và social proof dùng off-white dễ đọc

---

## 🎨 PAGES & ROUTES

### 🏠 Home Page (/)
- **URL**: http://localhost:3000
- **Features**: 
  - Hero section với Playfair Display font
  - Particle background effects
  - Lead capture form
  - UTM tracking tự động

### 🙏 Thank You Page (/thank-you)
- **URL**: http://localhost:3000/thank-you
- **Features**:
  - Email check instructions
  - 15-minute countdown timer
  - YouTube video embed
  - PDF download button
  - Expired state badge

### 📡 API Subscribe (/api/subscribe)
- **Method**: POST
- **Runtime**: Edge
- **Body**: `{ full_name, email, utm_source? }`
- **Actions**:
  1. Validate with Zod
  2. Upsert to Supabase (email as unique key)
  3. Send email via Resend
  4. Return success response

---

## 🐛 TROUBLESHOOTING

### Email không gửi được
- Kiểm tra `RESEND_API_KEY` trong `.env.local`
- Verify API key còn active tại [Resend Dashboard](https://resend.com/api-keys)
- Check console logs trong terminal để xem error message

### Database lỗi "permission denied"
- Đảm bảo đã chạy SQL schema trong Supabase
- RLS policy phải cho phép `service_role` access
- Kiểm tra `SUPABASE_SERVICE_ROLE_KEY` đúng chưa

### Database lỗi `PGRST205` hoặc `Could not find the table 'public.leads' in the schema cache`
- Bạn đang kết nối đúng project Supabase nhưng project đó chưa có bảng `public.leads`, hoặc vừa tạo bảng xong và schema cache chưa kịp refresh
- Vào Supabase Dashboard > SQL Editor
- Chạy toàn bộ nội dung file `supabase-schema.sql`
- Đợi 5-10 giây rồi submit form lại
- Nếu vẫn lỗi, kiểm tra project ref trong `.env.local` có đúng với project bạn vừa chạy SQL không

### Countdown không persist
- Check browser console có error không
- Clear localStorage và test lại: `localStorage.clear()`
- Đảm bảo key = `tuvi_countdown_expiry`

### Build error "cannot find module"
```bash
# Xóa node_modules và reinstall
rm -rf node_modules .next
npm install
npm run build
```

---

## 📦 CẤU TRÚC PROJECT

```
trang_ban_kh/
├── src/
│   ├── app/
│   │   ├── api/subscribe/route.ts     ← Edge API
│   │   ├── thank-you/page.tsx         ← Thank you page
│   │   ├── layout.tsx                 ← Root layout
│   │   ├── page.tsx                   ← Home page
│   │   └── globals.css                ← Styles
│   ├── components/
│   │   ├── shared/
│   │   │   ├── CountdownTimer.tsx     ← 15-min timer
│   │   │   ├── ParticlesBg.tsx        ← Particle effects
│   │   │   └── OptInForm.tsx          ← Lead form
│   │   └── ui/                        ← Shadcn components
│   ├── lib/
│   │   ├── supabase.ts                ← DB clients
│   │   └── utils.ts                   ← Utilities
│   └── schema/
│       └── lead.ts                    ← Zod schema
├── .env.local                         ← Environment vars
├── .env.example                       ← Template
├── supabase-schema.sql                ← DB setup
├── tailwind.config.ts                 ← Theme config
└── README.md                          ← Full docs
```

## ✍️ Typography System

- Heading: Playfair Display (`font-playfair`)
- Body: Be Vietnam Pro (`font-bevietnam`)
- Mục tiêu: giữ thần thái cổ điển trang trọng ở heading, đồng thời đảm bảo khả năng đọc tiếng Việt tốt ở phần nội dung dài

---

## 🚀 TRIỂN KHAI (DEPLOYMENT)

### Vercel (Khuyên dùng)
1. Push code lên GitHub
2. Import project vào [Vercel](https://vercel.com)
3. Thêm environment variables trong Vercel settings
4. Deploy automatically

### Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

---

## 📊 PERFORMANCE

✅ **Lighthouse Score Target**: > 90  
✅ **Optimized Particles**: Framer Motion (GPU-accelerated)  
✅ **Edge Runtime**: Global low latency  
✅ **Font Optimization**: Next.js font loading  
✅ **Lazy Loading**: YouTube iframe loads on demand

---

## 🎯 NEXT STEPS

1. **Cập nhật `.env.local`** với Supabase keys thực
2. **Chạy SQL schema** trong Supabase
3. **Test form submission** và check email
4. **Verify countdown timer** persistence
5. **Test responsive design** trên mobile
6. **Deploy to Vercel** khi ready

---

**🔮 Hệ thống đã sẵn sàng! Chúc bạn thành công với Nghiên cứu Tử Vi!**
