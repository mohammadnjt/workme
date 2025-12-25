import React, { useState } from 'react';
import useUserIP from '../../hooks/useUserIP';
import axios from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import { X, TrendingUp, DollarSign, User, ShoppingCart, Award, Trophy, MessageCircle, HelpCircle, Globe, Settings, Monitor, LogOut, Wallet } from 'lucide-react';

export default function AvatarModal({ onClose }) {
  let navigate = useNavigate();
  const {auth, clearAuth} = useAppStore();
  const [isClosing, setIsClosing] = useState(false);
  const { ip, country, getFlagEmoji } = useUserIP();
  

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const logout = async () => {
    try {
      const res = await axios.post("/auth/logout");
      console.log('logout res', res);
      localStorage.removeItem('secret')
      clearAuth();
      navigate("/auth/login", { replace: true });  
    } catch (error) {
      // reload page on error
      window.location.reload();
    }
  }

  if(!auth) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-[320px] bg-[#1e2332] z-50 overflow-y-auto transition-transform duration-300 ${isClosing ? '-translate-x-full' : 'translate-x-0'}`}
        style={{
          animation: isClosing ? 'slideLeft 0.3s ease-out forwards' : 'slideRight 0.3s ease-out forwards'
        }}
      >
        <style>{`
          @keyframes slideRight {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          @keyframes slideLeft {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-100%);
            }
          }
        `}</style>

        {/* Header */}
        <div className='relative p-5 pb-3'>
          <button 
            onClick={handleClose}
            className='absolute top-3 right-3 text-[#7d8da6] hover:text-white transition-colors'
          >
            <X className='w-5 h-5' />
          </button>

          {/* Profile Section */}
          <div className='flex items-start gap-3 mb-3'>
            <div className='relative'>
              <div className='w-16 h-16 rounded-full bg-[#2a3247] border-3 border-[#00a86b] flex items-center justify-center overflow-hidden'>
                <svg className='w-10 h-10 text-[#4a5568]' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
                </svg>
              </div>
              <div className='absolute -top-1 -right-1 bg-[#00a86b] text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center'>
                <span>★</span>
              </div>
            </div>
            <div className='flex-1 pt-1'>
              <div className='text-white text-sm font-medium mb-1'>{auth.user.firstName} {auth.user.lastName}</div>
              <div className='bg-[#00a86b] text-white text-xs px-2 py-0.5 rounded-full inline-block font-medium'>
                Beginner
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className='space-y-1.5 text-xs'>
            <div className='flex items-center gap-1.5 text-[#7d8da6]'>
              <span className='w-3 h-3 border border-[#7d8da6] rounded'></span>
              <span>id 114647988</span>
              <span className='ml-auto w-3 h-3 border border-[#7d8da6] rounded'></span>
            </div>
            <div className='flex items-center gap-1.5 text-[#7d8da6]'>
              <span className='w-3 h-3 border border-[#7d8da6] rounded'></span>
              <span className='truncate'>{auth.user.email}</span>
            </div>
            <div className='flex items-center gap-1.5 text-[#7d8da6]'>
              <Wallet className='w-3.5 h-3.5' />
              <span className='text-white'>$0</span>
            </div>
            {ip && <div className='flex items-center gap-1.5 text-[#7d8da6]'>
              <span className='w-3 h-3 border border-[#7d8da6] rounded'></span>
              <span className='truncate'>{ip}</span>
              
              <div className="relative group">
                <span className='ml-1 text-sm'>{getFlagEmoji()}</span>
                {country && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                bg-black text-white text-xs py-1 px-2 rounded 
                                opacity-0 group-hover:opacity-100 transition-opacity 
                                pointer-events-none whitespace-nowrap z-50 mb-1">
                    {country}
                  </div>
                )}
              </div>
            </div>}
          </div>

          {/* Deposit Button */}
          <button className='w-full mt-3 bg-transparent border border-[#00a86b] text-[#00a86b] py-2 rounded text-xs flex items-center justify-center gap-1.5 hover:bg-[#00a86b] hover:text-white transition-colors'>
            <Wallet className='w-3.5 h-3.5' />
            <span className='font-medium'>Deposit</span>
          </button>

          {/* Platform Icons */}
          <div className='flex gap-2 mt-3'>
            <div className='w-8 h-8 bg-[#2a3247] rounded flex items-center justify-center border border-[#3a4558]'>
              <svg className='w-4 h-4 text-[#009af9]' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/>
              </svg>
            </div>
            <div className='w-8 h-8 bg-[#2a3247] rounded flex items-center justify-center border border-[#3a4558]'>
              <div className='w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]'>
                P
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className='px-3 py-1'>
          <MenuItem icon={<TrendingUp className='w-4 h-4' />} label='Trading' />
          <MenuItem icon={<DollarSign className='w-4 h-4' />} label='Finance' />
          <MenuItem icon={<User className='w-4 h-4' />} label='Profile' />
          <MenuItem icon={<ShoppingCart className='w-4 h-4' />} label='Market' badge='📦' badgeColor='bg-[#009af9]' />
          <MenuItem icon={<Award className='w-4 h-4' />} label='Achievements' />
          <MenuItem icon={<Trophy className='w-4 h-4' />} label='Tournaments' />
          <MenuItem icon={<MessageCircle className='w-4 h-4' />} label='Chat' badge='6' badgeColor='bg-[#009af9]' />
          <MenuItem icon={<HelpCircle className='w-4 h-4' />} label='Help' badge='📦' badgeColor='bg-[#009af9]' />
          <MenuItem icon={<Globe className='w-4 h-4' />} label='English' hasChevron />
        </div>

        <div className='h-px bg-[#2a3247] mx-3 my-1'></div>

        {/* Bottom Menu */}
        <div className='px-3 py-1 pb-4'>
          <MenuItem icon={<Settings className='w-4 h-4' />} label='Settings' />
          <MenuItem icon={<Monitor className='w-4 h-4' />} label='Desktop version' />
          <MenuItem icon={<LogOut className='w-4 h-4' />} label='Logout' action={logout} />
          
          {/* AI Icon */}
          <div className='mt-3 ml-3'>
            <div className='w-6 h-6 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>AI</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuItem({ icon, label, badge, badgeColor, hasChevron, action }) {
  return (
    <div 
      onClick={action}
      className='select-none flex items-center gap-2.5 px-3 py-2 text-[#8b95ab] hover:bg-[#2a3247] rounded cursor-pointer transition-colors group text-sm'
    >
      <div className='group-hover:text-white transition-colors'>
        {icon}
      </div>
      <span className='flex-1 group-hover:text-white transition-colors truncate'>{label}</span>
      {badge && (
        <div className={`${badgeColor} text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center`}>
          {badge}
        </div>
      )}
      {hasChevron && (
        <span className='w-3 h-3 border border-[#7d8da6] rounded'></span>
      )}
    </div>
  );
}