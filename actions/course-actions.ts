// actions/course-actions.ts
'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. 加入學生 (選課)
export async function enrollStudentAction(formData: FormData) {
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
  const studentId = formData.get("studentId") as string;

  if (!studentId || !courseId) return;

  const { error } = await supabase.from("course_students").insert({
    course_id: courseId,
    student_id: studentId
  });

  if (error) {
    console.error("選課失敗:", error);
    return;
  }

  revalidatePath(`/admin/courses/${courseId}/students`);
}

// 2. 移除學生 (退選)
export async function removeStudentAction(formData: FormData) {
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
  const studentId = formData.get("studentId") as string;

  await supabase
    .from("course_students")
    .delete()
    .match({ course_id: courseId, student_id: studentId });

  revalidatePath(`/admin/courses/${courseId}/students`);
}