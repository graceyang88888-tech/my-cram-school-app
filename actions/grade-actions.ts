// actions/grade-actions.ts
'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 定義我們要接收的資料格式
type GradeInput = {
  studentName: string;
  score: number;
  examName: string;
};

export async function uploadGradesAction(courseId: number, grades: GradeInput[]) {
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

  // 1. 先把這門課的所有學生抓出來 (建立 姓名 -> ID 的對照表)
  // 這樣我們才能知道 CSV 裡的 "張小明" 是哪個 ID
  const { data: enrolledStudents } = await supabase
    .from("course_students")
    .select("student_id, students(id, name)")
    .eq("course_id", courseId);

  if (!enrolledStudents) return { error: "找不到班級學生資料" };

  // 建立對照 Map: { "張小明": 101, "李小華": 102 }
  const nameToIdMap = new Map<string, number>();
  enrolledStudents.forEach((item: any) => {
    if (item.students) {
      nameToIdMap.set(item.students.name, item.students.id);
    }
  });

  // 2. 準備要寫入的資料
  const recordsToInsert = [];
  const errors = []; // 紀錄哪些學生找不到

  for (const grade of grades) {
    const studentId = nameToIdMap.get(grade.studentName);
    
    if (studentId) {
      recordsToInsert.push({
        course_id: courseId,
        student_id: studentId,
        exam_name: grade.examName,
        score: grade.score,
        date: new Date().toISOString().split('T')[0]
      });
    } else {
      errors.push(grade.studentName); // 找不到這個學生
    }
  }

  // 3. 寫入資料庫
  if (recordsToInsert.length > 0) {
    const { error } = await supabase.from("grades").insert(recordsToInsert);
    if (error) return { error: error.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  
  return { 
    success: true, 
    insertedCount: recordsToInsert.length,
    failedNames: errors 
  };
}