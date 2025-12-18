"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { toast } from "sonner"; // 如果沒有安裝 sonner，可自行換成 alert

export function UploadGradesModal({ courseId }: { courseId: number }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 因為手機 App 端處理 CSV 檔案較複雜，建議引導使用者回網頁版操作
    toast.info("為確保資料正確，請使用電腦網頁版進行批次上傳。");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          上傳成績
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>批次上傳成績</DialogTitle>
          <DialogDescription>
            目前 App 版本僅支援檢視，如需上傳 CSV 檔案，請使用電腦瀏覽器登入系統操作。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-10 bg-gray-50 text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">
              此功能需要處理複雜檔案格式<br />建議於電腦版使用
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">了解</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}