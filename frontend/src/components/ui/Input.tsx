import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-gray-900 ${
            error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
