import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const AddExternalWalletModal = ({ isOpen, onClose, onAdd }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validate crypto address (basic validation)
  const validateAddress = (address) => {
    if (!address || !address.trim()) {
      return "Crypto address is required";
    }

    // Basic validation - crypto addresses are typically 26-35 characters
    if (address.length < 26 || address.length > 62) {
      return "Invalid crypto address format";
    }

    // Check for valid characters (alphanumeric)
    const validPattern = /^[a-zA-Z0-9]+$/;
    if (!validPattern.test(address)) {
      return "Address contains invalid characters";
    }

    return "";
  };

  const handleAddressChange = (e) => {
    const value = e.target.value.trim();
    setWalletAddress(value);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleContinue = async () => {
    const validationError = validateAddress(walletAddress);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call the onAdd function passed from parent
      await onAdd(walletAddress);

      // Reset form and close modal on success
      setWalletAddress("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add external wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setWalletAddress("");
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add external crypto wallet"
      size="md"
      closeOnOverlayClick={!isLoading}
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label
            htmlFor="crypto-address"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3"
          >
            Enter crypto address
            <Info size={16} className="text-gray-400" />
          </label>

          <input
            id="crypto-address"
            type="text"
            value={walletAddress}
            onChange={handleAddressChange}
            placeholder="Enter wallet address"
            disabled={isLoading}
            className={`
              w-full px-4 py-3 border rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${error ? "border-red-300 bg-red-50" : "border-gray-300"}
            `}
          />
        </div>

        {/* Helper Text */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            You can find it in your crypto platform under the 'Deposit' or
            'Receive' section
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleContinue}
            disabled={isLoading || !walletAddress.trim()}
            className="flex-1"
          >
            {isLoading ? "Adding..." : "Continue"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddExternalWalletModal;
