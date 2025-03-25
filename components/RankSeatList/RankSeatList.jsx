import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import _orderBy from "lodash/orderBy";
import cx from "clsx";
import { useTranslations } from "next-intl";

import useVenueStore from "@/stores/useVenueStore";

import sty from "./RankSeatList.module.scss";

const RankSeatList = ({ rankList, maxPlayerNum }) => {
  const t = useTranslations();
  const {
    // setHostArrangeRecord,
    // removedRankIdList,
    // formedGameIdList,
    formedUserNameList,
    giveUpRankIdList,
  } = useVenueStore(
    useShallow(state => ({
      // setHostArrangeRecord: state.setHostArrangeRecord,
      // removedRankIdList: state.removedRankIdList,
      // formedGameIdList: state.formedGameIdList,
      formedUserNameList: state.formedUserNameList,
      giveUpRankIdList: state.giveUpRankIdList,
    }))
  );

  const inlineRankList = useMemo(
    () =>
      _orderBy(
        rankList.filter(
          ({ _id, name }) =>
            formedUserNameList.indexOf(name) === -1 && giveUpRankIdList.indexOf(_id) === -1
        ),
        ["rank"]
      ),
    [rankList, formedUserNameList, giveUpRankIdList]
  );

  const giveUpRankList = useMemo(
    () => rankList.filter(({ _id }) => giveUpRankIdList.indexOf(_id) !== -1),
    [rankList, giveUpRankIdList]
  );

  const handleAddToGiveUpRank = useCallback(e => {
    const targetRankID = e.target.dataset.id;
    targetRankID &&
      useVenueStore.setState(({ giveUpRankIdList }) => {
        return { giveUpRankIdList: [...giveUpRankIdList, targetRankID] };
      });
  }, []);

  const handleRemoveFromGiveUpRank = useCallback(e => {
    const targetRankID = e.target.dataset.id;
    targetRankID &&
      useVenueStore.setState(({ giveUpRankIdList }) => {
        return { giveUpRankIdList: giveUpRankIdList.filter(id => id !== targetRankID) };
      });
  }, []);

  // const handleFromGroup = useCallback(() => {}, []);

  const waitList = inlineRankList.slice(maxPlayerNum);
  return (
    <div className={sty.RankSeatList}>
      <div className={sty.box__slot_list}>
        {[...Array(maxPlayerNum)].map((nulll, index) => {
          const { _id, rank, name } = inlineRankList[index] || {};
          return (
            <div
              key={`slot-${index}-${name}`}
              className={cx(sty.box__slot, {
                [sty.rank_1]: rank === 1,
                [sty.rank_2]: rank === 2,
                [sty.rank_3]: rank === 3,
              })}
              data-id={_id}
              onClick={handleAddToGiveUpRank}
            >
              {name || "Slot"}
            </div>
          );
        })}
      </div>

      {waitList.length > 0 && (
        <div className={sty.box__wait}>
          <h4>{t("Wait List")}</h4>
          <div className={sty.box__slot_list}>
            {waitList.map(({ name }) => (
              <div key={`slot-${name}`} className={cx(sty.box__slot, sty.box__slot_wait)}>
                {name || "Slot"}
              </div>
            ))}
          </div>
        </div>
      )}

      {giveUpRankList.length > 0 && (
        <div className={sty.box__wait}>
          <h4>{t("Cancel List")}</h4>
          <div className={cx(sty.box__slot_list, sty.box__give_up)}>
            {giveUpRankList.map(({ _id, rank, name }) => (
              <div
                key={`slot-${name}`}
                className={cx(sty.box__slot, {
                  [sty.rank_1]: rank === 1,
                  [sty.rank_2]: rank === 2,
                  [sty.rank_3]: rank === 3,
                })}
                data-id={_id}
                onClick={handleRemoveFromGiveUpRank}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

RankSeatList.propTypes = {};

export default RankSeatList;
