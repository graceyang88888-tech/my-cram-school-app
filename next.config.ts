import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',        // 👈 關鍵：告訴 Next.js 我們要匯出靜態檔案
  images: {
    unoptimized: true,     // 👈 關鍵：App 內無法使用 Next.js 的圖片優化伺服器，必須關閉
  },
};

export default nextConfig;
