"use client"; // 👈 關鍵：轉成 Client Component

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { AddStudentModal } from "@/components/admin/add-student-modal";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Loader2, RefreshCw } from "lucide-react";

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 定義讀取資料的函式
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: true }); // 依照 ID 排序

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("讀取學生資料失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  // 頁面載入時讀取一次
  useEffect(() => {
    fetchStudents();
  }, []);

  // 過濾搜尋結果
  const filteredStudents = students.filter(
    (student) =>
      student.name?.includes(searchTerm) ||
      student.school?.includes(searchTerm) ||
      student.grade?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">學生管理</h2>
          <p className="text-muted-foreground">
            管理所有學生的基本資料與狀態
          </p>
        </div>
        <AddStudentModal />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋姓名、學校或年級..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon" onClick={fetchStudents} title="重新整理">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>學校</TableHead>
              <TableHead>年級</TableHead>
              <TableHead>電話</TableHead>
              <TableHead>狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    載入中...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  沒有找到符合的學生資料。
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.school || "-"}</TableCell>
                  <TableCell>{student.grade || "-"}</TableCell>
                  <TableCell>{student.phone || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        student.status === "在學"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status || "未知"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}