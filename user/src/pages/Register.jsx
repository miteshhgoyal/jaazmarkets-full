import React, { useEffect, useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import google from "../assets/google.svg";
import MetaHead from "../components/MetaHead";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const pageConfig = {
    title: "Create Account",
    subtitle: "Join Jaaz Markets today",
    submitButton: { loading: "Creating Account...", default: "Continue" },
    footer: {
      text: "Already have an account?",
      linkText: "Sign in",
      linkTo: "/login",
    },
  };

  const fieldConfigs = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      icon: User,
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      icon: User,
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      icon: Mail,
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "Enter your mobile number",
      icon: Phone,
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a password",
      icon: Lock,
      required: true,
      hasToggle: true,
    },
  ];

  const initialFormData = fieldConfigs.reduce(
    (acc, f) => ({ ...acc, [f.name]: "" }),
    {}
  );
  const [formData, setFormData] = useState(initialFormData);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const togglePasswordVisibility = (field) =>
    setPasswordVisibility((p) => ({ ...p, [field]: !p[field] }));

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const validateForm = () => {
    const newErr = {};
    fieldConfigs.forEach((f) => {
      const v = formData[f.name];
      if (f.required && !v.trim()) newErr[f.name] = `${f.label} is required`;
      if (f.type === "email" && v && !isValidEmail(v))
        newErr[f.name] = "Enter a valid email";
      if (f.name === "password" && v && v.length < 6)
        newErr[f.name] = "Password must be at least 6 characters";
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Use /auth/signup endpoint
      const res = await api.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      if (res.data.success) {
        // Redirect to login with success message
        navigate("/login", {
          state: {
            message: "Account created successfully! Please login to continue.",
          },
        });
      }
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    console.log("Google sign-in");
  };

  const renderField = (f) => {
    const Icon = f.icon;
    const isPw = f.type === "password";
    const showPw = passwordVisibility[f.name];

    return (
      <div key={f.name}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {f.label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            type={isPw && showPw ? "text" : f.type}
            name={f.name}
            value={formData[f.name]}
            onChange={handleInputChange}
            placeholder={f.placeholder}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            autoComplete={
              f.name === "email"
                ? "email"
                : f.name === "password"
                ? "new-password"
                : f.name
            }
          />
          {f.hasToggle && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(f.name)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPw ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {errors[f.name] && (
          <p className="mt-1 text-sm text-red-600">{errors[f.name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <MetaHead
        title="Create Account"
        description="Open your free Jaaz Markets trading account today."
        keywords="register, create account, trading signup"
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {pageConfig.title}
          </h1>
          <p className="text-gray-600 mt-2">{pageConfig.subtitle}</p>
        </div>

        <div className="bg-white rounded-md p-6 shadow-lg border border-gray-200">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldConfigs.map(renderField)}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isLoading
                ? pageConfig.submitButton.loading
                : pageConfig.submitButton.default}
            </button>
          </form>

          {/* <p className="text-sm text-center text-gray-800 py-4">
            or sign up with
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full bg-gray-200 text-sm py-2 px-4 rounded-md flex justify-center items-center gap-2 hover:bg-gray-300 disabled:opacity-50"
          >
            <img src={google} alt="Google" className="w-4" />
            Google
          </button> */}

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

export default Register;
