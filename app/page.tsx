import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        
        {/* 標題區域 */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          歡迎來到 <span className="text-blue-600">我的補習班</span>
        </h1>
        
        <p className="max-w-md text-lg text-gray-600 dark:text-gray-300">
          我們提供最專業的教學，幫助學生考取理想學校。
          立即加入我們，開啟成功之路。
        </p>

        {/* 按鈕區域 */}
        <div className="flex gap-4">
          <a
            href="#"
            className="rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            了解課程
          </a>
          <a
            href="#"
            className="rounded-full border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            聯絡我們
          </a>
        </div>

      </main>
    </div>
  );
}