'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // 修改點 1: 加上 await
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
            return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({ name, value, options }) => 
                    cookieStore.set(name, value, options)
                )
            } catch {
                // 在 Server Action 中設定 cookie 有時會因為回應已送出而報錯
                // 這裡的 try-catch 是為了避免非關鍵錯誤中斷流程
            }
        }
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=登入失敗，請檢查帳號密碼");
  }

  const role = data.user?.user_metadata?.role;

  if (role === 'admin') {
    return redirect("/admin/dashboard");
  } else if (role === 'parent') {
    return redirect("/parent/home");
  } else {
    return redirect("/");
  }
}

export async function signOutAction() {
  // 修改點 2: 這裡也要加上 await
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
             try {
                cookiesToSet.forEach(({ name, value, options }) => 
                    cookieStore.set(name, value, options)
                )
             } catch {}
        }
      },
    }
  );

  await supabase.auth.signOut();
  return redirect("/login");
}