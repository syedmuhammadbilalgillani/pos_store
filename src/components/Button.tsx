import React from "react";
import TranslatedText from "./Language/TranslatedText";

// Define the props interface for the Button component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  type = "button",
  ariaLabel,
  // className = "",
}) => {
  // Define variant classes
  const variantClasses = {
    primary: "bg-[#763FF9] hover:bg-[#763FF9]/80  text-white",
    secondary: "bg-gray-500 hover:bg-gray-700 text-white",
    outline:
      "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50",
  };

  // Define size classes
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  // Combine classes based on props
  const buttonClasses = `rounded cursor-pointer transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
    variantClasses[variant]
  } ${sizeClasses[size]} ${
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
  }`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={
        ariaLabel || (typeof children === "string" ? children : "Button")
      }
      className={buttonClasses}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="mr-2">Loading...</span>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      ) : (
        <TranslatedText textKey={children as string} />
      )}
    </button>
  );
};

export default Button;
