"use client"; // 👈 關鍵：轉成 Client Component

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, Activity, Loader2 } from "lucide-react";

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studentCount: 0,
    courseCount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // 1. 抓取學生總數
        const { count: studentCount, error: studentError } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true }); // head: true 代表只抓數量，不抓內容 (省流量)

        // 2. 抓取課程總數
        const { count: courseCount, error: courseError } = await supabase
          .from("courses")
          .select("*", { count: "exact", head: true });

        if (studentError) throw studentError;
        if (courseError) throw courseError;

        setStats({
          studentCount: studentCount || 0,
          courseCount: courseCount || 0,
        });
      } catch (error) {
        console.error("讀取儀表板數據失敗:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">儀表板</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 學生人數卡片 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總學生數</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentCount}</div>
            <p className="text-xs text-muted-foreground">
              目前在學人數
            </p>
          </CardContent>
        </Card>

        {/* 課程數量卡片 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">開設課程</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courseCount}</div>
            <p className="text-xs text-muted-foreground">
              本學期活躍課程
            </p>
          </CardContent>
        </Card>

        {/* 範例卡片：財務狀況 (靜態展示) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月營收</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              比上個月成長 +20.1%
            </p>
          </CardContent>
        </Card>

        {/* 範例卡片：今日出席率 (靜態展示) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日出席率</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              比昨天上升 +4%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}