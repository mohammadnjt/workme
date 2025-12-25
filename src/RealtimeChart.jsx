import React, { useState, useEffect, useRef } from "react";
import {
  Chart,
  CandlestickSeries,
  AreaSeries,
  HistogramSeries,
  PriceScale,
  TimeScale,
  Pane,
} from "lightweight-charts-react-components";

export default function RealtimeChart() {
  const [candleData, setCandleData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [chartType, setChartType] = useState("candlestick"); // "candlestick" or "area"
  const chartRef = useRef(null);

  // تولید داده‌های اولیه
  useEffect(() => {
    const initialCandles = [];
    const initialArea = [];
    const initialVolumes = [];
    let currentTime = Math.floor(Date.now() / 1000) - 300;
    let currentPrice = 100;

    for (let i = 0; i < 50; i++) {
      const open = currentPrice;
      const change = (Math.random() - 0.5) * 4;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      const volume = Math.floor(Math.random() * 10000) + 5000;

      initialCandles.push({
        time: currentTime,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });

      initialArea.push({
        time: currentTime,
        value: parseFloat(close.toFixed(2)),
      });

      initialVolumes.push({
        time: currentTime,
        value: volume,
        color: close >= open ? "rgba(38, 166, 154, 0.5)" : "rgba(239, 83, 80, 0.5)",
      });

      currentPrice = close;
      currentTime += 5;
    }

    setCandleData(initialCandles);
    setAreaData(initialArea);
    setVolumeData(initialVolumes);
  }, []);

  // به‌روزرسانی بلادرنگ با انیمیشن
  useEffect(() => {
    if (!isRunning || candleData.length === 0) return;

    const interval = setInterval(() => {
      setCandleData((prev) => {
        const lastCandle = prev[prev.length - 1];
        const newTime = lastCandle.time + 5;
        const open = lastCandle.close;
        const change = (Math.random() - 0.5) * 4;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;

        const newCandle = {
          time: newTime,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
        };

        const updated = [...prev, newCandle];
        return updated.length > 100 ? updated.slice(1) : updated;
      });

      setAreaData((prev) => {
        const lastArea = prev[prev.length - 1];
        const lastCandle = candleData[candleData.length - 1];
        const newTime = lastArea.time + 5;
        const open = lastCandle.close;
        const change = (Math.random() - 0.5) * 4;
        const close = open + change;

        const newArea = {
          time: newTime,
          value: parseFloat(close.toFixed(2)),
        };

        const updated = [...prev, newArea];
        return updated.length > 100 ? updated.slice(1) : updated;
      });

      setVolumeData((prev) => {
        const lastVolume = prev[prev.length - 1];
        const newTime = lastVolume.time + 5;
        const volume = Math.floor(Math.random() * 10000) + 5000;
        
        const lastCandle = candleData[candleData.length - 1];
        const color = lastCandle.close >= lastCandle.open 
          ? "rgba(38, 166, 154, 0.5)" 
          : "rgba(239, 83, 80, 0.5)";

        const newVolume = {
          time: newTime,
          value: volume,
          color: color,
        };

        const updated = [...prev, newVolume];
        return updated.length > 100 ? updated.slice(1) : updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, candleData]);

  const chartOptions = {
    layout: {
      background: { color: "#1a2332" },
      textColor: "#8b9bb3",
    },
    grid: {
      vertLines: { color: "#2a3547" },
      horzLines: { color: "#2a3547" },
    },
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
    crosshair: {
      mode: 1,
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      rightOffset: 15,
      barSpacing: 8,
      fixLeftEdge: true,
      lockVisibleTimeRangeOnResize: true,
      timeVisible: true,
    },
  };

  const priceScaleOptions = {
    borderColor: "#2a3547",
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  };

  const timeScaleOptions = {
    borderColor: "#2a3547",
    timeVisible: true,
    secondsVisible: false,
    rightOffset: 15,
    barSpacing: 8,
    fixLeftEdge: true,
  };

  const candlestickOptions = {
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: false,
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
    priceScaleId: "right",
  };

  const areaOptions = {
    lineColor: "#2962FF",
    topColor: "rgba(41, 98, 255, 0.4)",
    bottomColor: "rgba(41, 98, 255, 0.0)",
    lineWidth: 2,
    priceScaleId: "right",
    crosshairMarkerVisible: true,
    crosshairMarkerRadius: 6,
    lastValueVisible: true,
    priceLineVisible: true,
  };

  if (candleData.length === 0) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1a2332',
        color: '#8b9bb3'
      }}>
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "#1a2332" }}>
      <Chart options={chartOptions} ref={chartRef}>
        <Pane stretchFactor={3}>
          {chartType === "candlestick" ? (
            <CandlestickSeries data={candleData} reactive={true} {...candlestickOptions} />
          ) : (
            <AreaSeries data={areaData} reactive={true} {...areaOptions} />
          )}
          <PriceScale id="right" options={priceScaleOptions} />
        </Pane>
        <Pane stretchFactor={1}>
          <HistogramSeries data={volumeData} reactive={true} priceScaleId="right" />
          <PriceScale id="right" options={priceScaleOptions} />
        </Pane>
        <TimeScale options={timeScaleOptions} />
      </Chart>

      {/* دکمه‌های کنترل */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        gap: "10px",
        zIndex: 1000,
      }}>
        {/* دکمه تغییر نوع چارت */}
        <button
          onClick={() => setChartType(chartType === "candlestick" ? "area" : "candlestick")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2962FF",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {chartType === "candlestick" ? "📈 Area" : "🕯️ Candle"}
        </button>

        {/* دکمه توقف/شروع */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: "12px 24px",
            backgroundColor: isRunning ? "#ef5350" : "#26a69a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {isRunning ? "⏸ توقف" : "▶ شروع"}
        </button>
      </div>

      {/* نمایش وضعیت */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 16px",
          backgroundColor: "rgba(26, 35, 50, 0.9)",
          color: isRunning ? "#26a69a" : "#ef5350",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "600",
          zIndex: 1000,
          border: `2px solid ${isRunning ? "#26a69a" : "#ef5350"}`,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "16px" }}>{isRunning ? "🟢" : "🔴"}</span>
        <span>{isRunning ? "Live" : "Paused"}</span>
      </div>

      {/* نمایش نوع چارت */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          padding: "8px 16px",
          backgroundColor: "rgba(26, 35, 50, 0.9)",
          color: "#8b9bb3",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "600",
          zIndex: 1000,
          border: "2px solid #2a3547",
        }}
      >
        نوع نمایش: {chartType === "candlestick" ? "کندل استیک" : "ناحیه‌ای"}
      </div>
    </div>
  );
}