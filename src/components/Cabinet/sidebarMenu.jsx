import React, { useState } from 'react';
import { RotateCcw, Radio, Users, Target, Trophy, Hourglass } from 'lucide-react';

export default function SidebarMenu() {
  const [activeItem, setActiveItem] = useState(0);

  const menuItems = [
    { icon: RotateCcw, label: 'History' },
    { icon: Radio, label: 'Signals' },
    { icon: Users, label: 'Community' },
    { icon: Target, label: 'Target' },
    { icon: Trophy, label: 'Leaderboard' },
    { icon: Hourglass, label: 'Pending' },
  ];

  return (
    <div className="w-full">
      {/* حالت برای صفحه‌های بزرگ (lg به بالا) */}
      <div className="hidden lg:flex flex-col items-center gap-2 py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveItem(index)}
            className={`
              w-10 h-16 flex flex-col items-center justify-center
              rounded-lg
              transition-all duration-200
              border-2
              ${activeItem === index 
                ? 'bg-slate-700/50 border-blue-500 text-blue-400' 
                : 'bg-[#2a3146] border-transparent text-slate-400 hover:bg-slate-700/30 hover:border-slate-600'
              }
            `}
          >
            <item.icon 
              className="w-6 h-6 transition-colors duration-200"
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      {/* حالت برای صفحه‌های کوچک (زیر lg) */}
      <div className="lg:hidden flex flex-row flex-wrap items-center justify-between gap-1 p-2 w-full">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveItem(index)}
            className={`
              flex-1 min-w-[calc(15.333%-0.5rem)] 
              h-10 flex items-center justify-center
              rounded-lg
              transition-all duration-200
              border-2
              ${activeItem === index 
                ? 'bg-slate-700/50 border-blue-500 text-blue-400' 
                : 'bg-[#2a3146] border-transparent text-slate-400 hover:bg-slate-700/30 hover:border-slate-600'
              }
              flex-shrink-0
            `}
          >
            <item.icon 
              className="w-5 h-5 transition-colors duration-200"
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </div>
  );
}