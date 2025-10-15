import React, { useState } from "react";

const ChangeTerminalForm = ({
  onCancel,
  onSubmit,
  loading,
  terminalType,
  currentTerminal,
  availableTerminals,
}) => {
  const [selectedTerminal, setSelectedTerminal] = useState(
    currentTerminal || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTerminal) {
      onSubmit({
        terminalType,
        selectedTerminal,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {terminalType} Accounts
          </h3>
        </div>
        <div>
          <h4 className="text-base font-medium text-gray-900">
            Set trading terminal
          </h4>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Terminal Options */}
        <div className="space-y-3">
          {availableTerminals.map((terminal) => (
            <label
              key={terminal}
              className={`flex items-center p-3 border rounded cursor-pointer transition-all ${
                selectedTerminal === terminal
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="terminal"
                value={terminal}
                checked={selectedTerminal === terminal}
                onChange={(e) => setSelectedTerminal(e.target.value)}
                disabled={loading}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {terminal}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={
              loading ||
              !selectedTerminal ||
              selectedTerminal === currentTerminal
            }
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Set terminal"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeTerminalForm;
