"use client";
import type React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslations } from "next-intl";

// import { VoteModal } from "./VoteModal/index";

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
  handleClickVote?: (e: React.MouseEvent<HTMLElement>) => void; // 更廣泛的型別
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
  const { _id, game, add_by, vote_by = [] } = gameWithAddUser;
  const t = useTranslations();
  // const [isVoting, setIsVoting] = useState(false);
  // const [showVoteModal, setShowVoteModal] = useState(false);
  // const [voteError, setVoteError] = useState<string | null>(null);

  const userVote = userEmail
    ? vote_by?.find(vote => vote.email.toLowerCase() === userEmail.toLowerCase())
    : null;

  const interestedCount = vote_by?.filter(vote => vote.is_interested).length;
  const notInterestedCount = vote_by?.length - interestedCount;
  const showVoteButton = mode === "event" && canVote && !userVote;

  return (
    <div className="p-3 bg-white rounded-md shadow-sm flex justify-between">
      <div className="flex gap-4">
        <div className="h-20 w-20 overflow-hidden shrink-0">
          <img src={game?.thumbnail} alt={game?.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="font-bold text-lg line-clamp-3">{game?.name}</h3>
          <p className="text-sm text-gray-500 truncate">
            {t("Owner")}：{add_by}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        {mode === "create" && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button type="button" onClick={onEdit} className="text-gray-500 hover:text-gray-700">
                <EditIcon />
              </button>
            )}
            {onDelete && (
              <button type="button" onClick={onDelete} className="text-red-500 hover:text-red-600">
                <DeleteOutlineIcon />
              </button>
            )}
          </div>
        )}

        {showVoteButton && (
          <button
            type="button"
            onClick={e => handleClickVote?.(e)}
            className="py-1 px-4 rounded transition-colors duration-200 bg-[#2E6999] hover:bg-[#245780] text-white disabled:opacity-50"
            data-id={_id}
          >
            {t("Vote")}
          </button>
        )}

        {!showVoteButton && vote_by && mode === "event" && (
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={e => handleClickVote?.(e)}
            data-id={_id}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <img
                src={`/vote/${userVote?.is_interested ? encodeURIComponent("icon_want to play_fill.svg") : encodeURIComponent("icon_want to play_outline.svg")}`}
                alt="Want to play"
                className="w-6 h-6 object-contain"
              />
              <span className={`${userVote?.is_interested ? "text-green-600" : "text-gray-600"}`}>
                {interestedCount}
              </span>
            </div>
            <div className="flex items-center gap-2 pointer-events-none">
              <img
                src={`/vote/${userVote && !userVote.is_interested ? encodeURIComponent("icon_not_interested_fill.svg") : encodeURIComponent("icon_not_interested_outline.svg")}`}
                alt="Not interested"
                className="w-6 h-6 object-contain"
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
  );
}
