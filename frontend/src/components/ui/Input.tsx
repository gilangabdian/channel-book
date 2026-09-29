import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, type, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col w-full">
        <div className="relative w-full">
          {/* placeholder=" " (spasi) adalah kunci floating label — jangan dihapus */}
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={[
              "peer w-full px-4 pt-5 pb-2 bg-gray-50/50 border rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
              "text-gray-900 text-sm",
              // Extra right padding for password fields (space for eye icon)
              isPassword ? "pr-11" : "",
              error ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-primary",
              className,
            ].join(" ")}
            {...props}
          />

          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={[
              "absolute left-4 transition-all duration-200 pointer-events-none",
              "top-3.5 text-sm",
              "peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-medium",
              "peer-[&:not(:placeholder-shown)]:top-1.5",
              "peer-[&:not(:placeholder-shown)]:text-[10px]",
              "peer-[&:not(:placeholder-shown)]:font-medium",
              error ? "text-red-400" : "text-gray-400 peer-focus:text-primary",
            ].join(" ")}>
            {label}
          </label>

          {/* Password reveal toggle */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeOff className="w-4 h-4 cursor-pointer" />
              ) : (
                <Eye className="w-4 h-4 cursor-pointer" />
              )}
            </button>
          )}
        </div>

        {error && <span className="block mt-1 ml-1 text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";
