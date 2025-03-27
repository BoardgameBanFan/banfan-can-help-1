import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import debounce from "lodash/debounce";
import useSearchGames from "@/hooks/games/useSearchGames";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Game = {
  id: string;
  name: string;
  thumbnail: string;
  maxPlayers: number;
  minPlayers: number;
  image: string;
  description: string;
};

function GameSearchDialog({ triggerElement = null, onGameConfirmed }) {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-full bg-background h-full p-0 overflow-auto">
        <div className="max-w-[640px] w-full p-6 mx-0 md:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-left">Search Game</DialogTitle>
            <DialogDescription className="text-left">
              Please enter keyword to search games.
            </DialogDescription>
          </DialogHeader>

          {selectedGame ? (
            <GameConfirmContent
              game={selectedGame}
              className="mt-6"
              onCancel={() => setSelectedGame(null)}
              onConfirm={() => {
                onGameConfirmed(selectedGame);
                setOpen(false);
              }}
            />
          ) : (
            <GameSearchContent onSelectedGame={setSelectedGame} className="mt-6" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GameSearchContent({
  className,
  onSelectedGame,
}: {
  className?: string;
  onSelectedGame?: (game: Game) => void;
}) {
  const [keyword, setKeyowrd] = useState("");
  const { searchGames, searchResults = [], isLoading } = useSearchGames();

  const debouncedSearch = useMemo(() => debounce(searchGames, 300), []);

  return (
    <div className={cn(className)}>
      <GameSearchInput
        isLoading={isLoading}
        value={keyword}
        onChange={e => {
          const value = e.target.value;
          setKeyowrd(value);
          debouncedSearch(value);
        }}
      />

      <div className="space-y-4 mt-4 overflow-auto">
        {searchResults.map(game => (
          <GameCard onClick={() => onSelectedGame(game)} key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

function GameSearchInput({
  value,
  onChange,
  isLoading,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isLoading?: boolean;
}) {
  return (
    <div className="relative">
      <input
        autoFocus
        value={value}
        onChange={onChange}
        className="bg-transparent focus-visible:outline-none border-b-2 border-gray-900 w-full text-2xl pb-1 pr-8"
      />
      {isLoading ? (
        <LoaderCircle className="absolute right-0 top-1 animate-spin text-red-600" />
      ) : (
        <SearchIcon className="absolute right-0 top-1" />
      )}
    </div>
  );
}

function GameCard({
  game,
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
  game: Game;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        className,
        "bg-white p-4 flex gap-3 items-center shadow-md cursor-pointer transition-all hover:-translate-y-1"
      )}
    >
      <div className="h-20 w-20 overflow-hidden shrink-0">
        <img className="h-full w-full object-contain" src={game.thumbnail} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-medium line-clamp-1">{game.name}</p>
        <p className="text-sm text-gray-700">
          {game.minPlayers}-{game.maxPlayers} Players
        </p>
      </div>
    </div>
  );
}

function decodeHtmlEntities(str: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function GameConfirmContent({
  game,
  className,
  onCancel,
  onConfirm,
}: {
  className?: string;
  game: Game;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [description, setDescription] = useState(decodeHtmlEntities(game.description));

  return (
    <div className={cn(className, "flex flex-col gap-2 items-center")}>
      <div className="h-[260px] w-[260px] overflow-hidden">
        <img className="h-full w-full object-contain" src={game.image} />
      </div>
      <p className="font-medium text-2xl line-clamp-2">{game.name}</p>
      <p className="font-medium">Description</p>
      <textarea
        value={decodeURIComponent(description)}
        onChange={e => setDescription(e.target.value)}
        rows={6}
        className="resize-none rounded-sm w-full focus-visible:outline-none p-3"
      />

      <div className="flex gap-3 w-full mt-3">
        <Button onClick={onCancel} className="flex-grow" variant="secondary" size="lg">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="flex-grow" size="lg">
          Add Game
        </Button>
      </div>
    </div>
  );
}

export default GameSearchDialog;
