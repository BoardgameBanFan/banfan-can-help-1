"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import BottomNavigation from "@/components/BottomNavigation";

export default function EventListLayout({ children }) {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [{ href: "/event", label: "公開活動" }];

    // 如果是活動詳情頁面
    if (pathname.startsWith("/event/") && pathname !== "/event") {
      items.push({ href: pathname, label: "活動詳情" });
    }

    return items;
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        <Breadcrumb items={getBreadcrumbItems()} />
      </div>
      {children}
      <BottomNavigation />
    </div>
  );
}
