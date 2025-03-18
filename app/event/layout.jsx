"use client";
import BottomNavigation from "@/components/BottomNavigation";
import { SWRProvider } from "@/lib/swr-config.jsx";

export default function EventListLayout({ children }) {
  // const pathname = usePathname();
  //
  // const getBreadcrumbItems = () => {
  //   const items = [{ href: "/event", label: "公開活動" }];
  //
  //   // 如果是活動詳情頁面
  //   if (pathname.startsWith("/event/") && pathname !== "/event") {
  //     items.push({ href: pathname, label: "活動詳情" });
  //   }
  //
  //   return items;
  // };

  return (
    <SWRProvider>
      <div className="p-4">
        {/*<div className="space-y-2">*/}
        {/*  <Breadcrumb items={getBreadcrumbItems()} />*/}
        {/*</div>*/}
        {children}
        <BottomNavigation />
      </div>
    </SWRProvider>
  );
}
