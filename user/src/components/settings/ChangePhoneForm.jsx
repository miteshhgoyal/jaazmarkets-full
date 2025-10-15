// user/src/components/settings/ChangePhoneForm.jsx
import React, { useState } from "react";

const ChangePhoneForm = ({
  onCancel,
  currentPhone,
  verificationOptions,
  onSubmit,
  loading,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    verificationOptions.find((opt) => opt.available)?.id || "sms"
  );
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate phone number if SMS is selected
    if (
      selectedOption === "sms" &&
      (!phoneNumber || phoneNumber.trim() === "")
    ) {
      alert("Please enter a valid phone number");
      return;
    }

    onSubmit({
      method: selectedOption,
      phoneNumber: selectedOption === "sms" ? phoneNumber : null,
      enable: true,
    });
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Change 2-Step verification
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Security Type Options */}
        <div className="space-y-3">
          {verificationOptions.map((option) => (
            <div key={option.id}>
              <label
                className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                } ${
                  loading || !option.available
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="flex items-center flex-1">
                  <input
                    type="radio"
                    name="verification-method"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={loading || !option.available}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {option.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </div>
                {option.recommended && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded">
                    Recommended
                  </span>
                )}
                {!option.available && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                    Coming Soon
                  </span>
                )}
              </label>

              {/* Phone Number Input (only show if SMS is selected) */}
              {selectedOption === "sms" && option.id === "sms" && (
                <div className="mt-3 ml-7">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number (e.g., +1234567890)"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    disabled={loading}
                    required={selectedOption === "sms"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your phone number with country code
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-3">
          <button
            type="submit"
            disabled={
              loading ||
              !verificationOptions.find((opt) => opt.id === selectedOption)
                ?.available ||
              (selectedOption === "sms" && !phoneNumber.trim())
            }
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Verification Method"}
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

export default ChangePhoneForm;
