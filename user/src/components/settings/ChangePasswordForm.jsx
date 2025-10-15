// user/src/components/settings/ChangePasswordForm.jsx
import React, { useState } from "react";

const ChangePasswordForm = ({
  onCancel,
  onSubmit,
  onForgotPassword,
  loading,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const passwordValidation = {
    length: newPassword.length >= 8 && newPassword.length <= 15,
    uppercase: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isValid =
    currentPassword.length > 0 &&
    Object.values(passwordValidation).every(Boolean) &&
    newPassword === repeatPassword &&
    newPassword.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({
        currentPassword,
        newPassword,
        repeatPassword,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Current password
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter current password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* New Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter new password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="flex justify-end text-xs text-gray-500 mt-1">
            {newPassword.length}
          </div>

          {/* Password Requirements */}
          <ul className="mt-3 space-y-2 text-sm">
            <li
              className={`flex items-center ${
                passwordValidation.length ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidation.length ? "text-green-600" : "text-gray-400"
                }`}
              >
                {passwordValidation.length ? "✓" : "○"}
              </span>
              Between 8-15 characters
            </li>
            <li
              className={`flex items-center ${
                passwordValidation.uppercase
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidation.uppercase
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {passwordValidation.uppercase ? "✓" : "○"}
              </span>
              At least one upper and one lower case letter
            </li>
            <li
              className={`flex items-center ${
                passwordValidation.number ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidation.number ? "text-green-600" : "text-gray-400"
                }`}
              >
                {passwordValidation.number ? "✓" : "○"}
              </span>
              At least one number
            </li>
            <li
              className={`flex items-center ${
                passwordValidation.special ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`mr-2 ${
                  passwordValidation.special
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {passwordValidation.special ? "✓" : "○"}
              </span>
              At least one special character
            </li>
          </ul>
        </div>

        {/* Repeat Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repeat new password
          </label>
          <div className="relative">
            <input
              type={showRepeatPassword ? "text" : "password"}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Re-enter new password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showRepeatPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {repeatPassword && newPassword !== repeatPassword && (
            <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors text-sm"
          >
            {loading ? "Changing..." : "Confirm"}
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

export default ChangePasswordForm;
