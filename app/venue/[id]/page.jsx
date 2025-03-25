"use client";

import React, { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useEventDetails } from "@/hooks/event/useEventDetails";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { QrCode } from "lucide-react";
import { QrCodeModal } from "@/components/QrCodeModal";

import { useVenueRankAble } from "@/hooks/event/useEventActions";
import useUserStore from "@/stores/useUserStore";
import useVenueStore from "@/stores/useVenueStore";
import usePusher from "@/hooks/usePusher";

import VenueGameList from "@/components/VenueGameList";
import UserQuickInfoModal from "@/components/UserQuickInfoModal";

import sty from "./PageVenue.module.scss";
import { checkToken } from "@/app/actions/auth";

export default function VenuePage() {
  const t = useTranslations();
  const [
    // FIXME: 白痴 lint 檢查
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);
  const {
    // isLogin,
    // name, // for future event have host_by to make sure is the host
    venueName,
    checkUserData,
  } = useUserStore(state => state);
  const params = useParams();
  // Check authentication status
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuth = await checkToken();
      setIsAuthenticated(isAuth);
    };

    checkAuthentication();
  }, []);

  const isHostMode = isAuthenticated; // FIXME: fot test
  const toggleEditMode = useCallback(() => setIsHostEditMode(state => !state), []);
  const [isHostEditMode, setIsHostEditMode] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);

  const [isRankLocked, setIsRankLocked] = useState(false);

  usePusher({ isActivate: isHostMode, event_id: params.id });
  const { event, games, isLoading, error } = useEventDetails(params.id);
  const { select_end_at } = event || {};

  useEffect(() => {
    // if open rank then select_end_at not exist
    setIsRankLocked(!!select_end_at);
    return () => {};
  }, [select_end_at]);

  const { userRankReadyNameSet, addRankReadyUserName, setMyRankList, initArrangeData } =
    useVenueStore(
      useShallow(state => ({
        userRankReadyNameSet: state.userRankReadyNameSet,
        addRankReadyUserName: state.addRankReadyUserName,
        setMyRankList: state.setMyRankList,
        initArrangeData: state.initArrangeData,
      }))
    );

  useEffect(() => {
    params.id && initArrangeData(params.id);
    return () => {};
  }, [params.id, initArrangeData]);

  useEffect(() => {
    const myRankListIsEmptySoTryToInitial =
      useVenueStore.getState().myRankList.filter(id => id).length === 0;

    if (games) {
      for (const { live_select_by } of games) {
        if (live_select_by) {
          for (const { name, rank, event_game_id } of live_select_by) {
            addRankReadyUserName(name);
            if (myRankListIsEmptySoTryToInitial & (name === venueName)) {
              setMyRankList(event_game_id, rank);
            }
          }
        }
      }
    }
    return () => {};
  }, [games, addRankReadyUserName, venueName, setMyRankList]);

  // console.log(games);

  if (isLoading || error || !event)
    return <StatusRender status={{ isLoading, error, event }} t={t} />;

  const gameCovers = games.map(gameItem => ({
    thumbnail: gameItem.game.thumbnail,
    name: gameItem.game.name,
  }));

  return (
    <>
      <QrCodeModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        eventId={params.id}
        eventTitle={event?.title}
        gameCovers={gameCovers}
      />
      <div className="p-6">
        <Header
          event={event}
          isHostMode={isHostMode}
          isHostEditMode={isHostEditMode}
          toggleEditMode={toggleEditMode}
          setIsQrCodeModalOpen={setIsQrCodeModalOpen}
        />
        {isHostMode && (
          <>
            <CompleteRankList t={t} userRankReadyNameSet={userRankReadyNameSet} />
            <BtnLockRank isRankLocked={isRankLocked} t={t} eventId={params.id} />
          </>
        )}

        {games ? (
          games.length ? (
            <VenueGameList
              isRankLocked={isRankLocked}
              isHostEditMode={isHostEditMode}
              gameList={games}
              eventId={params.id}
              checkUserData={checkUserData}
            />
          ) : (
            <div>{`${t("Please wait for the host")} :)`}</div>
          )
        ) : (
          <div>{t("No game in the list")}</div>
        )}
      </div>
      <UserQuickInfoModal mode="name" isVenue />
    </>
  );
}

const BtnLockRank = React.memo(({ isRankLocked, t, eventId }) => {
  const { setRankLock } = useVenueRankAble(eventId);
  const [isLocked, setIsLocked] = useState(isRankLocked);
  useEffect(() => {
    setIsLocked(isRankLocked);
    return () => {};
  }, [isRankLocked]);
  const handleClick = () => {
    setIsLocked(state => {
      setRankLock(!state);
      return !state;
    });
  };
  return (
    <button type="button" className={sty.btn__rank_lock} onClick={handleClick}>
      {isLocked ? t("Open Ranking now") : t("Lock the ranking")}
    </button>
  );
});

BtnLockRank.displayName = "BtnLockRank";

function Header({ event, isHostMode, toggleEditMode, isHostEditMode, setIsQrCodeModalOpen }) {
  return (
    <header className={sty.header}>
      <h1>{event.title}</h1>
      <div className={sty.box__icons}>
        {isHostMode && (
          <button type="button" className={sty.btn__edit} onClick={toggleEditMode}>
            {isHostEditMode ? "Back" : "Edit"}
          </button>
        )}
        <button
          onClick={() => setIsQrCodeModalOpen(true)}
          aria-label="Share QR Code"
          className={sty.btn__qr}
        >
          <QrCode width={35} height={35} />
        </button>
      </div>
    </header>
  );
}

function CompleteRankList({ t, userRankReadyNameSet }) {
  const list = [...userRankReadyNameSet];
  return (
    <div className={sty.CompleteRankList}>
      <h3 className={sty.h3}>
        {t("Receiving submission")} ( {list.length} )
      </h3>
      {list?.map((name, index) => (
        <span key={name}>{`${name}${index + 1 === list.length ? "" : ", "}`}</span>
      ))}
    </div>
  );
}

function StatusRender({ status: { isLoading, error, event }, t }) {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Data Fail: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-gray-500">{t("Event Not Found")}</div>
      </div>
    );
  }
}
