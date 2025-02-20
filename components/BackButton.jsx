'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BackButton({ onClick, className = '' }) {
  const router = useRouter();
  const handleClick = onClick || (() => router.back());

  return (
    <button
      onClick={handleClick}
      className={`flex items-center text-gray-500 mb-4 hover:text-gray-700 ${className}`}
    >
      <ChevronLeft className="w-5 h-5" />
      <span>返回列表bbba</span>
    </button>
  );
}
