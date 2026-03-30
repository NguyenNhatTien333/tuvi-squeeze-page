import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nghiên cứu Tử Vi - Khám Phá Vận Mệnh Của Bạn",
  description: "Nhận ngay cẩm nang miễn phí giải mã 12 cung chức Tử Vi. Khám phá bản đồ vận mệnh và làm chủ cuộc đời.",
  keywords: ["tử vi", "nghiên cứu tử vi", "12 cung chức", "vận mệnh", "học tử vi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${playfair.variable} ${beVietnam.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-bevietnam">{children}</body>
    </html>
  );
}
