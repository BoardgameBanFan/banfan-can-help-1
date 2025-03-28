"use client";
import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react'; // Import the QR code library
import { useGameCoversBackground } from "@/hooks/useGameCoversBackground";
import useMobileResponsiveVh from "@/hooks/useMobileResponsiveVh";

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

  // Use the mobile responsive vh hook to handle mobile browser UI
  useMobileResponsiveVh();

  // Generate the game covers background
  const backgroundComponent = useGameCoversBackground(gameCovers);

  // Lock scroll when modal is open
  useEffect(() => {
    const preventScroll = (e: TouchEvent | WheelEvent) => {
      e.preventDefault();
    };

    if (isOpen) {
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';

      // Also prevent wheel and touch events to ensure no scrolling happens
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll as EventListener, { passive: false });
    }

    return () => {
      // Re-enable scrolling when component unmounts or modal closes
      document.body.style.overflow = '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll as EventListener);
    };
  }, [isOpen]);

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
    <div
      className="fixed inset-0 z-50 bg-[#f5f5dc] bg-opacity-100 flex flex-col"
      onClick={(e) => e.stopPropagation()}
      style={{ 
        height: 'calc(var(--vh, 1vh) * 100)',  // Use the CSS custom property
        maxHeight: '100%',
      }}
    >
      {/* Game Covers Background */}
      {backgroundComponent}

      {/* Close button with background color */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-700 p-2 z-20 rounded-full bg-[#f5f0e0] hover:bg-[#ebe6d6] transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content - More responsive layout */}
      <div className="h-[40%] md:h-[45%]"></div>
      <div
        className="h-[60%] md:h-[55%] flex flex-col items-center justify-end px-4 md:px-6 pt-0 md:pt-0 pb-8 md:pb-12 z-5 relative overflow-y-auto"
        style={{ background: 'linear-gradient(to bottom, rgba(136, 146, 216, 0), rgba(72, 77, 114, 0.85) 40%)' }}
      >
        {/* Real QR Code with card container */}
        <div className="bg-white p-4 shadow-md mb-4 md:mb-6 z-20 relative" style={{ borderRadius: '24px' }}>
          <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            <QRCodeCanvas
              value={venueUrl}
              size={128}
              bgColor={"#FFFFFF"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
            />
          </div>
        </div>

        {/* Event name subtitle */}
        <p className="text-white text-base mb-1 md:mb-2 z-20 relative">{eventTitle}</p>

        {/* Join the Table title */}
        <h2 className="text-white text-xl md:text-2xl font-bold mb-6 md:mb-8 z-20 relative">Join the Table</h2>

        {/* Copy link button */}
        <button
          onClick={copyLink}
          className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm z-20 relative mb-4 md:mb-6"
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
