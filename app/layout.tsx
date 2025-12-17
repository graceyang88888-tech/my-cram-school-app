import type { Metadata } from "next";
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