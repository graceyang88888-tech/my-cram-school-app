// app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '我的補習班',
    short_name: '補習班App',
    description: '專業補習班管理系統',
    start_url: '/',
    display: 'standalone', // ✨ 關鍵：這行會讓瀏覽器的網址列消失，看起來像原生 App
    background_color: '#ffffff',
    theme_color: '#3b82f6', // App 頂部狀態列的顏色 (這裡設為藍色)
    icons: [
      {
        src: '/icon.png', // 指向你剛剛放在 public 的圖片
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}