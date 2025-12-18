"use client";

import Link from "next/link";
import { Plus, Users, Calendar, ArrowRight } from "lucide-react";

// 假資料 (之後你可以換成從資料庫讀取)
const courses = [
  {
    id: "1",
    name: "國中數學進階班",
    teacher: "王小明",
    time: "週一 18:30 - 20:30",
    students: 12,
  },
  {
    id: "2",
    name: "高中英文衝刺班",
    teacher: "陳美麗",
    time: "週三 19:00 - 21:00",
    students: 25,
  },
  {
    id: "3",
    name: "國小作文創意班",
    teacher: "李大同",
    time: "週六 10:00 - 12:00",
    students: 8,
  },
];

export default function CoursesPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* 頁面標題與動作列 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">課程管理</h1>
          <p className="text-muted-foreground mt-1">
            管理所有開設的課程與點名狀況
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:bg-black/90 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          新增課程
        </button>
      </div>

      {/* 課程列表 (卡片式設計) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="space-y-4">
              {/* 課程標題 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xl leading-none tracking-tight">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {course.teacher} 老師
                </p>
              </div>

              {/* 課程資訊 */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{course.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{course.students} 位學生</span>
                </div>
              </div>
            </div>

            {/* 底部按鈕區 */}
            <div className="mt-6 flex items-center gap-3 pt-4 border-t">
              {/* ✅ 重點修改：這裡改用 Query Param (?id=...) */}
              <Link
                href={`/admin/courses/attendance?id=${course.id}`}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                課程點名
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}