"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
  onVote: (isInterested: boolean) => void;
  gameName: string;
  isLoading?: boolean;
}

export function VoteModal({ open, onClose, onVote, gameName, isLoading }: VoteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>對 {gameName} 有興趣嗎？</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex justify-center gap-4 py-4">
          <Button
            onClick={() => onVote(true)}
            className="flex items-center gap-2 bg-[#2E6999] hover:bg-[#245780]"
            disabled={isLoading}
          >
            <ThumbsUp className="w-4 h-4" />
            感興趣
          </Button>
          <Button
            onClick={() => onVote(false)}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <ThumbsDown className="w-4 h-4" />
            不感興趣
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
