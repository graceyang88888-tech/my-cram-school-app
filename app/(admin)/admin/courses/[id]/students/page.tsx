// app/(admin)/admin/courses/[id]/students/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// 匯入自定義元件
import { EnrollStudentModal } from "@/components/admin/enroll-student-modal";
import { UploadGradesModal } from "@/components/admin/upload-grades-modal"; // <--- 新增成績上傳按鈕
import { removeStudentAction } from "@/actions/course-actions";

// 定義頁面參數型別 (Next.js 15+ params 為 Promise)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseStudentsPage({ params }: PageProps) {
  // 1. 解析網址參數 (取得課程 ID)
  const { id } = await params;
  const courseId = parseInt(id);

  // 2. 初始化 Supabase Client
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} }
      },
    }
  );

  // 3. 取得「這門課程」的詳細資訊
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) return notFound(); // 如果找不到課程，顯示 404

  // 4. 取得「已加入這門課」的學生
  // 使用關聯查詢：course_students -> students
  const { data: enrolledData } = await supabase
    .from("course_students")
    .select("*, students(*)") 
    .eq("course_id", courseId);

  // 整理資料格式 (把 students 物件抽出來)
  const enrolledStudents = enrolledData?.map((item: any) => item.students) || [];

  // 5. 取得「所有在學學生」列表 (給彈出視窗的下拉選單用)
  const { data: allStudents } = await supabase
    .from("students")
    .select("id, name")
    .eq("status", "在學");

  return (
    <div className="space-y-6">
      {/* 頂部導航與標題 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {course.name} - 學生名單
          </h2>
          <p className="text-gray-500">
            授課老師：{course.teacher} | 目前人數：{enrolledStudents.length} 人
          </p>
        </div>
      </div>

      {/* 功能按鈕區：上傳成績 & 加入學生 */}
      <div className="flex justify-end gap-2">
        {/* 按鈕 1: 批次上傳成績 (CSV) */}
        <UploadGradesModal courseId={courseId} />

        {/* 按鈕 2: 加入單一學生 */}
        <EnrollStudentModal 
          courseId={courseId} 
          allStudents={allStudents || []} 
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
                    {/* 移除學生按鈕 (包在 Form 裡以呼叫 Server Action) */}
                    <form action={removeStudentAction}>
                      <input type="hidden" name="courseId" value={courseId} />
                      <input type="hidden" name="studentId" value={student.id} />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        移出
                      </Button>
                    </form>
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