import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axiosInstance";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification Code, 3: New Password
  const [form, setForm] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("/auth/forgot-password", { email: form.email });
      
      setMessage({
        type: "success",
        text: "Verification code sent to your email!",
      });

      setTimeout(() => {
        setStep(2);
        setMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        "Failed to send verification code. Please try again.";
      setMessage({ type: "error", text: apiMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("/auth/verify-code", {
        email: form.email,
        code: form.verificationCode,
      });

      setMessage({
        type: "success",
        text: "Code verified! Now set your new password.",
      });

      setTimeout(() => {
        setStep(3);
        setMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      const apiMessage =
        error.response?.data?.message || "Invalid verification code.";
      setMessage({ type: "error", text: apiMessage });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters!" });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/auth/reset-password", {
        email: form.email,
        verificationCode: form.verificationCode,
        newPassword: form.newPassword,
      });

      setMessage({
        type: "success",
        text: "Password reset successful! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const apiMessage =
        error.response?.data?.message || "Failed to reset password.";
      setMessage({ type: "error", text: apiMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post("/auth/resend-code", { email: form.email });
      setMessage({
        type: "success",
        text: "Verification code resent!",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to resend code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/50 p-6 sm:p-8 md:p-10 transform transition-all duration-500 hover:shadow-purple-500/10 hover:border-slate-600/50">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="inline-block">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
                {step === 1 && "Forgot Password?"}
                {step === 2 && "Verify Code"}
                {step === 3 && "New Password"}
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mt-2"></div>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              {step === 1 && "No worries! We'll send you reset instructions"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create a strong and secure password"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8 gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
                  step >= s 
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30" 
                    : "bg-slate-800 text-slate-500"
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 transition-all duration-300 ${
                    step > s ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-700"
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm mb-6 transition-all duration-300 animate-slide-down ${
                message.type === "success"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-500/50 bg-rose-500/10 text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div onSubmit={handleEmailSubmit} className="space-y-5 animate-slide-in">
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder=" "
                  className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-slate-900"
                >
                  Email Address
                </label>
              </div>

              <button
                onClick={handleEmailSubmit}
                type="button"
                className="w-full relative rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:from-slate-700 disabled:to-slate-800 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <div onSubmit={handleVerificationSubmit} className="space-y-5 animate-slide-in">
              <div className="relative group">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  placeholder=" "
                  maxLength="6"
                  className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-center text-2xl tracking-widest font-bold text-slate-100 placeholder-transparent focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={form.verificationCode}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="verificationCode"
                  className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-slate-900"
                >
                  6-Digit Code
                </label>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">
                  Code sent to <span className="text-purple-400 font-medium">{form.email}</span>
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setMessage({ type: "", text: "" });
                  }}
                  className="flex-1 px-4 py-3.5 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-300 font-medium transition-all duration-300 hover:bg-slate-800 hover:text-white hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleVerificationSubmit}
                  className="flex-1 relative rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:from-slate-700 disabled:to-slate-800 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div onSubmit={handlePasswordSubmit} className="space-y-5 animate-slide-in">
              {/* New Password */}
              <div className="relative group">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 pr-12 text-slate-100 placeholder-transparent focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={form.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="newPassword"
                  className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-slate-900"
                >
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 pr-12 text-slate-100 placeholder-transparent focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:bg-slate-900"
                >
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-2 font-medium">Password must contain:</p>
                <ul className="space-y-1 text-xs text-slate-500">
                  <li className={`flex items-center gap-2 ${form.newPassword.length >= 8 ? "text-emerald-400" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(form.newPassword) ? "text-emerald-400" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    One uppercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${/[0-9]/.test(form.newPassword) ? "text-emerald-400" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    One number
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handlePasswordSubmit}
                className="w-full relative rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:from-slate-700 disabled:to-slate-800 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors duration-300 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}