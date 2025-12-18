"use client"; // 👈 必須是 Client Component

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
// ... 其他原本的 import (例如 UI 组件)

// 1. 建立一個內部組件來處理邏輯
function AttendanceContent() {
  const searchParams = useSearchParams();
  // 👇 這裡改成用 get 抓取網址上的 ?id=xxx
  const courseId = searchParams.get("id"); 

  if (!courseId) {
    return <div>找不到課程 ID</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">課程點名表</h1>
      <p>目前正在檢視課程 ID: {courseId}</p>
      
      {/* 這裡放你原本的點名表內容。
         原本用 params.id 的地方，現在全部改用 courseId 變數即可。
      */}
    </div>
  );
}

// 2. 主頁面 (必須包裹 Suspense，否則打包會報錯)
export default function AttendancePage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <AttendanceContent />
    </Suspense>
  );
}