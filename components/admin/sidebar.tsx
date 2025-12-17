// components/admin/sidebar.tsx
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  LogOut 
} from "lucide-react";
import { signOutAction } from "@/actions/auth-actions";

const menuItems = [
  {
    title: "儀表板",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "學生管理",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "課程與點名",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "繳費財務",
    href: "/admin/finance",
    icon: CreditCard,
  },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-white shadow-sm">
      {/* 1. Logo 區域 */}
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold text-primary">補習班後台</span>
      </div>

      {/* 2. 選單列表 */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* 3. 底部登出按鈕 */}
      <div className="border-t p-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">登出系統</span>
          </button>
        </form>
      </div>
    </div>
  );
}