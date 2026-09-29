import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", id, ...props }, ref) => {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative w-full">
      {/* placeholder=" " (spasi) adalah kunci floating label — jangan dihapus */}
      <input
        ref={ref}
        id={inputId}
        placeholder=" "
        className={[
          "peer w-full px-4 pt-5 pb-2 bg-gray-50/50 border rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
          "text-gray-900 text-sm",
          error ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-primary",
          className,
        ].join(" ")}
        {...props}
      />

      {/* Floating Label — bergerak ke atas saat focus atau ada isi */}
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

      {error && <span className="block mt-1 ml-1 text-xs text-red-500">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";
