// actions/attendance-actions.ts
'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveAttendanceAction(formData: FormData) {
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

  const courseId = formData.get("courseId") as string;
  const date = formData.get("date") as string;
  
  // 1. 取得所有被提交的學生 ID (從 hidden input 取得)
  // 我們約定前端會傳送 student_ids 字串，用逗號分隔
  const studentIdsString = formData.get("studentIds") as string;
  const studentIds = studentIdsString.split(",");

  const updates = studentIds.map((studentId) => {
    // 取得該學生的狀態，欄位名稱格式為 status-{id}
    const status = formData.get(`status-${studentId}`) as string;
    
    return {
      course_id: parseInt(courseId),
      student_id: parseInt(studentId),
      date: date,
      status: status || 'present', // 預設為出席
    };
  });

  // 2. 批次寫入資料庫 (Upsert: 有則更新，無則新增)
  const { error } = await supabase
    .from("attendance")
    .upsert(updates, { onConflict: 'course_id, student_id, date' });

  if (error) {
    console.error("點名失敗:", error);
    return;
  }

  // 3. 完成後回到課程頁，並刷新資料
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses`);
}