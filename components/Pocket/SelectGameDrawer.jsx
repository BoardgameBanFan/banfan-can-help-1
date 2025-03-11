"use client";

import { useSelectGameDrawerStore } from "@/app/pocket/layout";
import GameCard from "@/components/Pocket/GameSelectCard";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import useSearchGames from "@/hooks/games/useSearchGames";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function SelectGameDrawer() {
  // onSelectGame 是選擇遊戲後的 callback function，也決定是否打開 drawer
  const onSelectGame = useSelectGameDrawerStore(state => state.onSelectGame);
  const setSelectGameFunc = useSelectGameDrawerStore(state => state.setSelectGameFunc);

  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  const { games, count, isLoading, totalPage } = useSearchGames({
    keyword,
    page,
    gamePerPage: 10,
  });

  useEffect(() => {
    if (onSelectGame) {
      setTimeout(() => inputRef.current.focus(), 200);
    }
  }, [onSelectGame]);

  const onSearch = () => {
    setPage(0);
    setKeyword(inputRef.current.value);
  };

  return (
    <Drawer open={onSelectGame} onOpenChange={() => setSelectGameFunc(null)}>
      <DrawerContent className="max-w-[480px] max-h-[70%] mx-auto">
        <DrawerHeader>
          <DrawerTitle>尋找遊戲</DrawerTitle>
          <div className="flex gap-2 items-center mt-1">
            <Input
              ref={inputRef}
              placeholder="輸入桌遊名稱 ..."
              defaultValue={keyword}
              onKeyDown={event => {
                event.key === "Enter" ? onSearch() : null;
              }}
            />
            <Button onClick={onSearch}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : "搜尋"}
            </Button>
          </div>

          {keyword ? <DrawerDescription>總共有 {count} 個結果</DrawerDescription> : null}

          <div className="flex flex-wrap justify-between gap-y-4 mt-4">
            {keyword &&
              games.map(game => (
                <GameCard
                  onClick={() => {
                    onSelectGame(game);
                    setSelectGameFunc(null);
                    setKeyword("");
                  }}
                  key={game._id}
                  game={game}
                />
              ))}
          </div>
        </DrawerHeader>
        {keyword && count ? (
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
