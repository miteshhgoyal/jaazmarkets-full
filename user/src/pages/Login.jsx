import React, { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, TrendingUp } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import google from "../assets/google.svg";
import MetaHead from "../components/MetaHead";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/trading/accounts";
  const successMessage = location.state?.message;

  const pageConfig = {
    title: "Welcome to JaazMarkets",
    submitButton: {
      loading: "Signing In...",
      default: "Continue",
    },
    footer: {
      text: "Don't have an account?",
      linkText: "Sign up",
      linkTo: "/register",
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
      // Use /auth/signin endpoint with email and password
      const response = await api.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;

        login({
          accessToken,
          refreshToken,
          user,
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Google login initiated");
      setErrors({
        submit:
          "Google login is not implemented yet. Please use email/password.",
      });
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Google login failed. Please try again.",
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
        description="Sign in to your Jaaz Markets trading account."
        keywords="login, sign in, trading account"
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageConfig.title}
          </h1>
        </div>

        <div className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldConfigs.map(renderFormField)}

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

          <p className="text-sm text-center text-gray-800 py-4">
            or sign in with
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-gray-200 text-sm py-2 px-4 rounded-md flex justify-center items-center gap-2 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={google} className="w-4" alt="Google" />
            <span>Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {pageConfig.footer.text}{" "}
              <Link
                to={pageConfig.footer.linkTo}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {pageConfig.footer.linkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
