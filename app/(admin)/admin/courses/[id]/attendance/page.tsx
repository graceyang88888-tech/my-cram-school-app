// app/(admin)/admin/courses/[id]/attendance/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AttendanceSheet } from "@/components/admin/attendance-sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AttendancePage({ params }: PageProps) {
  const { id } = await params;
  const courseId = parseInt(id);
  const today = new Date().toISOString().split('T')[0]; // 取得 YYYY-MM-DD

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

  // 1. 取得課程資訊
  const { data: course } = await supabase
    .from("courses")
    .select("name")
    .eq("id", courseId)
    .single();

  if (!course) return notFound();

  // 2. 取得該班級所有學生
  const { data: enrolledData } = await supabase
    .from("course_students")
    .select("students(id, name)")
    .eq("course_id", courseId);

  // 整理資料格式
  const students = enrolledData?.map((d: any) => d.students) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {course.name} - 今日點名
          </h2>
          <p className="text-gray-500">日期：{today}</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border">
          ⚠️ 此班級尚無學生，請先至「管理學生」加入名單。
          <div className="mt-4">
            <Button asChild variant="outline">
               <Link href={`/admin/courses/${courseId}/students`}>前往加入學生</Link>
            </Button>
          </div>
        </div>
      ) : (
        // 載入點名表單元件
        <AttendanceSheet 
          courseId={courseId} 
          students={students} 
          date={today} 
        />
      )}
    </div>
  );
}