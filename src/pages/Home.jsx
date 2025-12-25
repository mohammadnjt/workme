import { useState } from "react";
import useTradeManager from "../hooks/useTradeManager";
import Sidebar1 from "../components/Cabinet/sidebar1";
import SiteHeader from "../components/Cabinet/header";
import SidebarMenu from "../components/Cabinet/sidebarMenu";
import TradingChart from "../components/TradingChart/TradingChart";
import Loading from '../components/global/Loading';
import Test from "../Test";
import TradingBlh from "../TradingBlh";
import { useAppStore } from "../stores/useAppStore";

export default function Home() {
  const { socket: s } = useAppStore();
  const [lastPoint, setLastPoint] = useState(null);

  const {
    trades,
    profitMarkers,
    addTrade,
    tradeStatus
  } = useTradeManager();

  return (
    <div
      className="
        w-screen h-screen 
        bg-cover bg-center 
        flex
      "
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(5,8,17,0.7) 0%, rgba(9,14,25,0.86) 60%, rgba(3,5,11,1) 100%), url('img/cabinetBg.png')"
      }}
    >
      <div className="w-full h-full grid 
        grid-cols-12 lg:grid-cols-[repeat(11,1fr)_0.5fr] 
        grid-rows-[0.15fr,1fr,1fr, 0.1fr] lg:grid-rows-[0.15fr,1fr,1fr] gap-0">

        {/* Header */}
        <div className="col-span-full row-start-1 row-end-2 lg:col-span-9 lg:row-start-1 lg:row-end-2 bg-[#1c202eb8]">
          {/* <div className="col-span-12 lg:col-span-9 bg-[#1c202eb8]"> */}
          <SiteHeader />
        </div>

        {/* Sidebar Icons */}
        <div className="col-span-full row-start-4 row-end-5
        lg:col-start-12 lg:col-end-13 lg:row-span-full bg-slate-900/95 blurred"
          // <div className="col-span-12 row-span-1 lg:col-span-1 lg:row-span-3 bg-slate-900/95 opacity-90"
          style={{
            gridColumn: "span 0.5 / span 0.5"
          }}
        >
          <SidebarMenu />
        </div>


        {/* Sidebar Trading */}
        <div className="lg:col-start-10 lg:col-end-12 lg:row-span-full absolute lg:relative max-lg:rounded-lg max-lg:top-24 max-lg:z-10 max-lg:right-16 bg-[#202434]">
          {/* <div className="lg:col-span-2 lg:row-span-3 absolute lg:relative bg-[#202434] opacity-90"> */}
          <Sidebar1
            lastPointHandler={{
              current: lastPoint,
              set: (e) => setLastPoint(e)
            }}
            tradeHandler={{
              set: (e) => addTrade(e)
            }}
          />
        </div>

        {/* Chart Area - spans 8 columns and 2 rows */}
        <div className="col-span-12 row-span-2 lg:row-span-3 lg:col-span-9">
          {/* <div className="col-span-12 row-span-3 lg:col-span-9 lg:row-span-2"> */}
          {/* <RealTimeChart /> */}
          {/* <PriceDisplay /> */}
          {/* // with animation */}
          {/* <Test />  */}
          {s.isConnected ?
            // <Test 
            //   lastPointHandler={{
            //     set: (e) => setLastPoint(e)
            //   }}
            //   tradeHandler={{
            //     trades,
            //     profitMarkers,
            //     tradeStatus
            //   }}
            // />:
            <TradingChart
              lastPointHandler={{
                set: (e) => setLastPoint(e)
              }}
              tradeHandler={{
                trades,
                profitMarkers,
                tradeStatus
              }}
            /> :
            // <TradingBlh 
            //   lastPointHandler={{
            //     set: (e) => setLastPoint(e),
            //     remove: () => setLastPoint(null)
            //   }}
            //   tradeHandler={{
            //     trades,
            //     profitMarkers,
            //     tradeStatus
            //   }}
            // />:
            <Loading fitScreen={false} />
          }
          {/* <TradingChart0 /> */}
          {/* <TradingChart /> */}
          {/* <TradingChart4 /> */}
        </div>
      </div>
    </div>
  );
}