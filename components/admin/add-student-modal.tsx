// components/admin/add-student-modal.tsx
'use client' // 標記為客戶端元件

import { useState } from "react";
import { createStudentAction } from "@/actions/student-actions";
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
import { Plus } from "lucide-react";

export function AddStudentModal() {
  const [open, setOpen] = useState(false);

  // 處理表單送出後的行為
  async function handleSubmit(formData: FormData) {
    await createStudentAction(formData); // 呼叫 Server Action
    setOpen(false); // 關閉視窗
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

        {/* 表單區域 */}
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名
            </Label>
            <Input id="name" name="name" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="school" className="text-right">
              學校
            </Label>
            <Input id="school" name="school" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              年級
            </Label>
            <Input id="grade" name="grade" placeholder="例如：國二" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              電話
            </Label>
            <Input id="phone" name="phone" className="col-span-3" />
          </div>

          <DialogFooter>
            <Button type="submit">儲存資料</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}