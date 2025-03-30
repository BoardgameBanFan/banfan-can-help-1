import React, { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import _orderBy from "lodash/orderBy";
import _flatten from "lodash/flatten";
// import { useShallow } from "zustand/react/shallow";

import cx from "clsx";

import useUserStore from "@/stores/useUserStore";
import useVenueStore from "@/stores/useVenueStore";
import { useVenueGameSelectable } from "@/hooks/event/useEventActions";
import { useGameRankSubmit } from "@/hooks/event/useEventActions";

import RankSeatList, { SlotTag } from "../RankSeatList/RankSeatList.jsx";
import SwitchToggler from "../SwitchToggler";
import RankSelector from "../RankSelector";
import RankList from "../RankList";

import sty from "./VenueGameList.module.scss";
import styRankSeatList from "../RankSeatList/RankSeatList.module.scss";

const VenueGameList = ({
  gameList,
  isRankLocked,
  isHostMode,
  isHostEditMode,
  eventId,
  checkUserData,
}) => {
  const t = useTranslations();
  const [rankSelectedID, setRankSelectedID] = useState(false);
  const { switchGameSelectable } = useVenueGameSelectable(eventId);

  const formedGameIdMap = useVenueStore(state => state.formedGameIdMap);

  const orderedGameList = useMemo(() => {
    return isRankLocked && reorderGameList(gameList, formedGameIdMap);
  }, [isRankLocked, gameList, formedGameIdMap]);

  const OrphanNameList = useMemo(
    () =>
      orderedGameList
        ? Object.entries(
            orderedGameList.reduce((nameMap, { outFormedNameList }) => {
              outFormedNameList?.forEach(name => {
                nameMap[name] = (nameMap[name] || 0) + 1;
              });
              return nameMap;
            }, {})
          )
            .filter(([, number]) => number === 3)
            .map(([name]) => name)
        : [],
    [orderedGameList]
  );

  const clickGameSelectableToggle = useCallback(
    (e, isSelectable) => {
      const { id } = e.target.dataset;
      switchGameSelectable(id, isSelectable);
    },
    [switchGameSelectable]
  );

  const handleClickSelectRank = useCallback(
    e => {
      const { id } = e.target.dataset;
      if (!checkUserData(["venueName"], true)) return;

      setRankSelectedID(id);
    },
    [checkUserData]
  );

  const { gameRankSubmit } = useGameRankSubmit();

  const postMyRankList = useCallback(
    ({ isSubmit } = {}) => {
      const { venueName, email } = useUserStore.getState();
      const { myRankList } = useVenueStore.getState();
      gameRankSubmit(
        myRankList.filter(id => id),
        eventId,
        venueName,
        email,
        isSubmit
      );
    },
    [eventId, gameRankSubmit]
  );

  return (
    <>
      {!isRankLocked && (
        <RankSelector
          gameList={gameList}
          rankSelectedID={rankSelectedID}
          setRankSelectedID={setRankSelectedID}
          postMyRankList={postMyRankList}
        />
      )}
      <RankList
        gameList={gameList}
        t={t}
        eventId={eventId}
        isRankLocked={isRankLocked}
        postMyRankList={postMyRankList}
      />
      <div className={sty.VenueGameList}>
        {gameList && gameList.length > 0 && (
          <div className="mt-6">
            {isRankLocked ? (
              <div className={sty.box__title}>
                <h2 className={sty.h2__done}>
                  {isRankLocked ? `🎯 ${t("Perfect Match!!")}` : t("Game List")}
                </h2>
                <p>{t("These game are their top 1")}</p>
              </div>
            ) : (
              <h2 className={sty.h2__rank}>{t("Game List")}</h2>
            )}
            <div className={isRankLocked || isHostEditMode ? sty.big : sty.small}>
              {(orderedGameList || gameList)
                .filter(({ is_live_selectable }) => (isHostEditMode ? true : is_live_selectable))
                .map(({ _id, game_id, game, add_by, is_live_selectable, live_select_by }) => (
                  <div key={game_id} className={sty.box__game}>
                    <div className={sty.box__game_info}>
                      {game.thumbnail && (
                        <img src={game.thumbnail} alt={game.name} className={cx(sty.img__cover)} />
                      )}

                      <div className={sty.box__game_desc}>
                        <h3>{game.name}</h3>

                        {(isRankLocked || isHostEditMode) && (
                          <p>
                            {game.min_player}-{game.max_player} {t("Players")}
                          </p>
                        )}

                        {!isHostEditMode && (
                          <p>
                            {t("Owner")}：{add_by}
                          </p>
                        )}

                        {isHostEditMode && (
                          <SwitchToggler
                            data-id={_id}
                            isActivate={!!is_live_selectable}
                            handleClick={clickGameSelectableToggle}
                          />
                        )}
                      </div>

                      {!isRankLocked && !isHostEditMode && (
                        <button
                          type="button"
                          className={sty.btn__rank}
                          data-id={_id}
                          onClick={handleClickSelectRank}
                        >
                          select
                        </button>
                      )}
                    </div>

                    {isRankLocked && !isHostEditMode && (
                      <RankSeatList
                        event_game_id={_id}
                        rankList={live_select_by}
                        maxPlayerNum={game.max_player}
                        isCanEdit={isHostMode}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {OrphanNameList.length && (
          <div className={sty.box__orphans}>
            <h3>💦 {t("They have no chance left")}</h3>
            <div className={styRankSeatList.box__slot_list}>
              {OrphanNameList.map(name => (
                <SlotTag key={name} name={name} className={sty.SlotTag} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

VenueGameList.propTypes = {};

export default React.memo(VenueGameList);

function reorderGameList(gameList, formedGameIdMap) {
  const formedUserNameList = _flatten(Object.values(formedGameIdMap));

  const rankGameList = gameList.map(game => {
    const {
      _id,
      live_select_by,
      game: { max_player },
    } = game;

    const isAlreadyFormed = !!formedGameIdMap[_id];
    const formedNumber = formedGameIdMap[_id]?.length || 0;

    const rankListWithoutFormed = live_select_by.filter(
      ({ name }) => formedUserNameList.indexOf(name) === -1
    );

    const R1Number = rankListWithoutFormed.filter(({ rank }) => rank === 1).length + formedNumber;

    const isR1PerfectFull = R1Number === max_player;
    const isUserPerfectFull = rankListWithoutFormed.length + formedNumber === max_player;
    const isR1Overflow = R1Number > max_player;
    const numberOfNotFormedUser =
      rankListWithoutFormed.filter(({ name }) => formedUserNameList.indexOf(name) === -1).length +
      formedNumber;

    return {
      ...game,
      isAlreadyFormed,
      isR1PerfectFull, // 1. 人剛好滿，完全 #1
      isUserPerfectFull, // 2. #1 加總已塞爆的遊戲（協調後擠到之後的遊戲）
      isR1Overflow, // 3. 玩家人數剛好，但非全#1
      numberOfNotFormedUser,
      R1Number,
      outFormedNameList: isAlreadyFormed ? rankListWithoutFormed.map(({ name }) => name) : [],
    };
  });

  return _orderBy(
    rankGameList,
    ["isR1PerfectFull", "isUserPerfectFull", "isR1Overflow", "R1Number", "numberOfNotFormedUser"],
    ["desc", "desc", "desc", "desc", "desc"]
  );
}
