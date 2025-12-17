import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddStudentModal } from "@/components/admin/add-student-modal"; // <--- 改用這個

export default async function StudentsPage() {
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

  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return <div className="p-4 text-red-500">讀取資料錯誤：{error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">學生管理</h2>
          <p className="text-gray-500">檢視並管理所有補習班學生資料</p>
        </div>
        {/* 這裡換成了新的彈出視窗按鈕 */}
        <AddStudentModal />
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>學校</TableHead>
              <TableHead>年級</TableHead>
              <TableHead>聯絡電話</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.school}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <Badge variant={student.status === "在學" ? "default" : "secondary"}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {/* 未來這裡可以放編輯按鈕 */}
                  <span className="text-sm text-gray-400">編輯</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}