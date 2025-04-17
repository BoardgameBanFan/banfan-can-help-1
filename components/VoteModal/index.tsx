"use client";
import { DialogModal } from "@/components/DialogModal";
import { SentimentSatisfiedAlt, SentimentVeryDissatisfied } from '@mui/icons-material';

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
  onVote: (isInterested: boolean) => Promise<void>;
  gameName: string;
  isLoading?: boolean;
}

export function VoteModal({ open, onClose, onVote, gameName, isLoading }: VoteModalProps) {
  return (
    <DialogModal 
      open={open} 
      onClose={onClose} 
      title={`對 ${gameName} 投票`}
      maxWidth="xs"
    >
      <div className="space-y-6">
        <p className="text-gray-600">你對這個遊戲有興趣嗎？</p>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onVote(true)}
            disabled={isLoading}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
              isLoading 
                ? "opacity-50 cursor-not-allowed" 
                : "border-transparent hover:border-green-500 hover:bg-green-50"
            }`}
          >
            <SentimentSatisfiedAlt 
              className="w-12 h-12 text-green-500"
              fontSize="large"
            />
            <span className="font-medium text-green-600">有興趣</span>
          </button>

          <button
            type="button"
            onClick={() => onVote(false)}
            disabled={isLoading}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
              isLoading 
                ? "opacity-50 cursor-not-allowed" 
                : "border-transparent hover:border-red-500 hover:bg-red-50"
            }`}
          >
            <SentimentVeryDissatisfied 
              className="w-12 h-12 text-red-500"
              fontSize="large"
            />
            <span className="font-medium text-red-600">沒興趣</span>
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500 animate-pulse">
            處理中...
          </div>
        )}
      </div>
    </DialogModal>
  );
}
