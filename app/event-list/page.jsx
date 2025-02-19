'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useEventList } from '@/hooks/event';
import { EventCardSkeleton } from '@/components/EventCardSkeleton';

export default function EventListPage() {
  const { events, isLoading, error } = useEventList();

  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `明天 ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleString('zh-TW', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <div className="mb-2">載入失敗</div>
        <div className="text-sm">請稍後再試</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <Link key={event.id} href={`/event-list/${event.id}`} className="block">
          <div className="bg-white rounded-lg border shadow-sm p-4 hover:border-blue-500 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                ${event.fee}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.host_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.place.Name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {event.attendees?.length || 0} / {event.max_players} 人
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              主辦人：{event.host_by.username}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
