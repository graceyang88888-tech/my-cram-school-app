import { MetadataRoute } from 'next';

// 👇 針對 output: 'export' (打包 App) 必須加這一行！
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '我的補習班',
    short_name: '補習班App',
    description: '專業補習班管理系統',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}