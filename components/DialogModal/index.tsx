"use client";
import { Dialog } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface DialogModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function DialogModal({ 
  open, 
  onClose, 
  children, 
  title,
  maxWidth = 'sm',
  fullWidth = true,
}: DialogModalProps) {
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "24px",
        },
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute -right-4 -top-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <CloseIcon />
        </button>
        
        {title && (
          <h2 className="text-xl font-bold mb-6 pr-8">
            {title}
          </h2>
        )}
        
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Dialog>
  );
}