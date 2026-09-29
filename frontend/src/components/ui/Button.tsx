import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  isLoading?: boolean;
}

export function Button({ children, variant = "primary", isLoading, className = "", disabled, ...props }: ButtonProps) {
  const baseStyles =
    "w-full cursor-pointer flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-gray-600 hover:text-primary hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
