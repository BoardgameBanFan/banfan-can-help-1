import GamesSection from "@/components/Pocket/GamesSection";
import PocketAnimation from "@/components/Pocket/PocketAnimation";
import UserInfo from "@/components/User/UserInfo";
import config from "@/config/config";
import { format } from "date-fns";
import { notFound } from "next/navigation";

async function SinglePocketPage({ params }) {
  const { id } = await params;

  const response = await fetch(`${config.apiUrl}/pocket/${id}`);
  const gamesResponse = await fetch(`${config.apiUrl}/pocket/${id}/games`);
  if (!response.ok || !gamesResponse.ok) {
    return notFound();
  }

  const pocket = await response.json();
  const games = await gamesResponse.json();

  return (
    <div className="py-6">
      <PocketAnimation games={games} pocketId={pocket._id} />
      <p className="text-xs font-medium text-center text-gray-900 mb-3 mt-6">口袋清單</p>
      <h1 className="text-3xl text-gray-900 font-bold text-center">{pocket.title}</h1>
      <hr className="my-6 w-1/3 mx-auto h-[2px] border-none bg-cyan-600" />
      <p className="text-base text-gray-900 font-medium text-center">{pocket.description}</p>

      <UserInfo className="justify-center mt-6" user={pocket.created_by} />
      <p className="text-sm text-gray-500 font-normal text-center mt-1">
        {format(pocket.created_at, "MMMM d, Y")}
      </p>

      <div className="mt-6">
        <GamesSection canAdd={pocket.can_add} games={games} pocketId={id} />
      </div>
    </div>
  );
}

export default SinglePocketPage;

export async function generateMetadata({ params }) {
  const { id } = await params;

  const response = await fetch(`${config.apiUrl}/pocket/${id}`);
  const pocket = await response.json();

  return {
    title: `${pocket.title} | 口袋清單`,
    description: pocket.description,
  };
}
