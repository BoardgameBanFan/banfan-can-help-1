"use client";
import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react'; // Import the QR code library

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export function QrCodeModal({ isOpen, onClose, eventId, eventTitle }: QrCodeModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const venueUrl = typeof window !== 'undefined' ? `${window.location.origin}/venue/${eventId}` : '';
  
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white p-2"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Content - 40% empty top, 60% content */}
      <div className="h-[40%]"></div>
      <div className="h-[60%] bg-white rounded-t-3xl flex flex-col items-center px-6 pt-8 pb-12">
        {/* Real QR Code */}
        <div className="w-48 h-48 flex items-center justify-center mb-6 bg-white p-2 rounded-lg">
          <QRCodeCanvas 
            value={venueUrl} 
            size={192}
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        
        {/* Event name subtitle */}
        <p className="text-gray-500 text-base mb-2">{eventTitle}</p>
        
        {/* Join the Table title */}
        <h2 className="text-2xl font-bold mb-8">Join the Table</h2>
        
        {/* Copy link button */}
        <button 
          onClick={copyLink}
          className="flex items-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
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
