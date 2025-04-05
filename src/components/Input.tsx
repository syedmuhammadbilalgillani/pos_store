"use client";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import TranslatedText from "./Language/TranslatedText";

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
  checked?: boolean;
}

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
  const switchStyles = `
    relative inline-block w-10 h-6 rounded-full 
    ${checked ? "bg-gray-600" : "bg-gray-400"}
    transition-colors duration-200 ease-in-out 
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
    ${error ? "border border-red-500" : ""}
  `;

  const switchThumbStyles = `
    absolute left-1 top-1 w-4 h-4 rounded-full bg-white 
    transition-transform duration-200 ease-in-out 
    ${checked ? "translate-x-4" : "translate-x-0"}
  `;

  const handleSwitchClick = () => {
    if (!disabled && onChange) {
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
        <label
          htmlFor={restProps.id}
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
        >
          <TranslatedText textKey={label} />
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {type === "checkbox" ? (
        <div className="flex items-center gap-2">
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
        <ShadcnInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${error ? "border-red-500" : ""} ${className}`}
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
