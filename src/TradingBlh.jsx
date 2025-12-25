import React, {
  useEffect,
  useRef,
  useCallback,
  useState
} from "react";
import { createChart, AreaSeries, createSeriesMarkers, CandlestickSeries } from "lightweight-charts";
import axios from "./services/axiosInstance";
import { getSocket } from './services/socket';
import { fromAscii } from "./hooks/useHelper";
import { useAppStore } from './stores/useAppStore'; 
import TradesOverlay from "./components/TradingChart/TradesOverlay";

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
      style: 1, // LineStyle.Solid 
    },
  },
  rightPriceScale: {
    borderVisible: false,
    scaleMargins: {
      top: 0.25,
      bottom: 0.05,
    },
    entireTextOnly: true,
    // تنظیم تعداد خطوط قیمت
    // minimumNumberOfTicks: 40,
    // maxBarSpacing: 4,
  },
  timeScale: {
    borderVisible: true,
    rightOffset: 12,
    // rightOffset: rightOffsetBars,
    minBarSpacing: -10, // از این حد کاربر نمیتونه بیشتر کوچیک کنه چارت رو
    maxBarSpacing: 25, // از این حد کاربر نمیتونه بیشتر زوم کنه
    barSpacing: 2.5, // فاصله اولیه بین کندل ها
    // fixLeftEdge: true,
    lockVisibleTimeRangeOnResize: true,
    timeVisible: true,
    secondsVisible: true,
    shiftVisibleRangeOnNewBar: true,
    rightBarStaysOnScroll: true,

    // maxPointsInWindow: 100,//ماکزیمم مقدار

    // ticksVisible: true,
  },
  crosshair: {
    mode: 2,
    // mode: 0,
    vertLine: {
      color: "rgba(130, 160, 210, 0.4)",
      width: 2,
      style: 0,
      // labelVisible: true,
      // labelPadding: { 
      //   top: 5, 
      //   bottom: 5, 
      //   left: 50, 
      //   right: 5 
      // },
    },
    horzLine: {
      color: "rgba(130, 160, 210, 0.4)",
      width: 1,
      style: 3,
      // labelVisible: false,
    },
  },

  // yieldCurve: {
  //     baseResolution: 12,
  //     minimumTimeRange: 10,
  //     startTimeRange: 3,
  // },
}


