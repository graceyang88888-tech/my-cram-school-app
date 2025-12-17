import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Activity } from "lucide-react";

export default async function AdminDashboard() {
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

  // 1. 撈取統計數據 (這裡示範計算總數)
  const { count: studentCount } = await supabase.from("students").select("*", { count: 'exact', head: true });
  const { count: courseCount } = await supabase.from("courses").select("*", { count: 'exact', head: true });
  
  // 模擬一些假數據讓畫面豐富一點 (未來可做真的)
  const totalRevenue = 158000; 
  const attendanceRate = "94.2%";

  return (
    <div className="flex-1 space-y-8">
      {/* 標題區 */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">儀表板</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">最後更新：剛剛</span>
        </div>
      </div>

      {/* 數據卡片區 (Grid Layout) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* 卡片 1: 總營收 */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">本月營收</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">+20.1% 較上月</p>
          </CardContent>
        </Card>

        {/* 卡片 2: 學生總數 */}
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">學生總數</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount || 0} 人</div>
            <p className="text-xs text-gray-500 mt-1">目前在學學生</p>
          </CardContent>
        </Card>

        {/* 卡片 3: 開課數量 */}
        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">開設課程</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseCount || 0} 堂</div>
            <p className="text-xs text-gray-500 mt-1">本學期課程</p>
          </CardContent>
        </Card>

        {/* 卡片 4: 出席率 */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">平均出席率</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}</div>
            <p className="text-xs text-gray-500 mt-1">過去 30 天</p>
          </CardContent>
        </Card>
      </div>

      {/* 下半部：可以放最近的活動紀錄 (這裡先做一個漂亮的佔位符) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>近期營收趨勢</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-md border border-dashed">
              (這裡未來可以放圖表 Chart)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>最近報名學生</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {/* 假裝有最近報名的學生列表 */}
                {['林小華', '陳大明', '張美麗'].map((name, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                      {name[0]}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{name}</p>
                      <p className="text-xs text-muted-foreground">剛剛報名了數學班</p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-green-600">+$5,000</div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}