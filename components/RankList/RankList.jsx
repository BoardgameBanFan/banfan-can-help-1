import { useState, useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import cx from "clsx";

import useVenueStore from "@/stores/useVenueStore";
import useUserStore from "@/stores/useUserStore";
import { useGameRankSubmit } from "@/hooks/event/useEventActions";

import sty from "./RankList.module.scss";

const RankList = ({ gameList, t, eventId }) => {
  const venueName = useUserStore(state => state.venueName);
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
      eventId,
      venueName,
      email
    );
    setIsSubmitted(true);
  }, [myRankList, eventId]);

  return (
    <div className={sty.RankList}>
      <div className={sty.box__padding}>
        {venueName && <h3 className={sty.h3__name}>Hi, {venueName}</h3>}
        <h3>{t("Please select top 1~3 games that you want to play")}</h3>
        <div className={sty.box__ranks}>
          {myRankList.map((id, index) => {
            const targetGame = gameList.find(({ _id }) => _id === id);
            return (
              <div
                key={index}
                className={cx(sty.box__ranked, sty.box__metal)}
                style={{ "--bg-game": `url("${targetGame?.game?.thumbnail}")` }}
                onClick={handleCleanGame}
              />
            );
          })}
        </div>
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
