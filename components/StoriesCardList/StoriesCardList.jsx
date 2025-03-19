"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import cx from "clsx";
import { useVoteGame } from "@/hooks/event/useVoteGame";
import useUserStore from "@/stores/useUserStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useSprings, a } from "@react-spring/web";
import { create as mutate } from "mutative";
import useClickAway from "react-use/lib/useClickAway";

import sty from "./StoriesCardList.module.scss";

const cardMap = {
  true: "100%",
  false: "-100%",
  null: "0%",
};

const StoriesCardList = ({ isOpen = false, setIsOpen, eventId, initialFocusId, gameList }) => {
  const refCardContainer = useRef();
  const refIsAlreadyOpen = useRef(false);
  const [nowFocusId, setNowFocusId] = useState(false);
  const { voteGame, isLoading: isVoting } = useVoteGame();
  const { email, name, checkUserData, isOpenUserQuickInfoModal } = useUserStore(state => state);
  const [prepareList, setPrepareList] = useState([]);
  const t = useTranslations();

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCloseModel = useCallback(() => {
    if (isOpenUserQuickInfoModal) return;
    refIsAlreadyOpen.current = false;
    setNowFocusId(null);
    setTimeout(() => {
      // animate transition
      closeModal();
    }, 500);
  }, [closeModal, isOpenUserQuickInfoModal]);

  useClickAway(refCardContainer, handleCloseModel);

  useEffect(() => {
    if (isOpen && refIsAlreadyOpen.current) return;
    refIsAlreadyOpen.current = true;
    setNowFocusId(initialFocusId);
    setPrepareList(
      gameList
        .filter(({ _id, vote_by }) => {
          return initialFocusId === _id || !vote_by?.find(({ email: e }) => e === email);
        })
        .sort((a, b) => (a._id === initialFocusId ? -1 : b._id === initialFocusId ? 1 : 0))
        .map(props => {
          return {
            ...props,
            isInterested:
              initialFocusId === props._id
                ? null // re-edit interested should show
                : props.vote_by?.find(({ email: e }) => e === email)?.is_interested,
          };
        })
    );
    return () => {};
  }, [isOpen, initialFocusId, gameList, email]);

  const [springsCards, api] = useSprings(prepareList.length, () => {
    return {
      x: "0%",
      y: "100%",
      opacity: 0,
    };
  });

  useEffect(() => {
    api.start(index => {
      const isFocused = nowFocusId === prepareList[index]?._id;
      const isInterested = prepareList[index]?.isInterested;
      return {
        x: cardMap[isInterested] || "0%",
        y: isOpen ? (isFocused ? "0%" : isInterested !== null ? "0%" : "100%") : "100%",
        opacity: isFocused ? 1 : 0,
      };
    });
    return () => {};
  }, [api, isOpen, nowFocusId, prepareList]);

  const handleVote = useCallback(
    async (nowFocusId, isInterested) => {
      try {
        const nowFocusIndex = prepareList.findIndex(({ _id }) => _id === nowFocusId);
        voteGame({
          eventId,
          gameId: prepareList[nowFocusIndex].game_id,
          isInterested,
          email,
          name,
        });

        setPrepareList(
          mutate(state => {
            state[nowFocusIndex].isInterested = isInterested;
          })
        );

        // is last one, so close modal
        if (nowFocusIndex === prepareList.length - 1) {
          handleCloseModel();
        } else {
          setNowFocusId(prepareList[nowFocusIndex + 1]?._id);
        }
      } catch (error) {
        console.error("Vote failed:", error);
        throw error;
      }
    },
    [email, name, eventId, voteGame, prepareList, handleCloseModel]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleClickVote = useCallback(
    e => {
      if (!checkUserData(["email"], true)) {
        toast(t("Please fill in your email first"));
        return;
      }
      handleVote(nowFocusId, e.target.dataset.interested === "true");
    },
    [handleVote, nowFocusId]
  );

  if (!isOpen) return null;

  return (
    <div className={sty.StoriesCardList}>
      <img
        className={sty.img__icon_cross}
        src={require("./images/icon-cross.svg").default.src}
        alt="+"
      />
      <div
        ref={refCardContainer}
        className={cx("mx-auto max-w-[480px] min-h-screen", sty.container)}
      >
        {prepareList.map(
          (
            {
              _id,
              comment,
              // add_by,
              banner, // image
              // game_id,
              game: {
                names,
                description,
                image: image_cover,
                //  thumbnail
              },
            },
            index
          ) => {
            const name = names.find(({ language }) => language === "primary")?.value;
            const desc = comment || description;

            return (
              <a.div key={_id} className={sty.StoriesCard} style={springsCards[index]}>
                <div
                  className={sty.bg__container}
                  style={{
                    "--bg-image-url": `url("${banner || image_cover}")`,
                  }}
                >
                  <img
                    src={image_cover}
                    alt="game"
                    className={sty.img__cover}
                    onClick={handleCloseModel}
                  />
                  <h3>{name}</h3>
                  {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                  <p dangerouslySetInnerHTML={{ __html: desc }} />
                  <div className={sty.box__btns}>
                    <button
                      className={cx(sty.btn, sty.btn__not_interested)}
                      onClick={handleClickVote}
                      type="button"
                      disabled={isVoting}
                      data-interested="false"
                    >
                      Not Interested
                    </button>
                    <button
                      className={cx(sty.btn, sty.btn__want)}
                      onClick={handleClickVote}
                      type="button"
                      disabled={isVoting}
                      data-interested="true"
                    >
                      <img
                        className={sty.img__icon_plus}
                        src={require("./images/icon-plus.svg").default.src}
                        alt="+"
                      />
                      {t("Want to play")}
                    </button>
                  </div>
                </div>
              </a.div>
            );
          }
        )}
      </div>
    </div>
  );
};

StoriesCardList.propTypes = {};

export default StoriesCardList;
