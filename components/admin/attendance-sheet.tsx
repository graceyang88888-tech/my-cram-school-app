// components/admin/attendance-sheet.tsx
'use client'

import { useState } from "react";
import { saveAttendanceAction } from "@/actions/attendance-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";
import { toast } from "sonner"; // 提示訊息 (如果沒裝 sonner 可忽略或用 alert)

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

  return (
    <form action={saveAttendanceAction} className="space-y-6">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="date" value={date} />
      {/* 將所有學生 ID 串起來傳給後端，方便後端知道要處理哪些人 */}
      <input type="hidden" name="studentIds" value={students.map(s => s.id).join(",")} />

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

              {/* 隱藏的 input，用來隨表單送出該學生的狀態 */}
              <input type="hidden" name={`status-${student.id}`} value={status} />

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
        <Button type="submit" size="lg" className="w-full md:w-auto">
          💾 儲存今日 ({date}) 點名紀錄
        </Button>
      </div>
    </form>
  );
}