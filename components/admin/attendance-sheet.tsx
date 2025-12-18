"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js"; // 改用前端 SDK
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner"; 

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Student = {
  id: number;
  name: string;
};

export function AttendanceSheet({ 
  courseId, 
  students,
  date
}: { 
  courseId: number; 
  students: Student[];
  date: string;
}) {
  const [loading, setLoading] = useState(false);
  
  // 本地狀態管理每個學生的出席狀況 (預設全部 present)
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>(
    students.reduce((acc, s) => ({ ...acc, [s.id]: "present" }), {})
  );

  const toggleStatus = (studentId: number, status: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  // 改成純前端的提交處理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 阻止表單預設跳轉
    setLoading(true);

    try {
      // 1. 準備要寫入的資料陣列
      const attendanceData = students.map((student) => ({
        course_id: courseId,
        student_id: student.id,
        date: date,
        status: attendanceMap[student.id] || 'present',
      }));

      // 2. 呼叫 Supabase 進行批量寫入 (Upsert: 有就更新，沒有就新增)
      // 注意：你的 attendance 表格需要設定 (student_id, course_id, date) 為唯一鍵 (Unique Constraint) 才能正確運作 upsert
      const { error } = await supabase
        .from("attendance")
        .upsert(attendanceData, { onConflict: 'student_id, course_id, date' }); // 假設你有設這三個欄位為複合唯一鍵

      if (error) throw error;

      toast.success(`成功儲存 ${date} 的點名紀錄！`);

    } catch (error: any) {
      console.error("點名儲存失敗:", error);
      toast.error("儲存失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => {
          const status = attendanceMap[student.id];
          return (
            <Card key={student.id} className={`p-4 flex items-center justify-between transition-colors ${
              status === 'absent' ? 'bg-red-50 border-red-200' : 
              status === 'late' ? 'bg-yellow-50 border-yellow-200' : 'bg-white'
            }`}>
              <div>
                <div className="font-bold text-lg">{student.name}</div>
                <Badge variant="outline" className="mt-1">
                  {status === 'present' ? '✅ 出席' : status === 'absent' ? '❌ 缺席' : '⚠️ 遲到'}
                </Badge>
              </div>

              <div className="flex gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant={status === 'present' ? 'default' : 'ghost'}
                  onClick={() => toggleStatus(student.id, 'present')}
                  className="h-8 w-8 rounded-full"
                  title="出席"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant={status === 'late' ? 'default' : 'ghost'}
                  onClick={() => toggleStatus(student.id, 'late')}
                  className="h-8 w-8 rounded-full bg-yellow-500 hover:bg-yellow-600"
                  title="遲到"
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant={status === 'absent' ? 'destructive' : 'ghost'}
                  onClick={() => toggleStatus(student.id, 'absent')}
                  className="h-8 w-8 rounded-full"
                  title="缺席"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "💾 儲存點名紀錄"}
        </Button>
      </div>
    </form>
  );
}