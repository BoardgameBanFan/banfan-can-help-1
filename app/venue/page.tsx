"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  host_at: string;
  address: string;
}

const BASE_URL = "https://api.banfan.app";

export default function VenuePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入失敗');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">載入失敗: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">現場活動</h1>
      <div className="space-y-4">
        {events.map(event => {
          const eventDate = new Date(event.host_at);
          const formattedDate = eventDate.toLocaleDateString('zh-TW', {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          });
          const formattedTime = eventDate.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <Link 
              key={event.id} 
              href={`/venue/${event.id}`}
              className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg mb-2">{event.title}</h2>
                  <p className="text-gray-600">
                    {formattedDate} {formattedTime}
                  </p>
                  <p className="text-gray-600 mt-1">{event.address}</p>
                </div>
                <div className="text-blue-500">
                  →
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}