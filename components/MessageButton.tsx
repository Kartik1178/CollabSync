// MessageButton.tsx
import { useState } from "react";
import Link from "next/link";
import MessagePopup from "./MessagePopup";

export default function MessageButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const openPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  return (
    <>
      <button 
        onClick={openPopup}
        className="relative p-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <i className="fa-regular fa-envelope text-xl"></i>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
      </button>
      
      <MessagePopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
}