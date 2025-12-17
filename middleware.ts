import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. 初始化 Next.js 的 Response 物件
  // 這一步是為了確保我們可以操作 Cookies (Supabase Auth 依賴 Cookies)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. 建立 Supabase Client (Middleware 專用版)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. 取得目前登入的使用者資訊
  // 注意：getUser() 比 getSession() 更安全，因為它會向 Supabase 伺服器再次確認 Token 有效性
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. 定義路徑規則
  const path = request.nextUrl.pathname;
  const isLoginPage = path.startsWith("/login");
  const isAdminPath = path.startsWith("/admin");
  const isParentPath = path.startsWith("/parent");

  // -----------------------------------------------------------
  // 規則 A: 未登入使用者處理
  // -----------------------------------------------------------
  if (!user && !isLoginPage) {
    // 如果沒登入，且不是在登入頁，強制導向登入頁
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // -----------------------------------------------------------
  // 規則 B: 已登入使用者處理
  // -----------------------------------------------------------
  if (user) {
    // 從 user_metadata 取得角色 (這是關鍵優化，避免再去查資料庫)
    // 假設您在註冊時已將 role 寫入 metadata: { role: 'admin' | 'parent' }
    const role = user.user_metadata.role as string;

    // B-1: 如果已登入卻還在登入頁，依角色導向首頁
    if (isLoginPage) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/parent/home", request.url));
      }
    }

    // B-2: 權限保護 - 家長不可以進後台
    if (isAdminPath && role !== "admin") {
      return NextResponse.redirect(new URL("/parent/home", request.url));
    }

    // B-3: 權限保護 - 管理員不進家長頁面 (視需求而定，通常分開比較乾淨)
    if (isParentPath && role !== "parent") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // 如果都符合規則，繼續處理請求
  return response;
}

// 設定 Middleware 的匹配範圍
// 排除靜態檔案 (_next/static, images, favicon) 避免浪費資源
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};