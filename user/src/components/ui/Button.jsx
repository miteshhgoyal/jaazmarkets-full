import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500/50 border border-gray-200",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary/50 bg-white",
    ghost:
      "text-gray-600 hover:bg-gray-100 focus:ring-gray-500/50 hover:text-gray-800",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500/50 shadow-sm",
    warning:
      "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500/50 shadow-sm",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-sm",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
