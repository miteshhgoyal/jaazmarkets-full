import React, { useEffect, useState, useCallback, useMemo } from "react";
import { User, Lock, Mail, Eye, EyeOff, Phone } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import MetaHead from "../components/MetaHead";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // States
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    referralCode: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);

  // Auto-fill referral code - OPTIMIZED with useMemo
  const referralCode = useMemo(() => searchParams.get("ref"), [searchParams]);

  useEffect(() => {
    if (referralCode && !formData.referralCode) {
      setFormData((prev) => ({ ...prev, referralCode }));
    }
  }, [referralCode]); // Only run when referralCode changes

  // Resend timer countdown - OPTIMIZED
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Back button prevention - OPTIMIZED
  useEffect(() => {
    if (step !== 2) return;

    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);

      if (
        window.confirm("Going back will cancel your registration. Continue?")
      ) {
        setStep(1);
        setOtp(["", "", "", "", "", ""]);
        setErrors({});
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  // OPTIMIZED: Use useCallback for handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const isValidEmail = useCallback(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    []
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isValidEmail]);

  // STEP 1: Submit Registration
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});

      try {
        const response = await api.post("/auth/signup", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          referralCode: formData.referralCode,
        });

        if (response.data.success) {
          setStep(2);
          setResendTimer(60);
          setOtp(["", "", "", "", "", ""]);
        } else {
          setErrors({
            submit: response.data.message || "Registration failed",
            redirectToLogin:
              response.data.userExists && response.data.isVerified,
          });
        }
      } catch (err) {
        console.error("Registration error:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        const shouldRedirect =
          err.response?.data?.userExists && err.response?.data?.isVerified;

        setErrors({
          submit: errorMessage,
          redirectToLogin: shouldRedirect,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm]
  );

  // OTP Handlers - OPTIMIZED
  const handleOtpChange = useCallback((index, value) => {
    if (!/^\d*$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    // Auto-focus next input
    if (value && index < 5) {
      setTimeout(() => {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }, 0);
    }

    setErrors((prev) => ({ ...prev, otp: "" }));
  }, []);

  const handleOtpKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        setTimeout(() => {
          document.getElementById(`otp-${index - 1}`)?.focus();
        }, 0);
      }
    },
    [otp]
  );

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);

    const lastIndex = Math.min(pasteData.length, 5);
    setTimeout(() => {
      document.getElementById(`otp-${lastIndex}`)?.focus();
    }, 0);
  }, []);

  // STEP 2: Verify OTP
  const handleVerifyOtp = useCallback(
    async (e) => {
      e.preventDefault();

      const otpValue = otp.join("");
      if (otpValue.length !== 6) {
        setErrors({ otp: "Please enter complete 6-digit code" });
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const response = await api.post("/auth/verify-email-otp", {
          email: formData.email,
          otp: otpValue,
          password: formData.password,
        });

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken, user } = response.data.data;
          login({ accessToken, refreshToken, user });
          navigate("/trading/accounts", { replace: true });
        } else {
          setErrors({ otp: response.data.message || "Verification failed" });
        }
      } catch (err) {
        console.error("OTP verification error:", err);
        const errorMsg =
          err.response?.data?.message ||
          "Invalid or expired code. Please try again.";
        const isExpired = err.response?.data?.expired;

        setErrors({ otp: errorMsg, expired: isExpired });

        if (isExpired) {
          setTimeout(() => handleResendOtp(), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [otp, formData.email, formData.password, login, navigate]
  );

  // Resend OTP
  const handleResendOtp = useCallback(async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post("/auth/resend-verification-otp", {
        email: formData.email,
      });

      if (response.data.success) {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          document.getElementById("otp-0")?.focus();
        }, 0);
      } else {
        setErrors({ otp: response.data.message || "Failed to resend code" });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setErrors({
        otp: err.response?.data?.message || "Failed to resend code",
      });
    } finally {
      setIsLoading(false);
    }
  }, [resendTimer, formData.email]);

  // OPTIMIZED: Memoize form fields
  const formFields = useMemo(
    () => [
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
      },
      {
        name: "referralCode",
        label: "Referral Code (Optional)",
        type: "text",
        placeholder: "Enter referral code if you have one",
        icon: User,
        required: false,
      },
    ],
    []
  );

  // OPTIMIZED: Render form field
  const renderFormField = useCallback(
    ({ name, label, type, placeholder, icon: Icon, required }) => {
      const isPw = name === "password";
      const showPw = isPw && passwordVisible;

      return (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            )}
            <input
              type={isPw && showPw ? "text" : type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              autoComplete={
                name === "email"
                  ? "email"
                  : name === "password"
                  ? "new-password"
                  : name
              }
            />
            {isPw && (
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
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
          {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
          )}
        </div>
      );
    },
    [formData, errors, passwordVisible, handleInputChange]
  );

  const renderRegistrationForm = useMemo(
    () => (
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map(renderFormField)}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>
      </form>
    ),
    [formFields, renderFormField, handleSubmit, isLoading]
  );

  const renderOtpForm = useMemo(
    () => (
      <div>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600">
            We've sent a 6-digit code to
            <br />
            <span className="font-medium text-gray-900">{formData.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter Verification Code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errors.otp}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              {resendTimer > 0 ? (
                <span className="text-gray-900 font-medium">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>

          <div className="text-center pt-2 border-t">
            <p className="text-xs text-gray-500">
              Need to change email?{" "}
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "This will cancel your current registration. Continue?"
                    )
                  ) {
                    setStep(1);
                    setOtp(["", "", "", "", "", ""]);
                    setErrors({});
                  }
                }}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Start over
              </button>
            </p>
          </div>
        </form>
      </div>
    ),
    [
      formData.email,
      otp,
      errors.otp,
      isLoading,
      resendTimer,
      handleVerifyOtp,
      handleOtpChange,
      handleOtpKeyDown,
      handleOtpPaste,
      handleResendOtp,
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <MetaHead
        title="Create Account - Jaaz Markets"
        description="Open your free Jaaz Markets trading account today."
        keywords="register, create account, trading signup"
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? "Create Account" : "Email Verification"}
          </h1>
          <p className="text-gray-600">
            {step === 1
              ? "Join Jaaz Markets today"
              : "Complete your registration"}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.submit}</p>
              {errors.redirectToLogin && (
                <Link
                  to="/login"
                  className="inline-block mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  Go to Login →
                </Link>
              )}
            </div>
          )}

          {step === 1 ? renderRegistrationForm : renderOtpForm}

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
