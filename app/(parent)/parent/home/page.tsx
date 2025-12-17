// app/(parent)/parent/home/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LogOut, User, Calendar, 
  Phone, MessageCircle, FileText, 
  Trophy, TrendingUp 
} from "lucide-react";

export default async function ParentHomePage() {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 修改重點：這裡多撈了 grades (成績)
  const { data: students } = await supabase
    .from("students")
    .select(`
      id, name, school,
      attendance (date, status, courses ( name )),
      grades ( exam_name, score, date, courses ( name ) )
    `)
    .eq("parent_user_id", user.id);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 頂部 Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white p-6 pb-12 rounded-b-[2rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">早安，家長！</h1>
            <p className="text-blue-100 text-sm">歡迎使用電子聯絡簿</p>
          </div>
          <form action={signOutAction}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 -mt-8 z-20 pb-10">
        {(!students || students.length === 0) ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">目前尚無資料</p>
          </div>
        ) : (
          <div className="space-y-8">
            {students.map((student) => (
              <div key={student.id} className="space-y-6">
                
                {/* 學生資訊卡片 */}
                <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border-2 border-white shadow-sm">
                        {student.name[0]}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{student.name}</h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                           <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                           {student.school}
                        </p>
                      </div>
                   </div>
                   <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                      詳細資料
                   </Button>
                </div>

                {/* 快捷功能區 */}
                <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm active:scale-95 transition-transform">
                        <div className="bg-orange-100 p-2 rounded-full mb-1 text-orange-600"><FileText className="h-5 w-5"/></div>
                        <span className="text-xs text-gray-600">請假申請</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm active:scale-95 transition-transform">
                        <div className="bg-blue-100 p-2 rounded-full mb-1 text-blue-600"><MessageCircle className="h-5 w-5"/></div>
                        <span className="text-xs text-gray-600">聯絡老師</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm active:scale-95 transition-transform">
                        <div className="bg-purple-100 p-2 rounded-full mb-1 text-purple-600"><Phone className="h-5 w-5"/></div>
                        <span className="text-xs text-gray-600">補習班電話</span>
                    </button>
                </div>

                {/* --- 新增：成績紀錄區塊 --- */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          最新成績
                        </h3>
                    </div>

                    {student.grades && student.grades.length > 0 ? (
                      <div className="grid gap-3">
                        {student.grades.map((grade: any, index: number) => (
                          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-purple-500 flex items-center justify-between">
                              <div>
                                 <p className="text-xs text-gray-400 mb-1">{grade.date} | {grade.courses?.name}</p>
                                 <p className="font-bold text-gray-800">{grade.exam_name}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`text-2xl font-bold ${grade.score >= 90 ? 'text-green-600' : grade.score < 60 ? 'text-red-500' : 'text-purple-600'}`}>
                                  {grade.score}
                                </span>
                                <span className="text-xs text-gray-400">分</span>
                              </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-400 bg-white rounded-xl border border-dashed">
                        尚無成績紀錄
                      </div>
                    )}
                </div>

                {/* --- 出席紀錄區塊 --- */}
                <div>
                    <div className="flex items-center justify-between px-2 mb-2 mt-2">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          最近出席
                        </h3>
                    </div>

                    {student.attendance && student.attendance.length > 0 ? (
                      <div className="space-y-3">
                        {student.attendance.map((record: any, index: number) => (
                          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                                    <TrendingUp className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-gray-800">{record.courses?.name}</p>
                                    <p className="text-xs text-gray-400">{record.date}</p>
                                 </div>
                              </div>
                              <Badge 
                                  className={`${
                                      record.status === 'present' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                                      record.status === 'late' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' : 
                                      'bg-red-100 text-red-700 hover:bg-red-100'
                                  } border-0 px-3 py-1`}
                              >
                                  {record.status === 'present' ? '準時' : record.status === 'late' ? '遲到' : '缺席'}
                              </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-gray-400 bg-white rounded-xl border border-dashed">
                        近期無出席紀錄
                      </div>
                    )}
                </div>

              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}