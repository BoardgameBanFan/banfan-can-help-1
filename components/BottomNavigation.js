'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BottomNavigation = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/my-event', label: '即將到來活動' },
    { path: '/event-list', label: '公開活動' },
    { path: '/create-event', label: '創建活動' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center">
      <nav className="w-full max-w-[480px] bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                pathname === item.path ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigation;
