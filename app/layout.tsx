import type { Metadata , Viewport} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; // ✅ 引入通知功能
import "./globals.css";

// ✅ 引入頁首與頁尾組件
// (請確保你已經建立了 components/Header.tsx 和 components/Footer.tsx)
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的補習班 App",
  description: "專業補習班管理系統",
  appleWebApp: {
    capable: true,
    title: "我的補習班",
    statusBarStyle: "default",
  },
  // ✅ 新增這一段：告訴 iPhone 去哪裡找圖示
  icons: {
    icon: "/icon.png",      // 給網頁瀏覽器看的 favicon
    apple: "/icon.png",     // 🍎 給 iPhone 桌面捷徑看的圖示
  },
};

// 2. 新增這段 Viewport 設定
export const viewport: Viewport = {
  themeColor: "#3b82f6", // 設定手機瀏覽器頂部的顏色
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // 禁止縮放，更有 App 的感覺
  userScalable: false,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* 1. 頁首 */}
        <Header />

        {/* 2. 主要內容區 (設定 flex-1 讓它自動撐開高度，把 Footer 壓到底部) */}
        <main className="flex-1">
            {children}
        </main>

        {/* 3. 頁尾 */}
        <Footer />
        
        {/* 4. 通知元件 (讓 attendance-sheet.tsx 的通知可以顯示) */}
        <Toaster />
      </body>
    </html>
  );
}