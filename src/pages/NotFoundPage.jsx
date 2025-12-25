import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-slate-600/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        ></div>
      ))}

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Content */}
        <div className="text-center space-y-8 animate-fade-in">
          {/* 404 Number with 3D effect */}
          <div className="relative">
            <div
              className="text-[12rem] sm:text-[16rem] md:text-[20rem] font-black leading-none select-none"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-amber-500/20 bg-clip-text text-transparent blur-2xl">
                404
              </span>
              <span className="relative bg-gradient-to-br from-rose-400 via-purple-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
                404
              </span>
            </div>
          </div>

          {/* Glitch Effect Text */}
          <div className="relative h-20 flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-glitch-1">
              Page Not Found
            </h1>
            <h1 className="absolute text-4xl sm:text-5xl md:text-6xl font-bold text-rose-500/70 animate-glitch-2">
              Page Not Found
            </h1>
            <h1 className="absolute text-4xl sm:text-5xl md:text-6xl font-bold text-purple-500/70 animate-glitch-3">
              Page Not Found
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Oops! It seems like you've ventured into uncharted territory. The page you're looking for has vanished into the digital void.
          </p>

          {/* Error Details Card */}
          <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4 text-left">
              <div className="flex-shrink-0 p-4 bg-rose-500/10 rounded-xl">
                <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Error Code: 404</h3>
                <p className="text-sm text-slate-400">Resource not found on this server</p>
              </div>
            </div>
          </div>

          {/* Auto redirect countdown */}
          <div className="flex items-center justify-center gap-3 text-slate-400 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <svg className="w-5 h-5 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
              Redirecting to home in{" "}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-lg text-white font-bold mx-1">
                {countdown}
              </span>
              seconds
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={handleGoHome}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Home
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={handleGoBack}
              className="group w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl font-semibold text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Suggested Links */}
          <div className="pt-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <p className="text-sm text-slate-500 mb-4">You might be looking for:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <QuickLink href="/" icon="home" label="Home" />
              <QuickLink href="/auth/login" icon="login" label="Login" />
              <QuickLink href="/auth/register" icon="user" label="Register" />
              <QuickLink href="/profile" icon="profile" label="Profile" />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 border border-slate-700/30 rounded-full animate-spin-very-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 border border-slate-700/30 rounded-full animate-spin-reverse"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.3;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glitch-1 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes glitch-2 {
          0%, 100% {
            transform: translate(0);
            opacity: 0.8;
          }
          25% {
            transform: translate(2px, -2px);
            opacity: 0.7;
          }
          50% {
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          75% {
            transform: translate(2px, 2px);
            opacity: 0.7;
          }
        }

        @keyframes glitch-3 {
          0%, 100% {
            transform: translate(0);
            opacity: 0.8;
          }
          33% {
            transform: translate(-2px, -2px);
            opacity: 0.7;
          }
          66% {
            transform: translate(2px, -2px);
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-very-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 4s infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 3s infinite;
        }

        .animate-glitch-3 {
          animation: glitch-3 3.5s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

function QuickLink({ href, icon, label }) {
  const getIcon = () => {
    switch (icon) {
      case "home":
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        );
      case "login":
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        );
      case "user":
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        );
      case "profile":
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        );
    }
  };

  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 hover:border-slate-600/50 rounded-lg text-sm text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {getIcon()}
      </svg>
      {label}
      <svg className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}