import React from "react";

const Card = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-white border border-gray-200",
    outlined: "bg-white border-2 border-primary/20",
    ghost: "bg-white/50 border border-gray-100",
  };

  return (
    <div
      className={`rounded-xl transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div
    className={`px-6 py-4 border-t border-gray-100 bg-gray-50/30 rounded-b-xl ${className}`}
  >
    {children}
  </div>
);

export { Card, CardHeader, CardContent, CardFooter };
