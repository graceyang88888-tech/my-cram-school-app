// app/(admin)/layout.tsx
import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* 左側固定寬度選單 */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 md:block">
        <Sidebar />
      </aside>

      {/* 右側主要內容區 - 預留左邊 64 (256px) 的空間 */}
      <main className="flex-1 md:pl-64">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}