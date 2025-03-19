"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { useEventList } from "@/hooks/event";
import { EventCardSkeleton } from "@/components/EventCardSkeleton";
import { useTranslations } from "next-intl";

export default function EventListPage() {
  const { events, isLoading, error } = useEventList();

  const t = useTranslations();
  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `明天 ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
    }

    return date.toLocaleString("zh-TW", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
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
    <div>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-2xl font-bold">{t("Public Events")}</h1>
        <Link
          href="/event/create"
          className="bg-white text-black p-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors font-bold"
        >
          <Plus className="w-5 h-5 stroke-[2.5px]" />
        </Link>
      </div>

      {events?.map(event => (
        <Link key={event._id} href={`/event/${event._id}`} className="block mb-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 hover:border-blue-500 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                ${event.fee || 0}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.host_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.address || "未指定地點"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {event.attendees_count || 0} / {event.max_players || "不限"} 人
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              {t("Host")}：{event.host_by || "Jeff(待改‼️)"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
