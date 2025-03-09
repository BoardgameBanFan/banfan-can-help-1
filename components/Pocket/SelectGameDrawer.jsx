import GameCard from "@/components/Pocket/GameCard";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import useSearchGames from "@/hooks/games/useSearchGames";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";

function SelectGameDrawer({ triggerComponent = null, onGameSelected = () => {} }) {
  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);

  const { games, count, isLoading, totalPage } = useSearchGames({
    keyword,
    page,
    gamePerPage: 10,
  });

  const onSearch = () => {
    setPage(0);
    setKeyword(inputRef.current.value);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerComponent}</DrawerTrigger>
      <DrawerContent className="max-w-[480px] h-[70%] mx-auto">
        <DrawerHeader>
          <DrawerTitle>尋找遊戲</DrawerTitle>
          <div className="flex gap-2 items-center mt-1">
            <Input
              autoFocus
              ref={inputRef}
              placeholder="輸入桌遊名稱 ..."
              onKeyDown={event => {
                event.key === "Enter" ? onSearch() : null;
              }}
            />
            <Button onClick={onSearch}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : "搜尋"}
            </Button>
          </div>

          <DrawerDescription>總共有 {count} 個結果</DrawerDescription>

          <div className="flex flex-wrap justify-between gap-y-4 mt-4">
            {games.map(game => (
              <GameCard
                onClick={() => {
                  onGameSelected(game);
                  setOpen(false);
                }}
                key={game._id}
                game={game}
              />
            ))}
          </div>
        </DrawerHeader>
        {count ? (
          <DrawerFooter>
            <div className="flex justify-between items-center">
              <Button
                disabled={page === 0}
                variant="ghost"
                size="icon"
                onClick={() => setPage(page => page - 1)}
              >
                <ChevronLeft />
              </Button>
              <span>
                {page + 1} / {totalPage}
              </span>
              <Button
                disabled={page === totalPage - 1}
                variant="ghost"
                size="icon"
                onClick={() => setPage(page => page + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export default SelectGameDrawer;
