import React, { useEffect } from 'react';
import { ChevronDown, ChartCandlestick, AreaChartIcon, Zap } from 'lucide-react';
import { getSocket } from '../../services/socket';
import { useAppStore } from '../../stores/useAppStore';
import BalanceModal from './balanceModal';
import AvatarModal from './avatarModal';
import TopupModal from './topupModal';
import AssetsModal from './assetsModal';

export default function TradingHeader() {
  const {wallets, activeWallet, tradeSettings, setTradeSettings} = useAppStore();
  const symbol = tradeSettings.lastAsset;

  const [balanceModal, setBalanceModal] = React.useState(false);
  const [avatarModal, setAvatarModal] = React.useState(false);
  const [topupModal, setTopupModal] = React.useState(false);
  const [assetsModal, setAssetsModal] = React.useState(false);
  const [timeframeModal, setTimeframeModal] = React.useState(false);

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  const handleChangeType = (chartType) => {
    const socket = getSocket();
    console.log('socket',socket)

    socket.emit('unsubscribe', { symbol, chartType: tradeSettings.chartType });
    setTradeSettings({chartType});
    // socket.emit('subscribe', { symbol, chartType });

  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeframeModal && !event.target.closest('.relative')) {
        setTimeframeModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [timeframeModal]);

  return (
    <div className="relative flex items-center justify-between px-4 py-3">
      {/* Left: Avatar + Level */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div onClick={() => setAvatarModal(!avatarModal)} className="relative" style={{ '--user-avatar-size': '40px' }}>
          <div className="user-avatar rounded-full overflow-hidden border-2 border-[#32ac41] shadow-lg">
            <img 
              src="/img/no_avatar.png" 
              alt="User" 
              className="w-10 h-10 object-cover"
            />
          </div>

          {/* Level Badge (SVG Star) */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
              <g clipPath="url(#clip0)">
                <path d="M4.82139 23.8988L0.685152 19.8821C0.902685 20.0931 1.17616 20.2701 1.50246 20.3911L5.6387 24.4079C5.3124 24.2868 5.04204 24.1099 4.82139 23.8988Z" fill="black"/>
                <path d="M1.49928 20.3941L5.63553 24.4109C5.30923 24.2898 5.03886 24.1129 4.81822 23.9018L0.68198 19.8851C0.899514 20.0961 1.17298 20.2731 1.49928 20.3941Z" fill="#1A5922"/>
                <path d="M20.9189 0.646409L25.0551 4.66317C25.3286 4.92702 25.5399 5.27158 25.6642 5.69685L21.528 1.68009C21.4068 1.25482 21.1923 0.910261 20.9189 0.646409Z" fill="black"/>
                <path d="M20.9189 0.646409L25.0551 4.66317C25.3286 4.92702 25.5399 5.27158 25.6642 5.69685L21.528 1.68009C21.4068 1.25482 21.1923 0.910261 20.9189 0.646409Z" fill="#1A5922"/>
                <path d="M11.3847 24.1006L15.5241 28.1173L5.6387 24.4079L1.49928 20.3941L11.3847 24.1006Z" fill="#1A5821"/>
                <path d="M21.528 1.68009L25.6642 5.69685L28.604 15.8963L24.4647 11.8795L21.528 1.68009Z" fill="#195621"/>
                <path d="M23.5635 24.1005L27.6997 28.1173L23.2527 38.3144L19.1133 34.2977L23.5635 24.1005Z" fill="#1A5A22"/>
                <path d="M19.073 39.3512L14.9367 35.3345C15.3811 35.7659 15.9809 35.9832 16.5993 35.9832C17.5937 35.9832 18.6286 35.4214 19.1165 34.3008L23.2527 38.3144C22.7648 39.4381 21.73 40 20.7355 40C20.1202 40 19.5173 39.7827 19.073 39.3512Z" fill="black"/>
                <path d="M19.1133 34.2977L23.2527 38.3144C22.7648 39.4381 21.7268 39.9967 20.7324 39.9967C20.1171 39.9967 19.5142 39.7794 19.0698 39.3479L14.9336 35.3311C15.378 35.7626 15.9777 35.9799 16.5961 35.9799C17.5906 35.9799 18.6254 35.4182 19.1133 34.2977Z" fill="#1A5922"/>
                <path d="M33.9957 20.3942L38.132 24.411L27.6997 28.1173L23.5635 24.1005L33.9957 20.3942Z" fill="#1B5C23"/>
                <path d="M35.1704 16.0981L39.3067 20.1149C40.5466 21.3193 40.0805 23.7157 38.132 24.411L33.9957 20.3942C35.9473 19.6989 36.4104 17.3025 35.1704 16.0981Z" fill="black"/>
                <path d="M35.1704 16.0981L39.3067 20.1149C40.5466 21.3193 40.0805 23.7157 38.132 24.411L33.9957 20.3942C35.9473 19.6989 36.4104 17.3025 35.1704 16.0981Z" fill="#1A5922"/>
                <path d="M19.2563 0C20.2507 0 21.2048 0.559494 21.528 1.68009L24.4647 11.8795L34.35 15.5859C36.5253 16.4023 36.2892 19.5778 33.9957 20.3942L23.5603 24.0975L19.1133 34.2915C18.6254 35.4152 17.5906 35.9739 16.5962 35.9739C15.6017 35.9739 14.6508 35.4121 14.3245 34.2915L11.3847 24.1006L1.50246 20.3911C-0.669771 19.5748 -0.43981 16.3992 1.85361 15.5859L12.289 11.8796L16.7391 1.68245C17.227 0.56185 18.265 0 19.2563 0Z" fill="#32AC41"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="40" height="40" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">
            Beginner
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Bonus Button */}
        {/* <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:brightness-110 transition">
          <img src="/bonus-welcome-icon.png" alt="Bonus" className="w-5 h-5" />
          <div className="text-left">
            <div>Get 100% bonus</div>
            <div className="text-[10px] opacity-90">On your first deposit</div>
          </div>
        </button> */}

        {/* Balance Block */}
        <button onClick={() => setBalanceModal(!balanceModal)} className="flex relative min-w-[130px] items-center gap-3 bg-[#111827]/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-[#2d3748] hover:bg-white/5 transition outline-none focus:outline-none">
          <div className="text-xs text-gray-400 -top-[7px] left-[22px] absolute z-10">QT {activeWallet.walletType}<span className="text-white ml-2">USD</span></div>
          <div className="text-left flex w-full justify-between">
              <div className="text-lg font-bold text-white">{activeWallet.balance.toLocaleString()}</div>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M15.9433 11.2266L12.5714 14.7891C12.4339 14.9297 12.2556 15 12.0748 15C11.8951 15 11.7152 14.9296 11.579 14.7888L8.20709 11.2263C7.765 10.776 8.07784 10 8.70447 10L15.4457 10C16.0706 10 16.3839 10.776 15.9433 11.2266Z" fill="currentColor"/>
              </svg>
          </div>
        </button>

        {/* Top Up Button */}
        <button onClick={() => setTopupModal(!topupModal)} className="
          relative overflow-hidden flex items-center gap-2.5 h-[42px] pl-3 pr-5 rounded-lg
          bg-[#074f40] border border-[#047838] text-white font-bold text-sm uppercase
          hover:bg-white/5 transition-all duration-300
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#06c93140] before:to-transparent
        ">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="#5aa86b">
            <path d="M17 4H16V3C16 2.20435 15.6839 1.44129 15.1213 0.87868C14.5587 0.316071 13.7956 0 13 0H3C2.20435 0 1.44129 0.316071 0.87868 0.87868C0.316071 1.44129 0 2.20435 0 3V15C0 15.7956 0.316071 16.5587 0.87868 17.1213C1.44129 17.6839 2.20435 18 3 18H17C17.7956 18 18.5587 17.6839 19.1213 17.1213C19.6839 16.5587 20 15.7956 20 15V7C20 6.20435 19.6839 5.44129 19.1213 4.87868C18.5587 4.31607 17.7956 4 17 4ZM3 2H13C13.2652 2 13.5196 2.10536 13.7071 2.29289C13.8946 2.48043 14 2.73478 14 3V4H3C2.73478 4 2.48043 3.89464 2.29289 3.70711C2.10536 3.51957 2 3.26522 2 3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2ZM18 12H17C16.7348 12 16.4804 11.8946 16.2929 11.7071C16.1054 11.5196 16 11.2652 16 11C16 10.7348 16.1054 10.4804 16.2929 10.2929C16.4804 10.1054 16.7348 10 17 10H18V12ZM18 8H17C16.2044 8 15.4413 8.31607 14.8787 8.87868C14.3161 9.44129 14 10.2044 14 11C14 11.7956 14.3161 12.5587 14.8787 13.1213C15.4413 13.6839 16.2044 14 17 14H18V15C18 15.2652 17.8946 15.5196 17.7071 15.7071C17.5196 15.8946 17.2652 16 17 16H3C2.73478 16 2.48043 15.8946 2.29289 15.7071C2.10536 15.5196 2 15.2652 2 15V5.83C2.32127 5.94302 2.65943 6.00051 3 6H17C17.2652 6 17.5196 6.10536 17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V8Z"/>
          </svg>
          <span>Top up</span>
        </button>

        {/* Modal balance */}
        {balanceModal && wallets.length ? <BalanceModal onClose={() => setBalanceModal(false)} />: null}
        {avatarModal && <AvatarModal onClose={() => setAvatarModal(false)} />}
        {topupModal && <TopupModal onClose={() => setTopupModal(false)} />}
        {assetsModal && <AssetsModal onClose={() => setAssetsModal(false)} />}
        {/* <div className="
            bg-[var(#262c41)]
            border border-[var(#343e52)]
            rounded-xl
            shadow-[0_5px_10px_rgba(0,0,0,0.1)]
            pointer-events-auto
            absolute
            select-none
        ">
            hi
        </div> */}
      </div>

      <div className='absolute top-28 z-20 p-1 flex flex-col items-start'>
        <div className='bg-[#293145] rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer'>
          <div className='flex' onClick={() => setAssetsModal(true)}>
            <span className='text-white text-sm font-medium'>{symbol}</span>
            <ChevronDown className='w-4 h-4 text-white' />
          </div>

          {/* نمایش تایم‌فریم فقط برای چارت کندل */}
          {tradeSettings.chartType === 'candle' && (
            <div className='relative'>
              <div 
                className='flex items-center gap-1 px-2 py-1 bg-[#1f2937] rounded hover:bg-[#374151] transition-colors'
                onClick={() => setTimeframeModal(!timeframeModal)}
              >
                <span className='text-white text-xs font-medium'>{tradeSettings.timeframe}</span>
                <ChevronDown className='w-3 h-3 text-white' />
              </div>
              
              {/* منوی dropdown تایم‌فریم */}
              {timeframeModal && (
                <div className='absolute top-full left-0 mt-1 bg-[#1f2937] rounded-md shadow-lg py-1 min-w-[60px] z-30'>
                  {timeframes.map((tf) => (
                    <div
                      key={tf}
                      className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-[#374151] transition-colors ${
                        tradeSettings.timeframe === tf ? 'text-blue-400 font-medium' : 'text-white'
                      }`}
                      onClick={() => {
                        setTradeSettings({ timeframe: tf });
                        setTimeframeModal(false);
                      }}
                    >
                      {tf}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* آیکون تغییر نوع چارت */}
          {tradeSettings.chartType === 'area' ? 
            <ChartCandlestick className='w-4 h-4 text-white ml-auto' onClick={() => handleChangeType('candle')}/>:
            <AreaChartIcon className='w-4 h-4 text-white ml-auto' onClick={() => handleChangeType('area')}/>
          }
        </div>
        
        <div className='text-gray-400 text-xs mt-1 flex items-center gap-1'>
          <Zap className='w-3 h-3 text-gray-400' />
          21:41:53 UTC+1
        </div>
      </div>

      {/* <div className='absolute top-28 z-20 p-1 flex flex-col items-start'>
        <div className='bg-[#293145] rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer'>
          <div className='flex' onClick={() => setAssetsModal(true)}>
            <span className='text-white text-sm font-medium'>{symbol}</span>
            
            <ChevronDown className='w-4 h-4 text-white' />
          </div>

          {tradeSettings.chartType === 'area' ? 
            <ChartCandlestick className='w-4 h-4 text-white ml-auto'  onClick={() => handleChangeType('candle')}/>:
            <AreaChartIcon className='w-4 h-4 text-white ml-auto'  onClick={() => handleChangeType('area')}/>
          }
          
        </div>
        <div className='text-gray-400 text-xs mt-1 flex items-center gap-1'>
            <Zap className='w-3 h-3 text-gray-400' />
            21:41:53 UTC+1
        </div>
      </div> */}
    </div>
  );
}