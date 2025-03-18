"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "lucide-react";

const BottomNavigation = () => {
  const pathname = usePathname();

  // Hide the navigation when on /event page
  if (pathname === "/event") {
    return null;
  }

  const navItems = [
    // { path: " ", label: "即將到來活動", icon: Calendar },
    { path: "/event", label: "公開活動", icon: List },
    // { path: "/event/create", label: "創建活動", icon: PlusCircle },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 z-50">
      <nav className="max-w-[480px] mx-auto bg-white border-t border-gray-100">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-400"
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigation;
