'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function EventListLayout({ children }) {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [{ href: '/event-list', label: '公開活動' }];

    // 如果是活動詳情頁面
    if (pathname.startsWith('/event-list/') && pathname !== '/event-list') {
      items.push({ href: pathname, label: '活動詳情' });
    }

    return items;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Breadcrumb items={getBreadcrumbItems()} />
        {pathname === '/event-list' && <h1 className="text-2xl font-bold">公開活動</h1>}
      </div>
      {children}
    </div>
  );
}
