"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Trash2, ArrowLeft, Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // 假設你有安裝 sonner，或是用 alert 代替

// 匯入你的 Modal (請確保這些 Modal 也是 Client Component)
import { EnrollStudentModal } from "@/components/admin/enroll-student-modal";
import { UploadGradesModal } from "@/components/admin/upload-grades-modal";

// 初始化 Supabase Client (前端用)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function CourseStudentsContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);

  // 1. 載入資料
  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // A. 取得課程資訊
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // B. 取得已加入的學生
        const { data: enrolledData, error: enrolledError } = await supabase
          .from("course_students")
          .select("*, students(*)")
          .eq("course_id", courseId);

        if (enrolledError) throw enrolledError;
        // 整理資料結構
        const students = enrolledData?.map((item: any) => item.students) || [];
        setEnrolledStudents(students);

        // C. 取得所有在學學生 (給 Modal 用)
        const { data: allData } = await supabase
          .from("students")
          .select("id, name")
          .eq("status", "在學");
        
        setAllStudents(allData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("讀取資料失敗");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // 2. 處理移除學生 (原本的 Server Action 改成這個)
  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("確定要將此學生從課程中移除嗎？")) return;

    try {
      const { error } = await supabase
        .from("course_students")
        .delete()
        .eq("course_id", courseId)
        .eq("student_id", studentId);

      if (error) throw error;

      toast.success("移除成功");
      
      // 更新畫面 (過濾掉被刪除的學生)
      setEnrolledStudents((prev) => prev.filter((s) => s.id !== studentId));

    } catch (error) {
      console.error(error);
      toast.error("移除失敗");
    }
  };

  // 如果沒有 ID
  if (!courseId) {
    return <div className="p-8">無效的課程 ID</div>;
  }

  // 載入中畫面
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* 頂部導航與標題 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          {/* 注意：這裡的回上一頁可能需要依需求調整 */}
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {course?.name} - 學生名單
          </h2>
          <p className="text-gray-500">
            授課老師：{course?.teacher} | 目前人數：{enrolledStudents.length} 人
          </p>
        </div>
      </div>

      {/* 功能按鈕區 */}
      <div className="flex justify-end gap-2">
        {/* 請確保這些 Modal 內部也改成了 Client Side 寫法，或暫時註解掉測試 */}
        <UploadGradesModal courseId={parseInt(courseId)} />
        
        <EnrollStudentModal 
          courseId={parseInt(courseId)} 
          allStudents={allStudents} 
        />
      </div>

      {/* 學生列表表格 */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>學校</TableHead>
              <TableHead>年級</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrolledStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                  目前沒有學生，請點擊上方按鈕加入。
                </TableCell>
              </TableRow>
            ) : (
              enrolledStudents.map((student: any) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell className="text-right">
                    {/* 改成一般的 Button onClick */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      移出
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ✅ 記得用 Suspense 包起來，因為用了 useSearchParams
export default function CourseStudentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseStudentsContent />
    </Suspense>
  );
}