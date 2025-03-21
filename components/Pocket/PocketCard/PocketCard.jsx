import PocketCardCarousel from "@/components/Pocket/PocketCard/PocketCardCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserInfo from "@/components/User/UserInfo";
import Link from "next/link";

function PocketCard({ pocket }) {
  return (
    <Card>
      <div className="flex items-center pr-4 justify-between">
        <div>
          <CardHeader>
            <CardTitle className="line-clamp-1">
              <Link href={`/pocket/${pocket._id}`}>{pocket.title}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 items-center">
            <div>
              <p className="text-sm line-clamp-3 mb-2">{pocket.description}</p>
              <p className="text-sm text-gray-600 font-medium mb-2">
                {pocket.game_count || "0"} 款遊戲
              </p>
              <UserInfo user={pocket.created_by} />
            </div>
          </CardContent>
        </div>
        {pocket.game_images && pocket.game_images.length ? (
          <PocketCardCarousel images={pocket.game_images} />
        ) : null}
      </div>
    </Card>
  );
}

export default PocketCard;
