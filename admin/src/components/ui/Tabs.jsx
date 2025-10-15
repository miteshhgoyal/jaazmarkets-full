import React from "react";

const Tabs = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`border-b border-gray-200 bg-white ${className}`}>
      <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              {tab.icon && <tab.icon size={14} className="sm:w-4 sm:h-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1 sm:ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
