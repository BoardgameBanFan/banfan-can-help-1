import Image from "next/image";

function GameSelectCard({ game, onClick = () => {} }) {
  return (
    <div
      className="hover:opacity-80 hover:scale-105 cursor-pointer transition-all"
      onClick={onClick}
    >
      {game.thumbnail ? (
        <Image alt={game.name} src={game.thumbnail} width={80} height={80} />
      ) : (
        <div className="w-[80px] h-[80px] bg-slate-800 text-white p-1">{game.name}</div>
      )}
    </div>
  );
}

export default GameSelectCard;
