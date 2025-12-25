import React, {
  useEffect,
  useRef,
  useCallback,
  useState
} from "react";
import { createChart, AreaSeries, createSeriesMarkers, CandlestickSeries } from "lightweight-charts";
import axios from "../../services/axiosInstance";
import { getSocket } from '../../services/socket';
import { fromAscii } from "../../hooks/useHelper";
import { useAppStore } from '../../stores/useAppStore'; 

const chartOptions = {
  layout: {
    background: { type: "solid", color: "transparent" },
    textColor: "#9aa3b5",
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
  },
  grid: {
    horzLines: { color: "rgba(180, 196, 130, 0.1)", count: 4, visible: true, },
    vertLines: {
      color: "rgba(255,255,255,0.05)",
      style: 1,
    },
  },
  rightPriceScale: {
    borderVisible: false,
    scaleMargins: {
      top: 0.25,
      bottom: 0.05,
    },
    entireTextOnly: true,
  },
  timeScale: {
    borderVisible: true,
    rightOffset: 12,
    minBarSpacing: -10,
    maxBarSpacing: 25,
    barSpacing: 2.5,
    lockVisibleTimeRangeOnResize: true,
    timeVisible: true,
    secondsVisible: true,
    shiftVisibleRangeOnNewBar: true,
    rightBarStaysOnScroll: true,
    
    // تابع فرمت کردن برچسب‌های زمانی
    tickMarkFormatter: (time, tickMarkType, locale) => {
      const date = new Date(time * 1000);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      // بر اساس سطح زوم، فرمت متفاوتی نمایش بده
      if (tickMarkType === 0) { // Year
        return date.getFullYear();
      } else if (tickMarkType === 1) { // Month
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      } else if (tickMarkType === 2) { // DayOfMonth
        return `${date.getDate()}/${date.getMonth() + 1}`;
      } else if (tickMarkType === 3) { // Time
        // نمایش ساعت:دقیقه:ثانیه
        return `${hours}:${minutes}:${seconds}`;
      } else if (tickMarkType === 4) { // TimeWithSeconds
        // نمایش دقیق‌تر برای زوم‌های بیشتر
        return `${hours}:${minutes}:${seconds}`;
      }
      
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  crosshair: {
    mode: 2,
    vertLine: {
      color: "rgba(130, 160, 210, 0.4)",
      width: 2,
      style: 0,
    },
    horzLine: {
      color: "rgba(130, 160, 210, 0.4)",
      width: 1,
      style: 3,
    },
  },
}
const getPointValue = (point) =>
  point?.value ?? point?.close ?? point?.price ?? null;

// کامپوننت TradesOverlay برای نمایش مارکرهای معامله به صورت absolute
const TradesOverlay = ({ trades, profitMarkers, chartApi, seriesRef }) => {
  const [positions, setPositions] = useState({ trades: [], profits: [] });
console.log('trades', trades);
console.log('profitMarkers', profitMarkers);

  // محاسبه موقعیت پیکسلی برای هر مارکر
  const calculatePositions = useCallback(() => {
    if (!chartApi || !seriesRef.current) return;

    const timeScale = chartApi.timeScale();
    const series = seriesRef.current;

    // محاسبه موقعیت trades
    const tradePositions = trades.map(trade => {
      const x = timeScale.timeToCoordinate(trade.time);
      const y = series.priceToCoordinate(trade.targetValue);
      
      return {
        ...trade,
        x,
        y,
        visible: x !== null && y !== null
      };
    });

    // TODO: محاسبه موقعیت profitMarkers
    const profitPositions = profitMarkers.map(marker => {
      const x = timeScale.timeToCoordinate(marker.time);
      // TODO: برای profit marker باید قیمت را از text استخراج کنیم یا از دیتای سری بگیریم
      const seriesData = series.data();
      const dataPoint = seriesData.find(d => d.time === marker.time) || 
                        seriesData.find(d => Math.abs(d.time - marker.time) < 1);
      const price = dataPoint ? (dataPoint.close ?? dataPoint.value) : null;
      const y = price ? series.priceToCoordinate(price) : null;
      
      return {
        ...marker,
        x,
        y,
        visible: x !== null && y !== null
      };
    });

    setPositions({ trades: tradePositions, profits: profitPositions });
  }, [trades, profitMarkers, chartApi, seriesRef]);

  // بروزرسانی موقعیت‌ها هنگام تغییر چارت
  useEffect(() => {
    if (!chartApi) return;

    calculatePositions();

    // TODO: subscribe به تغییرات timeScale
    const handleTimeRangeChange = () => calculatePositions();
    chartApi.timeScale().subscribeVisibleTimeRangeChange(handleTimeRangeChange);

    // TODO: subscribe به تغییرات crosshair برای بروزرسانی مداوم
    const handleCrosshairMove = () => calculatePositions();
    chartApi.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chartApi.timeScale().unsubscribeVisibleTimeRangeChange(handleTimeRangeChange);
      chartApi.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [chartApi, calculatePositions]);

  // بروزرسانی هنگام تغییر trades یا profitMarkers
  useEffect(() => {
    calculatePositions();
  }, [trades, profitMarkers, calculatePositions]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2000,
      }}
    >
      {/* رندر کردن مارکرهای معامله (Buy/Sell) */}
      {positions.trades.map((trade) => {
        if (!trade.visible || trade.x === null || trade.y === null) return null;

        const isBuy = trade.shape === 'arrowUp';
        const accent = isBuy ? "#2ecc9c" : "#ef5350";

        return (
          <React.Fragment key={trade.cid}>
            {/* TODO: نقطه ورود معامله */}
            <div
              style={{
                position: "absolute",
                left: `${trade.x}px`,
                top: `${trade.y}px`,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: `2px solid ${accent}`,
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 12px ${accent}`,
              }}
            />

            {/* TODO: لیبل معامله */}
            <div
              style={{
                position: "absolute",
                left: `${trade.x}px`,
                top: `${trade.y}px`,
                transform: "translate(-50%, calc(-100% - 18px))",
                background: isBuy
                  ? "linear-gradient(135deg, rgba(46,204,156,0.9) 0%, rgba(33,150,83,0.9) 100%)"
                  : "linear-gradient(135deg, rgba(239,83,80,0.9) 0%, rgba(214,48,49,0.9) 100%)",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                boxShadow: `0 10px 24px ${
                  isBuy ? "rgba(46,204,156,0.35)" : "rgba(239,83,80,0.35)"
                }`,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {isBuy ? "▲" : "▼"} ${trade.volume?.toFixed(0) || '10'}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  opacity: 0.9,
                }}
              >
                {trade.text || (isBuy ? 'Buy' : 'Sell')}
              </span>
            </div>
          </React.Fragment>
        );
      })}

      {/* TODO: رندر کردن مارکرهای نتیجه (Win/Loss) */}
      {positions.profits.map((marker) => {
        if (!marker.visible || marker.x === null || marker.y === null) return null;

        const isWin = marker.text?.includes('WIN') || marker.color === '#10B981';
        const accent = isWin ? "#10B981" : "#ef5350";

        // TODO: استخراج مقدار سود/ضرر از text
        const amountMatch = marker.text?.match(/\$[\d.]+/);
        const amount = amountMatch ? amountMatch[0] : '';

        return (
          <React.Fragment key={marker.cid}>
            {/* TODO: نقطه نتیجه */}
            <div
              style={{
                position: "absolute",
                left: `${marker.x}px`,
                top: `${marker.y}px`,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: accent,
                border: "2px solid #ffffff",
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 12px ${accent}`,
              }}
            />

            {/* TODO: لیبل نتیجه */}
            <div
              style={{
                position: "absolute",
                left: `${marker.x}px`,
                top: `${marker.y}px`,
                transform: "translate(-50%, calc(-100% - 24px))",
                background: isWin
                  ? "linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.95) 100%)"
                  : "linear-gradient(135deg, rgba(239,83,80,0.95) 0%, rgba(214,48,49,0.95) 100%)",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: isWin
                  ? "0 14px 28px rgba(16,185,129,0.35)"
                  : "0 14px 28px rgba(239,83,80,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                {isWin ? '+' : '-'}{amount}
              </span>
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  color: accent,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {isWin ? "✔" : "✖"}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function TradingChart({
  symbol = "XAUUSD",
  lastPointHandler,
  tradeHandler
}) {
  const socket = getSocket();
  const {tradeSettings} = useAppStore();
  const currentChartType = tradeSettings?.chartType || 'area';
  const timeframe = tradeSettings?.timeframe || '1m';
  

  const containerRef = useRef(null);
  const waitForGetOldData = useRef(false);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const lastPointRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isLastPointVisibleRef = useRef(true);
  const [projectionPixel, setProjectionPixel] = useState({ x: null, y: null });

  const [chartApi, setChartApi] = useState(null);
  const [firstPointPixel, setFirstPointPixel] = useState(null);
  
  const animateValueUpdate = useCallback((point) => {
    if (!seriesRef.current) return;

    const targetTime = typeof point.time === 'object' ? point.time.valueOf() : point.time;
    const targetValue = getPointValue(point);

    if (targetValue == null) return;

    if (!lastPointRef.current) {
      seriesRef.current.update({ ...point, time: targetTime });
      lastPointRef.current = { ...point, time: targetTime };
      return;
    }

    const previousTime = typeof lastPointRef.current.time === 'object' 
      ? lastPointRef.current.time.valueOf() 
      : lastPointRef.current.time;
    const previousValue = getPointValue(lastPointRef.current);

    if (targetTime <= previousTime) {
      seriesRef.current.update({ ...point, time: targetTime });
      lastPointRef.current = { ...point, time: targetTime };
      return;
    }
    
    cancelAnimationFrame(animationFrameRef.current);
    
    const duration = 400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);

      const animatedTime = previousTime + (targetTime - previousTime) * progress;
      const animatedValue = previousValue + (targetValue - previousValue) * progress;

      seriesRef.current.update({
        time: animatedTime,
        value: animatedValue,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        seriesRef.current.update({ ...point, time: targetTime });
        lastPointRef.current = { ...point, time: targetTime };
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    if (chartApi){
      const scale = chartApi.timeScale();

      setProjectionPixel({x: scale.logicalToCoordinate(seriesRef.current.data().length-1) + 50});
    }

    if (seriesRef.current.data().length > 10000 && isLastPointVisibleRef.current === true) {
      const currentData = seriesRef.current.data().slice(10) || [];
      seriesRef.current.setData(currentData);
    }
  }, [chartApi]);

  const candleUpdate = useCallback((point) => {
    if (!seriesRef.current) return;

    seriesRef.current.update(point);
    lastPointRef.current = point;

    if (chartApi) {
      const scale = chartApi.timeScale();
      setProjectionPixel({ x: scale.logicalToCoordinate(seriesRef.current.data().length - 1) + 50 });
    }

    if (seriesRef.current.data().length > 10000 && isLastPointVisibleRef.current === true) {
      const currentData = seriesRef.current.data().slice(10) || [];
      seriesRef.current.setData(currentData);
    }
  }, [chartApi])

  /* Update new Data */
  useEffect(() => {
    if (!currentChartType) return

    const handleRealtimeUpdate = async (data) => {
      const parsedPoint = await fromAscii(data);
      console.log('parsedPoint', parsedPoint)
      if (!parsedPoint) return;
      if(currentChartType === 'area')
        animateValueUpdate(parsedPoint);
      else 
        candleUpdate(parsedPoint)
      lastPointHandler.set(parsedPoint);
    };


    socket.on('updateStream', handleRealtimeUpdate);
    socket.on('tradeStatus', (data) => tradeHandler.tradeStatus(data))

    if (chartApi)
      chartApi.timeScale().scrollToRealTime();

    return () => {
      socket.off('updateStream', handleRealtimeUpdate);
      socket.off('tradeStatus');
    }
  }, [chartApi, currentChartType, animateValueUpdate]);

  const setCrosshairToLastPoint = useCallback((point) => {
    if (!chartRef.current || !seriesRef.current || !point) return;
    chartRef.current.setCrosshairPosition(
      point.value,
      point.time,
      seriesRef.current
    );
  }, []);


  useEffect(() => {
    if (!chartApi) return;

    const handleCrosshairMove = () => {
      if (lastPointRef.current) {
        setCrosshairToLastPoint(lastPointRef.current);
      }
    };

    chartApi.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chartApi.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [chartApi, setCrosshairToLastPoint]);

  // TODO: حذف useEffect قبلی برای marker trading چون از overlay استفاده می‌کنیم
  // marker trading - فقط برای حالت area از setMarkers استفاده می‌کنیم
  useEffect(() => {
    if (!seriesRef.current || !tradeHandler.trades || !chartApi) return
    
    // TODO: در حالت candle از overlay استفاده می‌کنیم، پس markers را خالی می‌کنیم
    if (currentChartType === 'candle') {
      chartApi.seriesMarkers.setMarkers([]);
      return;
    }

    console.log('Updating profitMarkers:', tradeHandler.profitMarkers);
    console.log('Updating trades:', tradeHandler.trades);

    const allMarkers = [...tradeHandler.trades, ...tradeHandler.profitMarkers];
    chartApi.seriesMarkers.setMarkers(allMarkers);
  }, [chartApi, tradeHandler.trades, tradeHandler.profitMarkers, currentChartType]);

  const initialSeries = useCallback(() => {
    const endpoint = currentChartType === 'candle' 
      ? `/symbols/candles/XAUUSD?timeframe=${timeframe}` 
      : '/symbols/area/XAUUSD';
      
    axios.get(endpoint)
      .then((res) => {
        const history = res.data.data ?? [];
        
        const normalizedHistory = history.map(point => ({
          ...point,
          time: typeof point.time === 'object' ? point.time.valueOf() : point.time
        }));
        
        seriesRef.current.setData(normalizedHistory);

        const lastPoint = normalizedHistory[normalizedHistory.length - 1] ?? null;
        lastPointRef.current = lastPoint;
        lastPointHandler.set(lastPoint);

        if (lastPointRef.current) {
          setCrosshairToLastPoint(lastPointRef.current);
        }
      })
      .catch((error) => console.log('error get history', error));

      socket.on('updateOldData', (data) => {
        const parsedPoint = fromAscii(data);
        if (!parsedPoint) return;

        const currentData = seriesRef.current.data() || [];
        
        const normalizedParsed = Array.isArray(parsedPoint) 
          ? parsedPoint.map(p => ({
              ...p,
              time: typeof p.time === 'object' ? p.time.valueOf() : p.time
            }))
          : [{
              ...parsedPoint,
              time: typeof parsedPoint.time === 'object' ? parsedPoint.time.valueOf() : parsedPoint.time
            }];
        
        if (!normalizedParsed.length) {
          console.warn('⚠️ normalizedParsed is empty');
          waitForGetOldData.current = false;
          return;
        }
        
        const lastParsedTime = normalizedParsed[normalizedParsed.length - 1].time;
        const firstCurrentTime = currentData[0]?.time;
        
        console.log('📊 lastParsedTime:', lastParsedTime, 'firstCurrentTime:', firstCurrentTime);
        
        if (currentData.length && normalizedParsed.length && firstCurrentTime > lastParsedTime) {
          const newData = [...normalizedParsed, ...currentData];
          seriesRef.current.setData(newData);
        }
        
        waitForGetOldData.current = false;
      });
  }, [currentChartType, timeframe, setCrosshairToLastPoint, socket]);


  useEffect(() => {
    if (!chartApi) return;

    const handleVisibleTimeRangeChange = () => {
      const timeRange = chartApi.timeScale().getVisibleLogicalRange();
      const visibleRange = chartApi.timeScale().getVisibleRange();

      if (waitForGetOldData.current || !timeRange) return;

      const data = seriesRef.current.data();

      const isAtFirstData = timeRange.from <= 0;
      console.log('isAtFirstData',isAtFirstData)
      if(isAtFirstData) {
        const firstVisibleIndex = Math.max(0, Math.ceil(timeRange.from));
        
        const firstPointX = chartApi.timeScale().logicalToCoordinate(firstVisibleIndex);
        console.log('firstPointX',firstPointX)
        setFirstPointPixel(firstPointX);

        if(waitForGetOldData.current) return;
        socket.emit('requestOlderData', { symbol, chartType: currentChartType, firstTime: data[0]?.time });
        
      } else {

        setFirstPointPixel(0);
      }

      if (lastPointRef.current) {
        const lastPointTime = lastPointRef.current.time;

        const isLastPointVisible =
          lastPointTime >= visibleRange.from &&
          lastPointTime <= visibleRange.to;

        isLastPointVisibleRef.current = isLastPointVisible;
      }
    };

    chartApi.timeScale().subscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);

    return () => {
      chartApi.timeScale().unsubscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);
    };
  }, [chartApi]);

  /* init chart*/
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    console.log("Container dimensions:", width, height);
    if (height === 0) {
      console.warn("Container height is 0 - ensure parent element has explicit height!");
    }

    chartOptions.timeScale.barSpacing = currentChartType === 'candle' ? 20 : 2.5;


    const chart = createChart(containerRef.current, {
      ...chartOptions,
      width: width,
      height: height,
    });

    let series;
    if (currentChartType === 'candle') {
      series = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceLineVisible: true,
        lastValueVisible: true,
      });
    } else {
      series = chart.addSeries(AreaSeries, {
        lineColor: "rgba(54, 148, 255, 1)",
        topColor: "rgba(54, 148, 255, 0.45)",
        bottomColor: "rgba(33, 54, 95, 0)",
        lineWidth: 1.5,
        priceLineColor: "rgba(54, 148, 255, 0.85)",
        priceLineWidth: 1,
        priceLineStyle: 3,
        priceLineVisible: true,
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        lastPriceAnimation: 1,
      });
    }

    chartRef.current = chart;
    chart['seriesMarkers'] = createSeriesMarkers(series, [])

    setChartApi(chart)

    socket.emit('subscribe', { symbol, chartType: currentChartType });

    seriesRef.current = series;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width, height } = entries[0].contentRect;
      console.log("Resizing to:", width, height);
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(containerRef.current);

    initialSeries();
    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      lastPointRef.current = null;
      cancelAnimationFrame(animationFrameRef.current);
      socket.emit('unsubscribe', { symbol, chartType: currentChartType });
      socket.off('updateOldData');
    };
  }, [currentChartType, initialSeries, socket, symbol]);
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Hatched overlay from first point to left edge */}
      {firstPointPixel !== null && firstPointPixel > 0 && (
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
          style={{
            width: `${firstPointPixel}px`,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 16px)',
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
          }}
        />
      )}

      <div
        ref={containerRef}
        className="flex-1 w-full"
        style={{ position: 'relative' }}
      >
        {/* TODO: اضافه کردن TradesOverlay فقط برای حالت candle */}
        {currentChartType === 'candle' && chartApi && (
          <TradesOverlay
            trades={tradeHandler.trades || []}
            profitMarkers={tradeHandler.profitMarkers || []}
            chartApi={chartApi}
            seriesRef={seriesRef}
          />
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}