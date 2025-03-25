import { useState, useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import useVenueStore from "@/stores/useVenueStore";
import useUserStore from "@/stores/useUserStore";
import { useGameRankSubmit } from "@/hooks/event/useEventActions";

import sty from "./RankList.module.scss";

const RankList = ({ gameList, t }) => {
  const { myRankList, setMyRankList } = useVenueStore(
    useShallow(state => ({
      myRankList: state.myRankList,
      setMyRankList: state.setMyRankList,
    }))
  );

  const { gameRankSubmit, isLoading } = useGameRankSubmit();

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(false);
    return () => {};
  }, [myRankList]);

  const handleCleanGame = useCallback(
    e => {
      setMyRankList(null, Number.parseInt(e.target.dataset.index) + 1);
    },
    [setMyRankList]
  );

  const handleSubmit = useCallback(() => {
    const { venueName, email } = useUserStore.getState();
    gameRankSubmit(
      myRankList.filter(id => id),
      venueName,
      email
    );
    setIsSubmitted(true);
  }, [myRankList]);

  return (
    <div className={sty.RankList}>
      <h3>{t("Please select top 1~3 games that you want to play")}</h3>
      <div className={sty.box__ranks}>
        {myRankList.map((id, index) => {
          const targetGame = gameList.find(({ _id }) => _id === id);

          return (
            <div
              key={index}
              className={sty.box__ranked}
              style={{ "--bg-game": `url("${targetGame?.game?.thumbnail}")` }}
            >
              #{index + 1}
              <div className={sty.box__square} onClick={handleCleanGame} data-index={index} />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className={sty.btn__submit}
        disabled={isSubmitted || isLoading}
        onClick={handleSubmit}
      >
        {isSubmitted ? t("Submitted") : t("Submit Selection")}
      </button>
    </div>
  );
};

RankList.propTypes = {};

export default RankList;
