import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import TranslatedText from "./Language/TranslatedText";

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
  className = "",
}) => {
  // Custom variant styling for non-shadcn variants
  const variantClasses = {
    primary: "bg-[#763FF9] hover:bg-[#763FF9]/80 text-white",
    secondary: "bg-gray-500 hover:bg-gray-700 text-white",
    outline:
      "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50",
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const combinedClassName = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    rounded cursor-pointer transition duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <ShadcnButton
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={
        ariaLabel || (typeof children === "string" ? children : "Button")
      }
      className={combinedClassName}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="mr-2">Loading...</span>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      ) : (
        <TranslatedText textKey={children as string} />
      )}
    </ShadcnButton>
  );
};

export default Button;
