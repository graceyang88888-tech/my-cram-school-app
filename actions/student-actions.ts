// actions/student-actions.ts
'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createStudentAction(formData: FormData) {
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

  // 1. 從表單取得資料
  const name = formData.get("name") as string;
  const school = formData.get("school") as string;
  const grade = formData.get("grade") as string;
  const phone = formData.get("phone") as string;

  // 2. 寫入資料庫
  const { error } = await supabase.from("students").insert({
    name,
    school,
    grade,
    phone,
    status: '在學' // 預設狀態
  });

  if (error) {
    console.error("新增失敗:", error);
    // 這裡可以做錯誤處理，簡單起見我們先印出 Log
    return;
  }

  // 3. 關鍵一步：通知 Next.js 重新抓取 "/admin/students" 的資料
  // 這樣介面不需要重新整理，新資料就會直接出現
  revalidatePath("/admin/students");
}