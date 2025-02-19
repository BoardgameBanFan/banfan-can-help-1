'use client';

import { useEvent, useEventGames } from '@/hooks/event';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Users, DollarSign, Grid, Gamepad2, Loader2 } from 'lucide-react';
import { BackButton } from '@/components/BackButton';

function LoadingState() {
  return (
    <div>
      <BackButton />
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div>
      <BackButton />
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
        <div className="mb-2">載入失敗</div>
        <div className="text-sm">請稍後再試</div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const { event, isLoading: eventLoading, error: eventError } = useEvent(params.id);
  const { games, isLoading: gamesLoading, error: gamesError } = useEventGames(params.id);

  if (eventLoading || gamesLoading) return <LoadingState />;
  if (eventError || gamesError) return <ErrorState />;
  if (!event) return null;

  const isEventFull = event.attendees?.length >= event.max_players;
  const isEventHost = event.host_by._id === 'TODO: 當前用戶ID'; // TODO: 需要添加用戶驗證
  const hasJoined = event.attendees?.some(attendee => attendee._id === 'TODO: 當前用戶ID'); // TODO: 需要添加用戶驗證
  const isEventEnded = new Date(event.host_at) < new Date();

  const getButtonState = () => {
    if (isEventHost) {
      return {
        text: '你是主辦人',
        disabled: true,
        className: 'bg-gray-100 text-gray-500',
      };
    }
    if (hasJoined) {
      return {
        text: '已報名',
        disabled: true,
        className: 'bg-green-50 text-green-600',
      };
    }
    if (isEventFull) {
      return {
        text: '人數已滿',
        disabled: true,
        className: 'bg-gray-100 text-gray-500',
      };
    }
    if (isEventEnded) {
      return {
        text: '活動已結束',
        disabled: true,
        className: 'bg-gray-100 text-gray-500',
      };
    }
    return {
      text: '我要報名',
      disabled: false,
      className: 'bg-blue-600 text-white hover:bg-blue-700',
    };
  };

  const buttonState = getButtonState();

  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 判斷是否為今天或明天
    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `明天 ${date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    });
  };

  return (
    <>
      <BackButton />

      <div className="space-y-6 pb-24">
        {/* 標題和費用 */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">${event.fee}</span>
        </div>

        {/* 活動資訊 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 py-3 border-b">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">時間</div>
              <div>{formatDate(event.host_at)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 border-b">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">地點</div>
              <div>{event.place.Name}</div>
              <div className="text-sm text-gray-500">{event.place.Address}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 border-b">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">參與人數</div>
              <div>
                {event.attendees?.length || 0} / {event.max_players} 人
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 border-b">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">場地費</div>
              <div>{event.fee} 元</div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 border-b">
            <Grid className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">桌數</div>
              <div className="text-yellow-600">資訊缺失</div>
            </div>
          </div>
        </div>

        {/* 遊戲列表 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500">遊戲列表</span>
          </div>
          <div className="space-y-2">
            {games && games.length > 0 ? (
              games.map(({ game_id, game, add_by }) => (
                <div key={game_id} className="bg-gray-50 p-3 rounded">
                  <div className="flex gap-3">
                    <img
                      src={game.thumbnail}
                      alt={game.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{game.name}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {game.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">新增者：{add_by.username}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-3 rounded text-gray-500 text-center">暫無遊戲</div>
            )}
          </div>
        </div>

        {/* 主辦人資訊 */}
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-500">主辦人</div>
          <div className="flex items-center gap-2 mt-2">
            <img
              src={event.host_by.avatar}
              alt={event.host_by.username}
              className="w-6 h-6 rounded-full"
            />
            <span>{event.host_by.username}</span>
          </div>
        </div>
      </div>

      {/* 固定在底部的報名按鈕 */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-[480px] mx-auto">
          <button
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${buttonState.className}`}
            onClick={() => {
              if (!buttonState.disabled) {
                // TODO: 處理報名邏輯
                alert('報名功能開發中');
              }
            }}
            disabled={buttonState.disabled}
          >
            {buttonState.text}
          </button>
        </div>
      </div>
    </>
  );
}
