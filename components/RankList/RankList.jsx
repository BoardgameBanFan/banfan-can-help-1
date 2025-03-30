import React, { useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import cx from "clsx";

import useVenueStore from "@/stores/useVenueStore";
import useUserStore from "@/stores/useUserStore";

import sty from "./RankList.module.scss";

const RankList = ({ gameList, t, postMyRankList, isRankLocked }) => {
  const venueName = useUserStore(state => state.venueName);
  const { myRankList, setMyRankList } = useVenueStore(
    useShallow(state => ({
      myRankList: state.myRankList,
      setMyRankList: state.setMyRankList,
    }))
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCleanGame = useCallback(
    e => {
      setMyRankList(null, Number.parseInt(e.target.dataset.index) + 1);
    },
    [setMyRankList]
  );

  const handleSubmit = useCallback(() => {
    postMyRankList({ isSubmit: true });
    setIsSubmitted(true);
  }, [postMyRankList]);

  return (
    <div className={sty.RankList}>
      <div className={cx(sty.box__header, { [sty.box__padding]: !isRankLocked })}>
        {venueName && (
          <h3 className={sty.h3__name}>
            {isRankLocked ? `${venueName}${t("’s selections")}` : `Hi, ${venueName}`}
          </h3>
        )}
        {!isRankLocked && <h3>{t("Please select top 1~3 games that you want to play")}</h3>}

        <div className={sty.box__ranks}>
          {myRankList.map((id, index) => {
            const targetGame = gameList.find(({ _id }) => _id === id);
            return (
              <div
                key={index}
                data-index={index}
                className={cx(sty.box__ranked, sty.box__metal)}
                style={{ "--bg-game": `url("${targetGame?.game?.thumbnail}")` }}
                onClick={handleCleanGame}
              />
            );
          })}
        </div>
      </div>

      {!isRankLocked && (
        <button
          type="button"
          className={sty.btn__submit}
          disabled={isSubmitted}
          onClick={handleSubmit}
        >
          {isSubmitted ? t("Submitted") : t("Submit Selection")}
        </button>
      )}
    </div>
  );
};

RankList.propTypes = {};

export default React.memo(RankList);
