export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        {/* 標題骨架 */}
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
        {/* 價格骨架 */}
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
      </div>

      <div className="space-y-2">
        {/* 時間、地點、人數骨架 */}
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        ))}
      </div>

      {/* 主辦人骨架 */}
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
