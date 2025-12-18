"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { ArrowLeft, Save, CheckCircle, XCircle, Clock } from "lucide-react";

// 內部組件：負責抓取 ID 和顯示內容
function AttendanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ✅ 這裡改成用 get 抓取網址上的 ?id=xxx
  const courseId = searchParams.get("id");
  
  // 模擬一些假資料 (之後可接資料庫)
  const [students, setStudents] = useState([
    { id: 1, name: "張小明", status: "present" },
    { id: 2, name: "李美華", status: "absent" },
    { id: 3, name: "王大同", status: "late" },
    { id: 4, name: "陳小乖", status: "present" },
  ]);

  if (!courseId) {
    return <div className="p-6">找不到課程 ID，請回上一頁重新選擇。</div>;
  }

  const handleStatusChange = (studentId: number, newStatus: string) => {
    setStudents(prev => 
      prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s)
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 頂部導覽 */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">課程點名表</h1>
          <p className="text-gray-500 text-sm">課程 ID: {courseId}</p>
        </div>
      </div>

      {/* 學生列表 */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
            <span className="font-medium text-lg">{student.name}</span>
            
            <div className="flex gap-2">
              {/* 出席按鈕 */}
              <button
                onClick={() => handleStatusChange(student.id, "present")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                  student.status === "present" 
                    ? "bg-green-100 border-green-500 text-green-700" 
                    : "hover:bg-gray-50 text-gray-500"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">出席</span>
              </button>

              {/* 遲到按鈕 */}
              <button
                onClick={() => handleStatusChange(student.id, "late")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                  student.status === "late" 
                    ? "bg-yellow-100 border-yellow-500 text-yellow-700" 
                    : "hover:bg-gray-50 text-gray-500"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">遲到</span>
              </button>

              {/* 缺席按鈕 */}
              <button
                onClick={() => handleStatusChange(student.id, "absent")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                  student.status === "absent" 
                    ? "bg-red-100 border-red-500 text-red-700" 
                    : "hover:bg-gray-50 text-gray-500"
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm">缺席</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Save className="w-5 h-5" />
        儲存點名紀錄
      </button>
    </div>
  );
}

// ✅ 主頁面：一定要用 Suspense 包起來！
export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">載入課程資訊中...</div>}>
      <AttendanceContent />
    </Suspense>
  );
}