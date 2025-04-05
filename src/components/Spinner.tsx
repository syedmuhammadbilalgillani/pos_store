"use client";

import { Loader } from "lucide-react";
import { useEffect } from "react";

interface SpinnerProps {
  isLoading: boolean;
  size?: number;
  color?: string;
}

const Spinner = ({ isLoading, size = 48, color = "currentColor" }: SpinnerProps) => {
  // Prevent body scrolling when spinner is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader 
          size={size} 
          color={color} 
          className="animate-spin" 
          aria-label="Loading" 
        />
        <span className="text-sm font-medium">Please wait...</span>
      </div>
    </div>
  );
};

export default Spinner;
