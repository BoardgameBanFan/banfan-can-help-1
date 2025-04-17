import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import _orderBy from "lodash/orderBy";
import cx from "clsx";
import { useTranslations } from "next-intl";
import { create as mutate } from "mutative";

import useVenueStore from "@/stores/useVenueStore";

import sty from "./RankSeatList.module.scss";

const RankSeatList = ({ event_game_id, rankList, maxPlayerNum, isCanEdit }) => {
  const t = useTranslations();
  const { formedGameIdMap, giveUpRankIdList } = useVenueStore(
    useShallow(state => ({
      formedGameIdMap: state.formedGameIdMap,
      giveUpRankIdList: state.giveUpRankIdList,
    }))
  );

  const isAlreadyFormed = !!formedGameIdMap[event_game_id];

  const inlineRankList = useMemo(
    () =>
      _orderBy(
        rankList.filter(
          ({ _id, name }) =>
            !Object.entries(formedGameIdMap)
              .filter(([id]) => id !== event_game_id)
              .find(([, nameList]) => nameList.indexOf(name) !== -1) &&
            giveUpRankIdList.indexOf(_id) === -1
        ),
        ["rank"]
      ),
    [rankList, formedGameIdMap, giveUpRankIdList, event_game_id]
  );

  const giveUpRankList = useMemo(
    () => rankList.filter(({ _id }) => giveUpRankIdList.indexOf(_id) !== -1),
    [rankList, giveUpRankIdList]
  );

  const handleAddToGiveUpRank = useCallback(e => {
    const targetRankID = e.target.dataset.id;

    if (targetRankID) {
      useVenueStore.setState(({ giveUpRankIdList }) => {
        return { giveUpRankIdList: [...giveUpRankIdList, targetRankID] };
      });
    }
  }, []);

  const handleRemoveFromGiveUpRank = useCallback(e => {
    const targetRankID = e.target.dataset.id;

    if (targetRankID) {
      useVenueStore.setState(({ giveUpRankIdList }) => {
        return { giveUpRankIdList: giveUpRankIdList.filter(id => id !== targetRankID) };
      });
    }
  }, []);

  const handleFromGroup = useCallback(() => {
    useVenueStore.setState(
      mutate(({ formedGameIdMap }) => {
        formedGameIdMap[event_game_id] = inlineRankList
          .slice(0, maxPlayerNum)
          .map(({ name }) => name);
      })
    );
  }, [event_game_id, inlineRankList, maxPlayerNum]);

  const handleUnFromGroup = useCallback(() => {
    useVenueStore.setState(
      mutate(({ formedGameIdMap }) => {
        delete formedGameIdMap[event_game_id];
      })
    );
  }, [event_game_id]);

  const waitList = inlineRankList.slice(maxPlayerNum);
  return (
    <div className={cx(sty.RankSeatList, { [sty.edit_mode]: isCanEdit && !isAlreadyFormed })}>
      <div className={sty.box__slot_list}>
        {[...Array(maxPlayerNum)].map((nulll, index) => {
          const { _id, rank, name } = inlineRankList[index] || {};
          return (
            <SlotTag
              key={`slot-${index}-${name}`}
              rank={rank}
              name={name}
              data-id={_id}
              onClick={handleAddToGiveUpRank}
              isAlreadyFormed={isAlreadyFormed}
              t={t}
            />
          );
        })}
      </div>

      {!isAlreadyFormed && giveUpRankList.length > 0 && (
        <div className={sty.box__wait}>
          <h4>{t("Cancel List")}</h4>
          <div className={cx(sty.box__slot_list, sty.box__give_up)}>
            {giveUpRankList.map(({ _id, name }, index) => (
              <SlotTag
                key={`slot-${index}-${name}`}
                name={name}
                data-id={_id}
                onClick={handleRemoveFromGiveUpRank}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      {!isAlreadyFormed && waitList.length > 0 && (
        <div className={sty.box__wait}>
          <h4>{t("Wait List")}</h4>
          <div className={sty.box__slot_list}>
            {waitList.map(({ rank, name }) => (
              <SlotTag
                key={`slot-${name}`}
                name={name}
                rank={rank}
                className={sty.box__slot_wait}
                onClick={handleRemoveFromGiveUpRank}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      {isCanEdit && (
        <button
          type="button"
          className={cx(sty.btn__form, {
            [sty.btn__formed]: isAlreadyFormed,
          })}
          onClick={isAlreadyFormed ? handleUnFromGroup : handleFromGroup}
        >
          {isAlreadyFormed ? t("Unlock Formed") : t("Form group")}
        </button>
      )}
    </div>
  );
};

RankSeatList.propTypes = {};

export default RankSeatList;

export function SlotTag({ t, isAlreadyFormed, className, name, rank, ...restProps }) {
  return (
    <div
      className={cx(sty.box__slot, className, {
        [sty.rank_1]: rank === 1,
        [sty.rank_2]: rank === 2,
        [sty.rank_3]: rank === 3,
        [sty.formed]: isAlreadyFormed,
      })}
      {...restProps}
    >
      {name || t("Slot")}
    </div>
  );
}
