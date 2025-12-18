"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 用來刷新頁面
import { createClient } from "@supabase/supabase-js"; // 前端 SDK
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // 假設你有裝 sonner，沒有的話可以用 alert

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function AddStudentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 改成純前端的提交處理
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 阻止表單預設跳轉
    setLoading(true);

    // 從表單抓取資料
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const school = formData.get("school") as string;
    const grade = formData.get("grade") as string;
    const phone = formData.get("phone") as string;

    try {
      // 1. 直接呼叫 Supabase 寫入資料庫
      const { error } = await supabase
        .from("students")
        .insert({
          name,
          school,
          grade,
          phone,
          status: "在學", // 預設狀態
          // parent_user_id: ... 如果有的話可以在這裡加
        });

      if (error) throw error;

      // 2. 成功後的處理
      toast.success("學生新增成功！");
      setOpen(false); // 關閉視窗
      router.refresh(); // 刷新頁面數據
      // window.location.reload(); // 如果 router.refresh() 沒反應，可以暫時用這行強制重整

    } catch (error: any) {
      console.error("新增失敗:", error);
      toast.error("新增失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增學生
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增學生</DialogTitle>
          <DialogDescription>
            請輸入學生的基本資料，點擊儲存以建立檔案。
          </DialogDescription>
        </DialogHeader>

        {/* 表單區域: 改用 onSubmit */}
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名
            </Label>
            <Input id="name" name="name" className="col-span-3" required disabled={loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="school" className="text-right">
              學校
            </Label>
            <Input id="school" name="school" className="col-span-3" disabled={loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              年級
            </Label>
            <Input id="grade" name="grade" placeholder="例如：國二" className="col-span-3" disabled={loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              電話
            </Label>
            <Input id="phone" name="phone" className="col-span-3" disabled={loading} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "儲存中..." : "儲存資料"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}