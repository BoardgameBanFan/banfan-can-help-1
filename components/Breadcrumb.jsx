'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center text-sm">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
            {index === items.length - 1 ? (
              <span className="text-gray-600">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
