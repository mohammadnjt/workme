import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../stores/useAppStore";
import axios from "../../services/axiosInstance";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAppStore();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("/auth/register", form);
      console.log("REGISTER RESPONSE:", res.data);
      localStorage.setItem('secret', res.data.data.user.secret)

      setMessage({
        type: "success",
        text: "Registration successful! Redirecting...",
      });

      setTimeout(() => {
        setAuth({
          user: res.data.data.user,
          isAuthenticated: true,
          isLoading: false
        });
        navigate("/app", { replace: true });
      }, 800);
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        "Registration failed. Please check your details.";
      setMessage({ type: "error", text: apiMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    console.log("Google registration initiated");
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      if (!form.username || !form.email || !form.password) {
        setMessage({ type: "error", text: "Please fill all required fields" });
        return;
      }
    }
    setMessage({ type: "", text: "" });
    setCurrentStep(2);
  };

  const prevStep = () => {
    setMessage({ type: "", text: "" });
    setCurrentStep(1);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Card with enhanced animations */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/50 p-6 sm:p-8 md:p-10 transform transition-all duration-500 hover:shadow-emerald-500/10 hover:border-slate-600/50">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8 animate-fade-in">
            <div className="inline-block">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
                Join Us!
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full mt-2"></div>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Create an account to start your golden adventure 🚀
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                currentStep >= 1 
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30" 
                  : "bg-slate-800 text-slate-500"
              }`}>
                1
              </div>
              <span className={`text-sm font-medium hidden sm:inline transition-colors ${
                currentStep >= 1 ? "text-sky-400" : "text-slate-500"
              }`}>Account</span>
            </div>
            <div className={`w-12 h-0.5 transition-all duration-300 ${
              currentStep >= 2 ? "bg-gradient-to-r from-sky-500 to-emerald-500" : "bg-slate-700"
            }`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                currentStep >= 2 
                  ? "bg-gradient-to-r from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-500/30" 
                  : "bg-slate-800 text-slate-500"
              }`}>
                2
              </div>
              <span className={`text-sm font-medium hidden sm:inline transition-colors ${
                currentStep >= 2 ? "text-emerald-400" : "text-slate-500"
              }`}>Details</span>
            </div>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-slide-in">
                {/* Username */}
                <div className="relative group">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder=" "
                    className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-sky-400 peer-focus:bg-slate-900"
                  >
                    Username
                  </label>
                </div>

                {/* Email */}
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder=" "
                    className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-sky-400 peer-focus:bg-slate-900"
                  >
                    Email Address
                  </label>
                </div>

                {/* Password */}
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder=" "
                    className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 pr-12 text-slate-100 placeholder-transparent focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-sky-400 peer-focus:bg-slate-900"
                  >
                    Password
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

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full relative rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Continue
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-3 text-slate-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Register Button */}
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  className="w-full relative rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-sm font-medium text-slate-200 shadow-sm transition-all duration-300 hover:bg-slate-800 hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="group-hover:text-white transition-colors">Sign up with Google</span>
                </button>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-slide-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="relative group">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-slate-900"
                    >
                      First Name
                    </label>
                  </div>

                  {/* Last Name */}
                  <div className="relative group">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="lastName"
                      className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-slate-900"
                    >
                      Last Name
                    </label>
                  </div>
                </div>

                {/* Phone */}
                <div className="relative group">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder=" "
                    className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-slate-900"
                  >
                    Phone Number
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Country */}
                  <div className="relative group">
                    <input
                      id="country"
                      name="country"
                      type="text"
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.country}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="country"
                      className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-slate-900"
                    >
                      Country
                    </label>
                  </div>

                  {/* Date of Birth */}
                  <div className="relative group">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      placeholder=" "
                      className="peer w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-slate-100 placeholder-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label
                      htmlFor="dateOfBirth"
                      className="absolute left-4 -top-2.5 bg-slate-900 px-2 text-xs font-medium text-slate-400 transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-emerald-400 peer-focus:bg-slate-900"
                    >
                      Date of Birth
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 relative rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-slate-300 shadow-sm transition-all duration-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="flex-1 relative rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:from-slate-700 disabled:to-slate-800 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                    disabled={loading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-300 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
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