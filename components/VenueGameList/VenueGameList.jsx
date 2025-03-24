import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

// import useUserStore from "@/stores/useUserStore";
import { useVenueGameSelectable } from "@/hooks/event/useEventActions";

import SwitchToggler from "../SwitchToggler";
import RankSelector from "../RankSelector";
import RankList from "../RankList";

import sty from "./VenueGameList.module.scss";

const VenueGameList = ({ gameList, isRankLocked, isHostEditMode, eventId, checkUserData }) => {
  const t = useTranslations();
  const [rankSelectedID, setRankSelectedID] = useState(false);
  const { switchGameSelectable } = useVenueGameSelectable(eventId);

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
      <RankSelector
        gameList={gameList}
        rankSelectedID={rankSelectedID}
        setRankSelectedID={setRankSelectedID}
      />
      <RankList gameList={gameList} t={t} />
      <div className={sty.VenueGameList}>
        {gameList && gameList.length > 0 && (
          <div className="mt-6">
            <h2 className={sty.h2}>{t("Game List")}</h2>
            <div className="space-y-4">
              {gameList
                .filter(({ is_live_selectable }) => (isHostEditMode ? true : is_live_selectable))
                .map(({ _id, game_id, game, add_by, is_live_selectable }) => (
                  <div key={game_id} className={sty.box__game}>
                    <div className={sty.box__game_info}>
                      {game.thumbnail && (
                        <img src={game.thumbnail} alt={game.name} className={sty.img__cover} />
                      )}
                      <div className={sty.box__game_desc}>
                        <h3>{game.name}</h3>
                        {isHostEditMode && (
                          <SwitchToggler
                            data-id={_id}
                            isActivate={!!is_live_selectable}
                            handleClick={clickGameSelectableToggle}
                          />
                        )}
                        {isRankLocked && (
                          <p className="text-sm text-gray-600">
                            {game.min_player}-{game.max_player} {t("Players")}
                          </p>
                        )}
                        <p>
                          {t("Owner")}：{add_by}
                        </p>
                      </div>
                      {!isRankLocked && (
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
                    {isRankLocked && <SeatList />}
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

function SeatList() {
  return (
    <div className="mt-2">
      <p className="text-sm font-medium">參與者：</p>
      {/* <div className="flex flex-wrap gap-2 mt-1">
                            {players.map(player => (
                              <span
                                key={player.user_id}
                                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                              >
                                {player.user_name}
                              </span>
                            ))}
                          </div> */}
    </div>
  );
}
