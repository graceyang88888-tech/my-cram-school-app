import { loginAction } from "@/actions/auth-actions";
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

// 定義 Props 型別，確保相容性
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage(props: Props) {
  // 1. 安全地解析 searchParams (加上 await)
  const searchParams = await props.searchParams;
  
  // 2. 安全地讀取 error (如果沒有 error 則為 undefined)
  const error = searchParams?.error;

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

        <form action={loginAction}>
          <CardContent className="grid gap-4">
            
            {/* 錯誤訊息顯示區 - 這裡檢查 error 是否存在且是字串 */}
            {typeof error === "string" && error && (
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              登入
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}