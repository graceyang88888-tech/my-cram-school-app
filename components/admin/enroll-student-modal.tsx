"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // 如果沒有安裝 sonner，請改用 alert 或 console.log

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EnrollStudentModalProps {
  courseId: number;
  allStudents: { id: number; name: string }[];
}

export function EnrollStudentModal({ courseId, allStudents }: EnrollStudentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudentId) {
      toast.error("請選擇一位學生");
      return;
    }
    
    setLoading(true);

    try {
      // 1. 檢查是否已經加入過 (避免重複)
      const { data: existing } = await supabase
        .from("course_students")
        .select("id")
        .eq("course_id", courseId)
        .eq("student_id", selectedStudentId)
        .single();

      if (existing) {
        toast.error("該學生已經在名單中");
        setLoading(false);
        return;
      }

      // 2. 寫入資料庫 (取代原本的 enrollStudentAction)
      const { error } = await supabase
        .from("course_students")
        .insert({
          course_id: courseId,
          student_id: parseInt(selectedStudentId),
        });

      if (error) throw error;

      toast.success("成功加入學生！");
      setOpen(false); // 關閉視窗
      setSelectedStudentId(""); // 重置選擇
      router.refresh(); // 刷新頁面

    } catch (error) {
      console.error(error);
      toast.error("加入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          加入舊生
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>將學生加入課程</DialogTitle>
          <DialogDescription>
            請從現有學生名單中選擇。
          </DialogDescription>
        </DialogHeader>

        {/* 這裡改用 onSubmit，完全不使用 Server Action */}
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="student" className="text-right">
              學生姓名
            </Label>
            <div className="col-span-3">
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇學生..." />
                </SelectTrigger>
                <SelectContent>
                  {allStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "確認加入"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}