"use client";
import React, { useState } from 'react';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from '@mui/icons-material/Edit';
import { SentimentSatisfiedAlt, SentimentVeryDissatisfied } from '@mui/icons-material';
import { VoteModal } from './VoteModal';

interface User {
  email: string;
  name: string;
}

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
  game: Game;
  add_by: string;
  vote_by?: Vote[];
}

interface GameItemCardProps {
  gameWithAddUser: GameWithAddUser;
  mode?: 'create' | 'event';
  canVote?: boolean;
  onVote?: (gameId: string, isInterested: boolean) => Promise<void>;
  onDelete?: () => void;
  onEdit?: () => void;
  currentUser?: User | null;
}

export function GameItemCard({
  gameWithAddUser,
  mode = 'event',
  canVote = false,
  onVote,
  onDelete,
  onEdit,
  currentUser
}: GameItemCardProps) {
  const {_id, game, add_by, vote_by = []} = gameWithAddUser;
  const [isVoting, setIsVoting] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const userVote = currentUser
    ? vote_by.find(vote => vote.email.toLowerCase() === currentUser.email.toLowerCase())
    : null;

  const interestedCount = vote_by.filter(vote => vote.is_interested).length;
  const notInterestedCount = vote_by.length - interestedCount;
  const showVoteButton = mode === 'event' && canVote && !userVote && currentUser;
  console.log(game?.name)
  const handleVoteClick = () => {
    if (!onVote || !currentUser) return;
    // setShowVoteModal(true);
  };

  const handleVoteSubmit = async (isInterested: boolean) => {
    if (!onVote || !currentUser) return;

    try {
      setIsVoting(true);
      setVoteError(null);
      await onVote(_id, isInterested);
      setShowVoteModal(false);
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : '投票失敗');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <div className="flex p-3 bg-white rounded-lg shadow-sm group">
        <div className="w-16 h-16 mr-3 bg-gray-100 rounded overflow-hidden">
          <img
            src={game?.thumbnail}
            alt={game?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">{game?.name}</h3>
            <div className="flex items-center gap-2">
              {mode === 'create' && (
                <>
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-700"
                    >
                      <EditIcon />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  )}
                </>
              )}
              {showVoteButton && (
                <button
                  onClick={handleVoteClick}
                  disabled={isVoting}
                  className="py-1 px-4 rounded transition-colors duration-200 bg-[#2E6999] hover:bg-[#245780] text-white disabled:opacity-50"
                >
                  投票
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <p className="text-gray-500">推薦者：{add_by}</p>
            {vote_by && mode === 'event' && (
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <SentimentSatisfiedAlt
                    className={`w-6 h-6 ${
                      userVote?.is_interested 
                        ? "text-green-500" 
                        : "text-gray-400"
                    }`}
                  />
                  <span className={`${
                    userVote?.is_interested ? "text-green-600" : "text-gray-600"
                  }`}>
                    {interestedCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <SentimentVeryDissatisfied
                    className={`w-6 h-6 ${
                      userVote && !userVote.is_interested
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span className={`${
                    userVote && !userVote.is_interested ? "text-red-600" : "text-gray-600"
                  }`}>
                    {notInterestedCount}
                  </span>
                </div>
                {voteError && (
                  <span className="text-red-500 text-xs">
                    {voteError}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/*<VoteModal*/}
      {/*  open={showVoteModal}*/}
      {/*  onClose={() => setShowVoteModal(false)}*/}
      {/*  onVote={handleVoteSubmit}*/}
      {/*  isLoading={isVoting}*/}
      {/*/>*/}
    </>
  );
}