const getPointValue = (point) =>
  point?.value ?? point?.close ?? point?.price ?? null;

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
  const preLoadingRef = useRef(false);
  const isLastPointVisibleRef = useRef(true);
  const [projectionPixel, setProjectionPixel] = useState({ x: null, y: null });

  const [chartApi, setChartApi] = useState(null);
  const [firstPointPixel, setFirstPointPixel] = useState(null);
  

  //   const animateValueUpdate = useCallback((point) => {
  //   if (!seriesRef.current) return;

  //   const targetTime = point.time;
  //   const targetValue = getPointValue(point);

  //   if (targetValue == null) return;

  //   // اگر نقطه اول است یا نقطه قبلی وجود ندارد
  //   if (!lastPointRef.current) {
  //     seriesRef.current.update(point);
  //     lastPointRef.current = point;
  //     return;
  //   }

  //   const previousTime = lastPointRef.current.time;
  //   const previousValue = getPointValue(lastPointRef.current);

  //   // بررسی کنید که زمان جدید از زمان قبلی قدیمی‌تر نباشد
  //   if (targetTime <= previousTime) {
  //     seriesRef.current.update(point);
  //     lastPointRef.current = point;
  //     return;
  //   }

  //   // لغو انیمیشن قبلی
  //   cancelAnimationFrame(animationFrameRef.current);

  //   const duration = 360;
  //   const start = performance.now();

  //   // شمارنده فریم‌ها - بدون استفاده از useRef
  //   let frameCount = 0;
  //   const maxFrames = 60; // حداکثر فریم

  //   const tick = (now) => {
  //     const progress = Math.min((now - start) / duration, 1);
  //     frameCount++;

  //     // انیمیشن زمان و مقدار
  //     const animatedTime = previousTime + (targetTime - previousTime) * progress;
  //     const animatedValue = previousValue + (targetValue - previousValue) * progress;

  //     // به‌روزرسانی با داده انیمیشن
  //     seriesRef.current.update({
  //       time: animatedTime,
  //       value: animatedValue,
  //     });

  //     if (progress < 1 && frameCount < maxFrames) {
  //       animationFrameRef.current = requestAnimationFrame(tick);
  //     } else {
  //       // پایان انیمیشن - جایگزینی با نقطه نهایی واقعی
  //       seriesRef.current.update(point);
  //       lastPointRef.current = point;

  //       // مدیریت داده‌ها - مستقیماً اینجا
  //       const currentData = seriesRef.current.data() || [];
  //       console.log('currentData',currentData)
  //       if (currentData.length > 500) {
  //         // فقط 400 داده آخر را نگه دار
  //         const dataToKeep = currentData.slice(-400);
  //         seriesRef.current.setData(dataToKeep);
  //       }
  //     }
  //   };

  //   animationFrameRef.current = requestAnimationFrame(tick);
  // }, []);

  // // مدیریت محدودیت داده‌ها
  // const manageDataLimit = useCallback(() => {
  //   if (!seriesRef.current) return;

  //   const currentData = seriesRef.current.data() || [];
  //   const maxDataPoints = 500;
  //   const removeThreshold = 50; // وقتی ۵۰ تا اضافه شد، ۱۰۰ تا حذف کن

  //   if (currentData.length > maxDataPoints + removeThreshold) {
  //     const dataToKeep = currentData.slice(-maxDataPoints);
  //     seriesRef.current.setData(dataToKeep);
  //   }
  // }, []);

  // // تابع جداگانه برای پاکسازی داده‌های انیمیشن
  // const cleanupAnimationData = useCallback((finalPoint) => {
  //   if (!seriesRef.current) return;

  //   const currentData = seriesRef.current.data() || [];

  //   if (currentData.length > 500) {
  //     // پیدا کردن اندیس نقطه نهایی
  //     const finalPointIndex = currentData.findIndex(item => 
  //       item.time === finalPoint.time && item.value === finalPoint.value
  //     );

  //     if (finalPointIndex !== -1) {
  //       // حذف داده‌های قدیمی‌تر (حفظ 400 داده اخیر + نقطه نهایی)
  //       const dataToKeep = currentData.slice(Math.max(0, finalPointIndex - 400), finalPointIndex + 1);

  //       // فقط اگر واقعاً نیاز به حذف باشد
  //       if (dataToKeep.length < currentData.length) {
  //         seriesRef.current.setData(dataToKeep);
  //       }
  //     }
  //   }
  // }, []);
  const animateValueUpdate = useCallback((point) => {
    if (!seriesRef.current) return;

    // اطمینان از اینکه time یک عدد است
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
    
    // تغییر مهم: animation را کوتاه‌تر کنید تا با دریافت داده هر 500ms همخوانی داشته باشد
    const duration = 400; // کاهش از 360 به 400ms
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

  // const animateValueUpdate = useCallback((point) => {
  //   if (!seriesRef.current) return;

  //   const targetTime = point.time;
  //   const targetValue = getPointValue(point);

  //   if (targetValue == null) return;

  //   // اگر نقطه اول است یا نقطه قبلی وجود ندارد
  //   if (!lastPointRef.current) {
  //     seriesRef.current.update(point);
  //     lastPointRef.current = point;
  //     return;
  //   }

  //   const previousTime = lastPointRef.current.time;
  //   const previousValue = getPointValue(lastPointRef.current);

  //   // setCrosshairToLastPoint(lastPointRef.current);

  //   // TODO: دیباگ گاهی که دیتا توی تایم قدیمی داره ست میکنه و به مشکل میخوره
  //   // بررسی کنید که زمان جدید از زمان قبلی قدیمی‌تر نباشد
  //   if (targetTime <= previousTime) {
  //     console.log(targetTime, 'if>>>', previousTime);
  //     // اگر زمان جدید قدیمی‌تر است، مستقیماً آپدیت کن
  //     seriesRef.current.update(point);
  //     lastPointRef.current = point;
  //     return;
  //   }


  //   cancelAnimationFrame(animationFrameRef.current);
  //   const duration = 360;
  //   const start = performance.now();

  //   const tick = (now) => {
  //     const progress = Math.min((now - start) / duration, 1);

  //     // انیمیشن زمان از چپ به راست
  //     const animatedTime = previousTime + (targetTime - previousTime) * progress;

  //     // انیمیشن مقدار (اختیاری - اگر می‌خواهید مقدار هم متحرک باشد)
  //     const animatedValue = previousValue + (targetValue - previousValue) * progress;

  //     setCrosshairToLastPoint({
  //       time: animatedTime,
  //       value: animatedValue,
  //     });

  //     seriesRef.current.update({
  //       time: animatedTime,
  //       value: animatedValue,
  //     });

  //     if (progress < 1) {
  //       animationFrameRef.current = requestAnimationFrame(tick);
  //     } else {
  //       // در پایان، نقطه نهایی را با دقت تنظیم کنید
  //       seriesRef.current.update(point);
  //       lastPointRef.current = point;
  //     }
  //   };

  //   animationFrameRef.current = requestAnimationFrame(tick);

  //   // console.log('seriesRef.current',seriesRef.current.data())
  //   if (seriesRef.current.data().length > 1000 && isLastPointVisibleRef.current === true) {
  //     const currentData = seriesRef.current.data().slice(10) || [];
  //     // console.log('currentData',currentData)
  //     seriesRef.current.setData(currentData)
  //   }
  // }, []);

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

      // tradeHandler.checkStatusTrade(parsedPoint);
    };


    socket.on('updateStream', handleRealtimeUpdate);
    socket.on('tradeStatus', (data) => tradeHandler.tradeStatus(data))

    // setPreLoading(false)
    /* if need scrool*/
    if (chartApi)
      chartApi.timeScale().scrollToRealTime();

    return () => {
      socket.off('updateStream', handleRealtimeUpdate);
      socket.off('tradeStatus');
    }
    // if (currentChartType === 'area') {
    //   const handleRealtimeUpdate = async (data) => {
    //     const parsedPoint = await fromAscii(data);
    //     console.log('parsedPoint', parsedPoint)
    //     if (!parsedPoint) return;
    //     if(currentChartType === 'area')
    //       animateValueUpdate(parsedPoint);
    //     else 
    //       candleUpdate(parsedPoint)
    //     lastPointHandler.set(parsedPoint);

    //     // tradeHandler.checkStatusTrade(parsedPoint);
    //   };


    //   socket.on('updateStream', handleRealtimeUpdate);
    //   socket.on('tradeStatus', (data) => tradeHandler.tradeStatus(data))

    //   return () => {
    //     socket.off('updateStream', handleRealtimeUpdate);
    //     socket.off('tradeStatus');
    //   }
    // }



  }, [chartApi, currentChartType, animateValueUpdate]);

  // تابع برای تنظیم کراسهیر روی آخرین نقطه
  const setCrosshairToLastPoint = useCallback((point) => {
    if (!chartRef.current || !seriesRef.current || !point) return;
    chartRef.current.setCrosshairPosition(
      point.value,
      point.time,
      seriesRef.current
    );
  }, []);


  // غیرفعال کردن حرکت کراسهیر با موس
  useEffect(() => {
    if (!chartApi) return;

    // غیرفعال کردن حرکت کراسهیر با موس
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

  // marker trading
  useEffect(() => {
    if (!seriesRef.current || !tradeHandler.trades || !chartApi) return

    // let seriesMarkers = createSeriesMarkers(seriesRef.current, tradeHandler.trades);

    // createUpDownMarkers(seriesRef.current, tradeHandler.trades);
    const allMarkers = [...tradeHandler.trades, ...tradeHandler.profitMarkers];
    chartApi.seriesMarkers.setMarkers(allMarkers);
    // seriesMarkers.setMarkers(tradeHandler.trades);
  }, [chartApi, tradeHandler.trades, tradeHandler.profitMarkers]);

  const initialSeries = useCallback(() => {
    const endpoint = currentChartType === 'candle' 
      ? `/symbols/candles/XAUUSD?timeframe=${timeframe}`
      : '/symbols/area/XAUUSD';
      
    axios.get(endpoint)
      .then((res) => {
        const history = res.data.data ?? [];
        
        // اطمینان از اینکه همه time ها عدد هستند
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
        
        // normalize parsed data
        const normalizedParsed = Array.isArray(parsedPoint) 
          ? parsedPoint.map(p => ({
              ...p,
              time: typeof p.time === 'object' ? p.time.valueOf() : p.time
            }))
          : [{
              ...parsedPoint,
              time: typeof parsedPoint.time === 'object' ? parsedPoint.time.valueOf() : parsedPoint.time
            }];
        
        // چک کردن خالی نبودن آرایه
        if (!normalizedParsed.length) {
          console.warn('⚠️ normalizedParsed is empty');
          waitForGetOldData.current = false;
          return;
        }
        
        const lastParsedTime = normalizedParsed[normalizedParsed.length - 1].time;
        const firstCurrentTime = currentData[0]?.time;
        
        // اضافه کردن لاگ برای دیباگ
        console.log('📊 lastParsedTime:', lastParsedTime, 'firstCurrentTime:', firstCurrentTime);
        
        if (currentData.length && normalizedParsed.length && firstCurrentTime > lastParsedTime) {
          const newData = [...normalizedParsed, ...currentData];
          seriesRef.current.setData(newData);
        }
        
        waitForGetOldData.current = false;
      });
    // socket.on('updateOldData', (data) => {
    //   const parsedPoint = fromAscii(data);
    //   if (!parsedPoint) return;

    //   const currentData = seriesRef.current.data() || [];
      
    //   // normalize parsed data
    //   const normalizedParsed = Array.isArray(parsedPoint) 
    //     ? parsedPoint.map(p => ({
    //         ...p,
    //         time: typeof p.time === 'object' ? p.time.valueOf() : p.time
    //       }))
    //     : [{
    //         ...parsedPoint,
    //         time: typeof parsedPoint.time === 'object' ? parsedPoint.time.valueOf() : parsedPoint.time
    //       }];
      
    //   const lastParsedTime = normalizedParsed[normalizedParsed.length - 1].time;
    //   const firstCurrentTime = currentData[0]?.time;
      
    //   if (currentData && normalizedParsed.length && firstCurrentTime > lastParsedTime) {
    //     const newData = [...normalizedParsed, ...currentData];
    //     seriesRef.current.setData(newData);
    //   }
    //   waitForGetOldData.current = false;
    // });
  }, [currentChartType, setCrosshairToLastPoint, socket]);


  useEffect(() => {
    if (!chartApi) return;

    const handleVisibleTimeRangeChange = () => {
      const timeRange = chartApi.timeScale().getVisibleLogicalRange();
      const visibleRange = chartApi.timeScale().getVisibleRange();


      // console.log('waitForGetOldData.current',waitForGetOldData.current)
      if (waitForGetOldData.current || !timeRange) return;

      const data = seriesRef.current.data();

      const isAtFirstData = timeRange.from <= 0;
      console.log('isAtFirstData',isAtFirstData)
      if(isAtFirstData) {
        // محاسبه اولین index قابل مشاهده
        const firstVisibleIndex = Math.max(0, Math.ceil(timeRange.from));
        
        // تبدیل logical coordinate به pixel
        const firstPointX = chartApi.timeScale().logicalToCoordinate(firstVisibleIndex);
        console.log('firstPointX',firstPointX)
        setFirstPointPixel(firstPointX);

        if(waitForGetOldData.current) return;
        socket.emit('requestOlderData', { symbol, chartType: currentChartType, firstTime: data[0]?.time });

        // getOldData()
        
      } else {

        setFirstPointPixel(0);
      }


      

      // فقط وقتی که واقعاً به اولین داده رسیده‌ایم و قبلاً preLoading نبوده
      // if (isAtFirstData && !preLoadingRef.current) {
      //   preLoadingRef.current = true;
      //   waitForGetOldData.current = true;

      //   const firstTime = seriesRef.current.data()[0]?.time;
      //   console.log('requestOlderData firstTime', firstTime);
      //   socket.emit('requestOlderData', { symbol, chartType: 'area', firstTime });
      //   // setPreLoading(preLoadingRef.current);
      //   // setPreLoading(true);
      //   // console.log('Reached first data! Requesting older data...');
      // }
      // // وقتی که از اولین داده دور شده‌ایم و قبلاً preLoading بوده
      // else if (!isAtFirstData && preLoadingRef.current) {
      //   preLoadingRef.current = false
      //   // setPreLoading(false);
      //   console.log('First data is no longer visible');
      // }

      // setPreLoading(preLoadingRef.current);

      if (lastPointRef.current) {
        const lastPointTime = lastPointRef.current.time;

        // بررسی کنید که آیا آخرین نقطه در محدوده visible است
        const isLastPointVisible =
          lastPointTime >= visibleRange.from &&
          lastPointTime <= visibleRange.to;

        // ذخیره در ref
        isLastPointVisibleRef.current = isLastPointVisible;

        // console.log('Last point visible:', isLastPointVisible);
      }
    };

    chartApi.timeScale().subscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);

    // Cleanup
    return () => {
      chartApi.timeScale().unsubscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);
    };
  }, [chartApi]); // حذف preLoading از dependencies

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
        // bottomColor: "rgba(255, 255, 255, 0)", // Changed to white transparent for better contrast on dark bg
        lineWidth: 1.5,
        priceLineColor: "rgba(54, 148, 255, 0.85)",
        priceLineWidth: 1,
        priceLineStyle: 3,
        priceLineVisible: true,
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        lastPriceAnimation: 1, // Continuous
        // pointMarkersVisible: true,
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

  const getCoordinateForIndex = useCallback((logicalIndex) => {
    const scale = chartApi.timeScale();
    if (!scale || logicalIndex == null || Number.isNaN(logicalIndex)) return null;
    return scale.logicalToCoordinate(logicalIndex);
  }, []);
  
  const getCoordinateForPrice = useCallback((price) => {
    const seriesInstance = seriesRef.current?._series;
    if (!seriesInstance || price == null || Number.isNaN(price)) return null;
    return seriesInstance.priceToCoordinate(price);
  }, []);
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Hatched overlay from first point to left edge */}
      {firstPointPixel !== null && firstPointPixel > 0 && (
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none z-10"
          style={{
            width: `${firstPointPixel}px`,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 16px)',
            backgroundColor: 'rgba(15, 23, 42, 0.3)', // slight dark overlay
          }}
        />
      )}

      <div
        ref={containerRef}
        className="flex-1 w-full"
        style={{ position: 'relative' }}
      />
      {/* <div
        ref={containerRef}
        className="flex-1 w-full"
        style={{ position: 'relative' }}
      >
        {currentChartType === 'candle' && chartApi && (
          <div>hi</div>
          // <TradesOverlay
          //   trades={tradeHandler.trades || []}
          //   getCoordinateForIndex={getCoordinateForIndex}
          //   getCoordinateForPrice={getCoordinateForPrice}
          //   seriesRef={seriesRef}
          // />
        )}
      </div> */}

      {/* {tradeHandler.trades && tradeHandler.trades.length ? tradeHandler.trades.map((trade) => {
        console.log('trade.status',trade);
        const scale = chartApi.timeScale();
        const targetX = scale.logicalToCoordinate(seriesRef.current.data().length-1);
        const entryX = scale.timeToCoordinate(trade.time);
        // const entryY = scale.getCoordinateForPrice(trade.targetValue);
        console.log('targetX',targetX)
        console.log('entryX',entryX)
        // console.log('entryY',entryY)
        console.log('Math',Math.abs(targetX - entryX))
        // trade.status === "pending" &&
        targetX != null &&
        Math.abs(targetX - entryX) > 2 && (
          <div
                style={{
                  position: "absolute",
                  left: `${Math.min(entryX, targetX)}px`,
                  // top: `${entryY}px`,
                  width: `${Math.abs(targetX - entryX)}px`,
                  height: "2px",
                  // backgroundColor: accent,
                  // boxShadow: `0 0 8px ${accent}`,
                }}
              />
        )
      }) : null}

      {projectionPixel.x != null && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            bottom: "12px",
            left: `${projectionPixel.x}px`,
            width: "0px",
            borderLeft: "2px dashed rgba(255,193,7,0.85)",
            boxShadow: "0 0 12px rgba(255,193,7,0.4)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-24px",
              left: "-24px",
              background:
                "linear-gradient(135deg, rgba(28,32,45,0.92) 0%, rgba(53,62,87,0.92) 100%)",
              color: "#ffc107",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Target
          </span>
        </div>
      )} */}

      {/* Timeline با Phaser */}
      {/* <PhaserTimeline 
        visibleRange={visibleRange} 
        barSpacing={barSpacing}
        lastPointTime={lastPointRef.current?.time} 
      /> */}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
  // return (
  //   <div
  //     className="h-full flex"
  //   >
  //     {/* DONE: باز کردن لودینگ */}
  //     {preLoading ? (
  //       <div className="w-[200px] h-100 relative rounded-md overflow-hidden bg-slate-800/50">
  //         {/* لایه هاشور */}
  //         <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.04)_8px,rgba(255,255,255,0.04)_16px)]"></div>

  //         {/* لایه shimmer متحرک */}
  //         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
  //       </div>
  //     ) : null}

  //     <div
  //       style={{
  //         flex: 1,
  //         height: "100%",
  //         position: "relative",
  //         borderRadius: "18px",
  //         overflow: "hidden",
  //         border: "1px solid rgba(45, 60, 92, 0.45)",
  //         boxShadow: "0 24px 48px rgba(3, 8, 18, 0.55)",
  //       }}
  //     >
  //       {/* <div
  //         style={{
  //           height: "100%",
  //           position: "absolute",
  //           inset: 0,
  //           pointerEvents: "none",
  //           backgroundImage:
  //             "repeating-linear-gradient(to right, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 60px)",
  //         }}
  //       /> */}
  //       <div
  //         ref={containerRef}
  //         className="h-full w-full"
  //         style={{ position: 'relative' }}
  //       />
  //     </div>
  //     <style>{`
  //     @keyframes shimmer {
  //       0% {
  //         background-position: -200% 0;
  //       }
  //       100% {
  //         background-position: 200% 0;
  //       }
  //     }
  //     `}</style>
  //   </div>
  // );
}