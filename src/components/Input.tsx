"use client";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import TranslatedText from "./Language/TranslatedText";

// Define all possible input types
type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "month"
  | "week"
  | "time"
  | "color"
  | "checkbox"
  | "radio"
  | "file"
  | "hidden"
  | "image"
  | "range"
  | "submit"
  | "reset"
  | "button";

// Define props interface extending HTML input attributes
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: InputType;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Reusable Input Component
const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  error,
  disabled = false,
  required = false,
  checked,
  ...restProps
}) => {
  // Default styles
  const baseStyles = `
  w-full p-2 border border-gray-100 dark:border-gray-800 
  focus:outline-0 rounded-lg bg-white dark:bg-gray-700 
  text-gray-900 dark:text-gray-100 
  ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} 
  ${error ? "border-red-500" : "bg-gray-600"}
`;

  // Switch styles for checkbox
  const switchStyles = `
      relative
      inline-block
      w-10
      h-6
      rounded-full
      ${checked ? "bg-gray-600" : "bg-gray-400"}
      transition-colors
      duration-200
      ease-in-out
      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      ${error ? "border-red-500" : ""}
    `;

  const switchThumbStyles = `
      absolute
      left-1
      top-1
      w-4
      h-4
      rounded-full
      bg-white
      transition-transform
      duration-200
      ease-in-out
      ${checked ? "translate-x-4" : "translate-x-0"}
    `;

  // Create a handler for the switch to toggle the hidden checkbox
  const handleSwitchClick = () => {
    if (!disabled && onChange) {
      // Create a synthetic event to mimic checkbox change
      const syntheticEvent = {
        target: {
          type: "checkbox",
          checked: !checked,
          id: restProps.id,
          name: restProps.name,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          <TranslatedText textKey={label} />

          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {type === "checkbox" ? (
        <div className="flex items-center">
          <div
            className={switchStyles}
            onClick={handleSwitchClick}
            role="checkbox"
            aria-checked={checked}
            tabIndex={disabled ? -1 : 0}
          >
            <div className={switchThumbStyles} />
          </div>
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="hidden"
            {...restProps}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${baseStyles} ${className}`}
          {...restProps}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;

// Example usage component
// const ExampleUsage: React.FC = () => {
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');

//   return (
//     <div>
//       <Input
//         label="Email"
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Enter your email"
//         required
//         className="my-custom-class"
//       />

//       <Input
//         label="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Enter your password"
//         error={password.length < 8 ? 'Password must be at least 8 characters' : ''}
//         disabled={false}
//       />
//     </div>
//   );
// };
