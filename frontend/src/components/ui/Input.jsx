import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,
  helper,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">

      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <div className="relative">

        <input
          type={
            isPassword
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full
            rounded-xl
            border
            px-4
            py-3
            bg-slate-900
            text-white
            placeholder:text-slate-500
            transition
            duration-300
            outline-none

            ${
              error
                ? "border-red-500 focus:ring-red-500/30 focus:border-red-500"
                : success
                ? "border-green-500 focus:ring-green-500/30 focus:border-green-500"
                : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
            }

            focus:ring-2
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}

      </div>

      {helper && !error && !success && (
        <p className="text-xs text-slate-500">
          {helper}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="text-xs text-green-400">
          {success}
        </p>
      )}

    </div>
  );
}