// app/(admin)/admin/courses/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function CoursesPage() {
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

  // 讀取課程資料
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">課程管理</h2>
          <p className="text-gray-500">管理開課資訊與班級學生</p>
        </div>
        <Button>新增課程</Button>
      </div>

      {/* 課程列表 - 改用卡片式設計，比較適合展示班級 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.teacher} 老師</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {course.schedule}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="mr-2 h-4 w-4" />
                ${course.fee?.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
               {/* 這裡我們預留兩個重要功能的入口 */}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/courses/${course.id}/students`}>
                  <Users className="mr-2 h-4 w-4" />
                  管理學生
                </Link>
              </Button>
                <Button size="sm" asChild>
                    <Link href={`/admin/courses/${course.id}/attendance`}>
                    開始點名
                     </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}