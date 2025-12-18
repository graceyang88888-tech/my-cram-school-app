"use client"; // 👈 1. 變成 Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js"; // 直接使用 JS SDK
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"; // 引入轉圈圈圖示

// 初始化 Supabase Client (前端專用)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. 改用 onSubmit 處理函式，而不是 Server Action
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 3. 直接在前端呼叫 Supabase 登入
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // 登入成功，跳轉到首頁或 Admin 頁面
      router.push("/admin/courses"); 
      router.refresh(); // 強制刷新以更新狀態

    } catch (err: any) {
      console.error("登入失敗:", err);
      setError(err.message || "登入失敗，請檢查帳號密碼");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            補習班管理系統
          </CardTitle>
          <CardDescription>
            請輸入您的帳號密碼以繼續
          </CardDescription>
        </CardHeader>

        {/* 4. 改成 onSubmit */}
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            
            {/* 錯誤訊息顯示區 */}
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                <p>{error}</p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">電子郵件 (帳號)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@test.com"
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登入中...
                </>
              ) : (
                "登入"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}