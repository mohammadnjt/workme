import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function TradingLoading({fitScreen = true}) {
  return (
    <div className={`${fitScreen ?'h-screen w-screen':'h-full w-full'} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden`}>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
        }
        
        @keyframes chart-draw {
          0% {
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes float-up {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(56, 189, 248, 0.4);
          }
          50% {
            box-shadow: 0 0 50px rgba(56, 189, 248, 0.6);
          }
        }
        
        @keyframes fade-bounce {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.2);
          }
        }
        
        .pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
        
        .float-up {
          animation: float-up 3s ease-in-out infinite;
        }
        
        .glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .fade-bounce {
          animation: fade-bounce 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full border-2 border-sky-500/20 pulse-ring"></div>
          <div className="absolute w-80 h-80 rounded-full border-2 border-sky-500/10 pulse-ring" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute w-96 h-96 rounded-full border border-sky-500/5 pulse-ring" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Central Icon with Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full"></div>
            
            <div className="relative w-28 h-28 bg-gradient-to-br from-sky-500 via-blue-500 to-sky-600 rounded-3xl flex items-center justify-center glow-pulse float-up shadow-2xl">
              <TrendingUp className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Animated Chart Lines */}
          <div className="relative w-72 h-32">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Sky up line */}
              <polyline
                points="10,70 30,50 50,55 70,35 90,40 110,20 130,25 150,15 170,10 190,5"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="300"
                style={{
                  animation: 'chart-draw 3s ease-in-out infinite'
                }}
              />
              {/* Blue down line */}
              <polyline
                points="10,30 30,45 50,40 70,60 90,55 110,75 130,70 150,85 170,80 190,90"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="300"
                opacity="0.6"
                style={{
                  animation: 'chart-draw 3s ease-in-out infinite',
                  animationDelay: '0.5s'
                }}
              />
              {/* Data points */}
              <circle cx="110" cy="20" r="4" fill="#38bdf8" className="fade-bounce" />
              <circle cx="110" cy="75" r="4" fill="#3b82f6" className="fade-bounce" style={{ animationDelay: '0.3s' }} />
            </svg>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-3 bg-gradient-to-r from-sky-400 via-blue-400 to-sky-500 bg-clip-text text-transparent">
              Loading Trading Platform
            </h2>
            
            {/* Animated dots */}
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2.5 h-2.5 bg-sky-500 rounded-full fade-bounce"></div>
              <div className="w-2.5 h-2.5 bg-sky-500 rounded-full fade-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-sky-500 rounded-full fade-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}