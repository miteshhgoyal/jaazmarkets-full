import React from "react";
import Button from "./Button";

const PageHeader = ({
  title,
  subtitle,
  showButton = false,
  buttonText = "Button",
  buttonIcon: ButtonIcon,
  onButtonClick,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`bg-white border-b border-gray-200 rounded-xl ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Title and description */}
          <div className="min-w-0 flex-1 flex flex-col gap-1 sm:gap-2">
            {title && (
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
            )}
          </div>

          {(actions || showButton) && (
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Additional actions */}
              {actions && (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  {actions}
                </div>
              )}

              {/* Main button */}
              {showButton && (
                <Button
                  onClick={onButtonClick}
                  size="md"
                  className="flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
                >
                  {ButtonIcon && (
                    <ButtonIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                  <span className="text-sm sm:text-base">{buttonText}</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
