"use client";
import type React from "react";
import { useState } from "react";
import cx from "clsx";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";

import { VoteModal } from "./VoteModal/index";

interface Vote {
  email: string;
  name: string;
  is_interested: boolean;
}

interface Game {
  name: string;
  thumbnail?: string;
  description?: string;
  min_player?: number;
  max_player?: number;
}

interface GameWithAddUser {
  _id: string;
  game_id: string;
  game: Game;
  add_by: string;
  vote_by?: Vote[];
}

interface GameItemCardProps {
  gameWithAddUser: GameWithAddUser;
  mode?: "create" | "event";
  canVote?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  handleClickVote?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentUser?: string;
  userEmail?: string;
}

export function GameItemCard({
  gameWithAddUser,
  mode = "event",
  canVote = false,
  onDelete,
  onEdit,
  userEmail,
  handleClickVote,
}: GameItemCardProps) {
  const { _id, game_id, game, add_by, vote_by = [] } = gameWithAddUser;
  const [isVoting, setIsVoting] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const userVote = userEmail
    ? vote_by?.find(vote => vote.email.toLowerCase() === userEmail.toLowerCase())
    : null;

  const interestedCount = vote_by?.filter(vote => vote.is_interested).length;
  const notInterestedCount = vote_by?.length - interestedCount;
  const showVoteButton = mode === "event" && canVote && !userVote;

  return (
    <>
      <div className="flex p-3 bg-white rounded-lg shadow-sm group">
        <div className="w-16 h-16 mr-3 bg-gray-100 rounded overflow-hidden">
          <img src={game?.thumbnail} alt={game?.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">{game?.name}</h3>
            <div className="flex items-center gap-2">
              {mode === "create" && (
                <>
                  {onEdit && (
                    <button
                      type="button"
                      onClick={onEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <EditIcon />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={onDelete}
                      className="text-red-500 hover:text-red-600"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  )}
                </>
              )}
              {showVoteButton && (
                <button
                  type="button"
                  onClick={handleClickVote}
                  disabled={isVoting}
                  className="py-1 px-4 rounded transition-colors duration-200 bg-[#2E6999] hover:bg-[#245780] text-white disabled:opacity-50"
                  data-id={_id}
                >
                  投票
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <p className="text-gray-500">推薦者：{add_by}</p>
            {!showVoteButton && vote_by && mode === "event" && (
              <div
                className="flex items-center gap-4 mt-2 cursor-pointer"
                onClick={() => handleClickVote}
                data-id={game_id}
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  <SentimentSatisfiedAlt
                    className={`w-6 h-6 ${
                      userVote?.is_interested ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`${userVote?.is_interested ? "text-green-600" : "text-gray-600"}`}
                  >
                    {interestedCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 pointer-events-none">
                  <SentimentVeryDissatisfied
                    className={`w-6 h-6 ${
                      userVote && !userVote.is_interested ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`${
                      userVote && !userVote.is_interested ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {notInterestedCount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
