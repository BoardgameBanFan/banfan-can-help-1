import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

import cx from "clsx";

import useVenueStore from "@/stores/useVenueStore";

import sty from "./RankSelector.module.scss";
import styRankList from "../RankList/RankList.module.scss";

const RankSelector = ({ gameList, rankSelectedID, setRankSelectedID, postMyRankList }) => {
  const ref = useRef();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState();
  const setMyRankList = useVenueStore(state => state.setMyRankList);

  const closeRankSelector = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setRankSelectedID(null);
    }, 300);
  }, [setRankSelectedID]);

  const targetGame = useMemo(
    () => gameList.find(({ _id }) => _id === rankSelectedID),
    [gameList, rankSelectedID]
  );

  useEffect(() => {
    if (targetGame) setIsOpen(true);
    return () => {};
  }, [targetGame]);

  const handleClickRankBox = useCallback(
    e => {
      const { index } = e.target.dataset;
      setMyRankList(rankSelectedID, Number.parseInt(index) + 1);
      closeRankSelector();
      postMyRankList();
    },
    [rankSelectedID, setMyRankList, closeRankSelector, postMyRankList]
  );

  const { game } = targetGame || {};

  return (
    <div
      ref={ref}
      className={cx(sty.RankSelector, {
        [sty.open]: isOpen,
      })}
    >
      <button type="button" className={sty.btn__close} onClick={closeRankSelector} />
      {game && (
        <>
          <div className={sty.box__game_info}>
            {game.thumbnail && (
              <img src={game.thumbnail} alt={game.name} className={sty.img__cover} />
            )}
            <div className={sty.box__game_desc}>
              <h3>{game.name}</h3>
              <p>
                {game.min_player}-{game.max_player} {t("Players")}
              </p>
            </div>
          </div>
          {game?.description && (
            <p className={sty.p__desc} dangerouslySetInnerHTML={{ __html: game.description }} />
          )}
        </>
      )}
      <div className={sty.desc}>{t("This game is your Top ?")}</div>
      <div className={sty.box__ranks}>
        {[...Array(3)].map((nulll, index) => {
          return (
            <div
              key={`box-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className={cx(sty.box__rank, styRankList.box__metal)}
              data-index={index}
              onClick={handleClickRankBox}
            />
          );
        })}
      </div>
    </div>
  );
};

RankSelector.propTypes = {};

export default RankSelector;
