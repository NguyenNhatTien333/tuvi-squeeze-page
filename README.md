# 🔮 Nghiên cứu Tử Vi - Lead Capture System

A high-end mystical astrology lead capture system built with Next.js 14, featuring luxury dark visuals, persistent countdown timers, email automation, and optimized particle background effects.

## ✨ Features

- **Luxury Mystical Theme** - Dark graphite silk background, champagne-gold highlights, and subtle nebula depth
- **Optimized Particles Background** - Framer Motion powered particle effects for 90+ Lighthouse score
- **Lead Capture Form** - React Hook Form with Zod validation
- **Email Automation** - Resend integration for instant email delivery
- **Persistent Countdown Timer** - localStorage-based 15-minute countdown
- **UTM Tracking** - Automatic campaign source tracking
- **Edge Runtime API** - Fast, globally distributed API routes
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type-Safe** - Full TypeScript support

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS with custom mystical theme
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Fonts**: Playfair Display (headings) + Be Vietnam Pro (body)

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account and project
- Resend account and API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trang_ban_kh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_PDF_DOWNLOAD_URL=your_pdf_url
   NEXT_PUBLIC_YOUTUBE_VIDEO_ID=your_youtube_id
   ```

4. **Set up Supabase database**
   
   Run this SQL in your Supabase SQL Editor:
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
   
   -- Optional: Add RLS policies if needed
   ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/subscribe/route.ts     # Edge API with Supabase upsert + Resend
│   ├── thank-you/page.tsx         # Thank you page with countdown
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Home page with hero + form
│   └── globals.css                # Global styles + Shadcn theme
├── components/
│   ├── shared/
│   │   ├── CountdownTimer.tsx     # Persistent 15-min countdown
│   │   ├── ParticlesBg.tsx        # Optimized particle background
│   │   └── OptInForm.tsx          # Lead capture form
│   └── ui/                        # Shadcn/ui components
├── lib/
│   ├── supabase.ts                # Supabase client setup
│   └── utils.ts                   # Utility functions
└── schema/
    └── lead.ts                    # Zod validation schema
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the mystical theme:
```typescript
mystical: {
   dark: "#0F1115",          // Main dark base
   graphite: "#0B0D12",      // Deep graphite
   silk: "#111521",          // Layered surface tone
   offwhite: "#E7E4DC",      // Primary body copy
   gold: "#D4AF37",          // Core luxury accent
   champagne: "#E4C574",     // Headings + CTA highlight
   goldMuted: "#C6AA60",     // Secondary chips and icons
   nebulaViolet: "#3E2B5F",  // Corner nebula tint
   nebulaTeal: "#153A44",    // Corner nebula tint
}
```

### Visual Language

- Long vertical center-led layout with larger spacing rhythm
- Layered dark background with texture and low-opacity star-map feel
- Clean, icon-free edge treatment for a focused hero/form flow
- Thin gold borders for form controls and shell
- Primary CTA uses champagne-gold fill with a restrained glow

### Countdown Duration

Edit `src/components/shared/CountdownTimer.tsx`:
```typescript
const COUNTDOWN_DURATION = 15 * 60 * 1000 // Change this value
```

### Email Template

Edit `src/app/api/subscribe/route.ts` to customize the email HTML.

## 🧪 Testing Checklist

- [ ] Form submission creates lead in Supabase
- [ ] Email sent successfully with correct template
- [ ] UTM parameters captured (test with `?utm_source=facebook`)
- [ ] Countdown persists across page refreshes
- [ ] Expired state displays after 15 minutes
- [ ] Duplicate email updates instead of creates new record
- [ ] Responsive design on mobile/tablet/desktop
- [ ] YouTube video loads correctly
- [ ] Lighthouse score > 90

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your platform supports:
- Next.js 14 App Router
- Edge Runtime
- Environment variables

## 📧 Email Configuration

**Using Resend Default Domain:**
- Emails sent from `onboarding@resend.dev`
- Works immediately without DNS setup

**Using Custom Domain:**
1. Add domain in Resend dashboard
2. Configure DNS records (SPF, DKIM, DMARC)
3. Update `from` address in `/api/subscribe/route.ts`

## 🔒 Security Notes

- Service Role Key is used server-side only (never exposed to client)
- RLS policies should be configured based on your requirements
- All form inputs are validated with Zod schema
- Edge Runtime provides additional security layer

## 📝 License

[Your License Here]

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📞 Support

For support, email support@tuvitinhhoa.com or join our Discord.

---

**Built with 💛 by Nghiên cứu Tử Vi Team**
# tuvi-squeeze-page
