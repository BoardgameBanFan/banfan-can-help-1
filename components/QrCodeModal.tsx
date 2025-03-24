"use client";
import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react'; // Import the QR code library
import { useGameCoversBackground } from "@/hooks/useGameCoversBackground";

interface GameCover {
  thumbnail: string;
  name?: string;
}

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  gameCovers: GameCover[];
}

export function QrCodeModal({ isOpen, onClose, eventId, eventTitle, gameCovers = [] }: QrCodeModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const venueUrl = typeof window !== 'undefined' ? `${window.location.origin}/venue/${eventId}` : '';
  
  // Generate the game covers background
  const backgroundComponent = useGameCoversBackground(gameCovers);
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(venueUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex flex-col">
      {/* Game Covers Background */}
      {backgroundComponent}
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-700 p-2 z-20"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Content - 50% empty top, 50% content */}
      <div className="h-[50%]"></div>
      <div 
        className="h-[50%] flex flex-col items-center px-6 pt-[66px] pb-12 z-5 relative"
        style={{ background: 'linear-gradient(to bottom, rgba(136, 146, 216, 0), rgba(72, 77, 114, 0.85) 40%)' }}
      >
        {/* Real QR Code with card container */}
        <div className="bg-white p-4 shadow-md mb-6 z-20 relative" style={{ borderRadius: '24px' }}>
          <div className="w-40 h-40 flex items-center justify-center">
            <QRCodeCanvas 
              value={venueUrl} 
              size={160}
              bgColor={"#FFFFFF"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
            />
          </div>
        </div>
        
        {/* Event name subtitle */}
        <p className="text-gray-500 text-base mb-2 z-20 relative">{eventTitle}</p>
        
        {/* Join the Table title */}
        <h2 className="text-2xl font-bold mb-8 z-20 relative">Join the Table</h2>
        
        {/* Copy link button */}
        <button 
          onClick={copyLink}
          className="flex items-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm z-20 relative"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
