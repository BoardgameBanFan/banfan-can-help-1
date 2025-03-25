import { Fragment, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import _orderBy from "lodash/orderBy";
import { useShallow } from "zustand/react/shallow";

import cx from "clsx";

// import useUserStore from "@/stores/useUserStore";
import useVenueStore from "@/stores/useVenueStore";
import { useVenueGameSelectable } from "@/hooks/event/useEventActions";

import RankSeatList from "../RankSeatList";
import SwitchToggler from "../SwitchToggler";
import RankSelector from "../RankSelector";
import RankList from "../RankList";

import sty from "./VenueGameList.module.scss";

const rankConfList = [
  {
    color: "#FFD700",
    border: "#FF8402",
  },
  {
    color: "#C0C0C0",
    border: "#989898",
  },
  {
    color: "#CD7F32",
    border: "#794511",
  },
];

const VenueGameList = ({ gameList, isRankLocked, isHostEditMode, eventId, checkUserData }) => {
  const t = useTranslations();
  const [rankSelectedID, setRankSelectedID] = useState(false);
  const { switchGameSelectable } = useVenueGameSelectable(eventId);

  const { removedRankIdList, formedGameIdList } = useVenueStore(
    useShallow(state => ({
      removedRankIdList: state.removedRankIdList,
      formedGameIdList: state.formedGameIdList,
    }))
  );

  const orderedGameList = useMemo(() => {
    return isRankLocked && reorderGameList(gameList, formedGameIdList, removedRankIdList);
  }, [isRankLocked, gameList, formedGameIdList, removedRankIdList]);

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
    [switchGameSelectable]
  );

  return (
    <>
      {!isRankLocked && (
        <>
          <RankSelector
            gameList={gameList}
            rankSelectedID={rankSelectedID}
            setRankSelectedID={setRankSelectedID}
          />
          <RankList gameList={gameList} t={t} />
        </>
      )}
      <RankColorHinter />
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

                    {isRankLocked && (
                      <RankSeatList rankList={live_select_by} maxPlayerNum={game.max_player} />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

VenueGameList.propTypes = {};

export default VenueGameList;

function RankColorHinter() {
  return (
    <div className={sty.RankColorHinter}>
      {rankConfList.map(({ color, border }, index) => {
        return (
          <Fragment key={color}>
            <div
              className={sty.box__square}
              style={{
                "--color": color,
                "--b-color": border,
              }}
            />
            {`#${index + 1}`}
          </Fragment>
        );
      })}
    </div>
  );
}

function reorderGameList(gameList, formedGameIdList, removedRankIdList) {
  gameList
    .filter(({ _id }) => formedGameIdList.find(id => id === _id))
    .map(({ live_select_by }) =>
      live_select_by.filter(({ _id }) => removedRankIdList.indexOf(_id) !== -1)
    );
  const formedUserNameList = [
    ...gameList
      .filter(({ _id }) => formedGameIdList.find(id => id === _id))
      .map(({ live_select_by }) =>
        live_select_by.filter(({ _id }) => removedRankIdList.indexOf(_id) !== -1)
      )
      .reduce((prev, { name }) => {
        prev.add(name);
        return prev;
      }, new Set()),
  ];

  useVenueStore.setState({
    formedUserNameList,
  });

  const rankGameList = gameList.map(game => {
    const {
      _id,
      live_select_by,
      game: { max_player },
    } = game;

    const rankListWithoutFormed = live_select_by.filter(({ name }) => {
      formedUserNameList.indexOf(name) === -1;
    });

    const R1Number = rankListWithoutFormed.filter(({ rank }) => rank === 1).length;

    const isAlreadyFormed = formedGameIdList.find(id => id === _id);
    const isR1PerfectFull = R1Number === max_player;
    const isUserPerfectFull = rankListWithoutFormed.length === max_player;
    const isR1Overflow = R1Number > max_player;
    const numberOfNotFormedUser = rankListWithoutFormed.filter(
      ({ name }) => formedUserNameList.indexOf(name) === -1
    );

    return {
      ...game,
      isAlreadyFormed,
      isR1PerfectFull, // 1. 人剛好滿，完全 #1
      isUserPerfectFull, // 2. #1 加總已塞爆的遊戲（協調後擠到之後的遊戲）
      isR1Overflow, // 3. 玩家人數剛好，但非全#1
      numberOfNotFormedUser,
      R1Number,
    };
  });

  return _orderBy(
    rankGameList,
    [
      "isAlreadyFormed",
      "isR1PerfectFull",
      "isUserPerfectFull",
      "isR1Overflow",
      "numberOfNotFormedUser",
      "R1Number",
    ],
    ["desc", "desc"]
  );
}
