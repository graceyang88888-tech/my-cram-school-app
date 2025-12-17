// components/admin/upload-grades-modal.tsx
'use client'

import { useState } from "react";
import Papa from "papaparse";
import { uploadGradesAction } from "@/actions/grade-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileUp, AlertCircle, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UploadGradesModal({ courseId }: { courseId: number }) {
  const [open, setOpen] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean, insertedCount?: number, failedNames?: string[]} | null>(null);

  // 處理檔案選擇與解析
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // 把第一行當作標題
      skipEmptyLines: true,
      complete: (results) => {
        // 假設 CSV 欄位是: 姓名, 分數
        // 我們把欄位統一整理一下
        const formatted = results.data.map((row: any) => ({
            name: row['姓名'] || row['name'] || row['Name'], // 支援多種欄位寫法
            score: row['分數'] || row['score'] || row['Score']
        })).filter(r => r.name && r.score); // 過濾掉無效資料

        setParsedData(formatted);
        setResult(null); // 重置結果
      },
    });
  };

  const handleUpload = async () => {
    if (!examName) {
        alert("請輸入考試名稱！");
        return;
    }
    setLoading(true);

    // 轉換資料格式給 Server Action
    const gradesPayload = parsedData.map(d => ({
        studentName: d.name,
        score: parseInt(d.score),
        examName: examName
    }));

    const res = await uploadGradesAction(courseId, gradesPayload);
    setLoading(false);
    
    if (res?.error) {
        alert("上傳失敗: " + res.error);
    } else {
        setResult(res);
        setParsedData([]); // 清空預覽
        setExamName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          上傳成績 (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>批次上傳成績</DialogTitle>
        </DialogHeader>

        {!result ? (
            <div className="space-y-4 py-4">
                {/* 1. 輸入考試名稱 */}
                <div className="grid gap-2">
                    <Label>考試名稱 (例如：第一冊段考)</Label>
                    <Input 
                        value={examName} 
                        onChange={(e) => setExamName(e.target.value)} 
                        placeholder="請輸入考試名稱..." 
                    />
                </div>

                {/* 2. 選擇檔案 */}
                <div className="grid gap-2">
                    <Label>選擇 CSV 檔案</Label>
                    <Input type="file" accept=".csv" onChange={handleFileChange} />
                    <p className="text-xs text-gray-500">
                        CSV 格式說明：需包含「姓名」與「分數」兩個欄位。
                    </p>
                </div>

                {/* 3. 預覽表格 */}
                {parsedData.length > 0 && (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>姓名</TableHead>
                                    <TableHead>分數</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parsedData.slice(0, 5).map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.score}</TableCell>
                                    </TableRow>
                                ))}
                                {parsedData.length > 5 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-gray-500">
                                            ...還有 {parsedData.length - 5} 筆資料
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {parsedData.length > 0 && (
                    <Button className="w-full" onClick={handleUpload} disabled={loading}>
                        {loading ? "處理中..." : `確認匯入 ${parsedData.length} 筆成績`}
                    </Button>
                )}
            </div>
        ) : (
            // 上傳結果報告
            <div className="py-6 space-y-4 text-center">
                <div className="flex justify-center text-green-500">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold">匯入完成！</h3>
                <p className="text-gray-600">
                    成功匯入：<span className="font-bold text-green-600">{result.insertedCount}</span> 筆
                </p>
                
                {/* 顯示失敗名單 (如果有) */}
                {result.failedNames && result.failedNames.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-md text-left text-sm">
                        <p className="font-bold text-red-600 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            以下學生姓名比對失敗 (未匯入)：
                        </p>
                        <ul className="list-disc pl-5 text-red-500">
                            {result.failedNames.map((name, i) => (
                                <li key={i}>{name}</li>
                            ))}
                        </ul>
                        <p className="text-xs text-gray-400 mt-2">原因：系統找不到此姓名，請檢查 CSV 姓名是否與系統一致。</p>
                    </div>
                )}

                <Button onClick={() => setOpen(false)} variant="outline">關閉視窗</Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}