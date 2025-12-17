// components/admin/enroll-student-modal.tsx
'use client'

import { useState } from "react";
import { enrollStudentAction } from "@/actions/course-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Plus } from "lucide-react";

// 定義學生資料的型別
type Student = {
  id: number;
  name: string;
};

export function EnrollStudentModal({ 
  courseId, 
  allStudents 
}: { 
  courseId: number; 
  allStudents: Student[] 
}) {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  async function handleSubmit() {
    if (!selectedStudent) return;

    // 建立 FormData 來呼叫 Server Action
    const formData = new FormData();
    formData.append("courseId", courseId.toString());
    formData.append("studentId", selectedStudent);

    await enrollStudentAction(formData);
    setOpen(false); // 關閉視窗
    setSelectedStudent(""); // 清空選擇
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          加入學生
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>選擇要加入班級的學生</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="請選擇學生..." />
            </SelectTrigger>
            <SelectContent>
              {allStudents.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit} disabled={!selectedStudent}>
            確定加入
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}