import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import MetaHead from "../components/MetaHead";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";
  const successMessage = location.state?.message; // Get success message from navigation state

  // Configuration objects
  const pageConfig = {
    title: "Welcome to JaazMarkets",
    submitButton: {
      loading: "Signing In...",
      default: "Continue",
    },
  };

  const fieldConfigs = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      icon: User,
      validation: "Email is required",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      icon: Lock,
      validation: "Password is required",
      required: true,
      hasToggle: true,
    },
  ];

  // Initialize form data from field configs
  const initialFormData = fieldConfigs.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    fieldConfigs.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = field.validation;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Send the request with the correct field names matching the backend
      const response = await api.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
      });

      // Handle the response structure
      if (response.data.data) {
        const { accessToken, refreshToken } = response.data.data;

        login({
          accessToken,
          refreshToken,
        });

        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (field) => {
    const Icon = field.icon;
    const isPassword = field.type === "password";
    const showPassword = passwordVisibility[field.name];

    return (
      <div key={field.name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={isPassword && showPassword ? "text" : field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={field.placeholder}
            autoComplete={field.name === "email" ? "email" : "current-password"}
          />
          {field.hasToggle && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.name)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {errors[field.name] && (
          <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <MetaHead
        title="Login"
        description="Sign in to your Jaaz Markets trading account. Access your portfolio, manage trades, deposits, and withdrawals securely."
        keywords="login, sign in, trading account, forex login, crypto trading login"
      />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageConfig.title}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldConfigs.map(renderFormField)}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/reset-password"
                className="text-sm text-blue-500 hover:text-blue-700 font-medium"
              >
                I forgot my password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? pageConfig.submitButton.loading
                : pageConfig.submitButton.default}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
