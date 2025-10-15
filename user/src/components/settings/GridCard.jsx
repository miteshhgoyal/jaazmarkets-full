import React from "react";

const GridCard = ({ data, loading, isFormVisible }) => {
  if (isFormVisible) return null;

  const {
    title,
    value,
    description,
    icon: Icon,
    buttonText,
    buttonAction,
    buttonColor = "blue",
    secondaryButtonText,
    secondaryButtonAction,
  } = data;

  const buttonColorClasses = {
    blue: "text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700",
    red: "text-red-600 hover:text-red-700 border-red-600 hover:border-red-700",
  };

  return (
    <div className="bg-white border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
          )}
          {value && <p className="text-sm text-gray-600">{value}</p>}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Secondary Button (like "Forgot Password?") */}
          {secondaryButtonText && secondaryButtonAction && (
            <button
              onClick={secondaryButtonAction}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {secondaryButtonText}
            </button>
          )}

          {/* Primary Button */}
          {buttonText && buttonAction && (
            <button
              onClick={buttonAction}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonColorClasses[buttonColor]}`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GridCard;
