import React, { useEffect, useRef, useState, useCallback } from 'react';

const zoomLevels = [
  { seconds: 15, label: '15 ثانیه', pixelsPerSecond: 40 },
  { seconds: 30, label: '30 ثانیه', pixelsPerSecond: 30 },
  { seconds: 60, label: '1 دقیقه', pixelsPerSecond: 20 },
  { seconds: 120, label: '2 دقیقه', pixelsPerSecond: 15 },
  { seconds: 300, label: '5 دقیقه', pixelsPerSecond: 10 },
  { seconds: 600, label: '10 دقیقه', pixelsPerSecond: 8 },
  { seconds: 1200, label: '20 دقیقه', pixelsPerSecond: 5 },
  { seconds: 1800, label: '30 دقیقه', pixelsPerSecond: 3 }
];

const PixiTimeline = () => {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const verticalLinesContainerRef = useRef(null);
  const centerLineRef = useRef(null);
  const markersRef = useRef([]);
  const pixelsPerSecondRef = useRef(zoomLevels[4].pixelsPerSecond);
  const currentZoomLevelRef = useRef(4);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const timelineOffsetOnDragStartRef = useRef(0);
  const manualOffsetRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const timeOffsetRef = useRef(10 * 3600 * 1000 + 30 * 60 * 1000);

  const [zoomLevel, setZoomLevel] = useState(4);
  const [zoomLabel, setZoomLabel] = useState('5 دقیقه');
  const [pixiReady, setPixiReady] = useState(false);

  // بارگذاری PixiJS
  useEffect(() => {
    if (window.PIXI) {
      setPixiReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.4/pixi.min.js';
    script.async = true;
    script.onload = () => {
      console.log('PixiJS loaded successfully');
      setPixiReady(true);
    };
    script.onerror = () => {
      console.error('Failed to load PixiJS');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const createMarker = useCallback((seconds, intervalSeconds, PIXI) => {
    const marker = new PIXI.Container();

    const line = new PIXI.Graphics();
    line.lineStyle(2, 0x0f3460, 1);
    line.moveTo(0, -20);
    line.lineTo(0, 0);
    marker.addChild(line);

    const hours = Math.floor(seconds / 3600) % 24;
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let timeLabel;
    if (intervalSeconds >= 60) {
      timeLabel = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    } else {
      timeLabel = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    const text = new PIXI.Text(timeLabel, {
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 0xe94560,
      fontWeight: 'bold'
    });
    text.anchor.set(0.5);
    text.y = 15;
    marker.addChild(text);

    marker.userData = { seconds, text, line };
    return marker;
  }, []);

  const getMarkerInterval = useCallback(() => {
    const zoomConfig = zoomLevels[currentZoomLevelRef.current];
    const totalSeconds = zoomConfig.seconds;

    if (totalSeconds <= 30) return 5;
    if (totalSeconds <= 120) return 15;
    if (totalSeconds <= 600) return 60;
    return 300;
  }, []);

  const populateTimeline = useCallback((PIXI, bottomY) => {
    if (!timelineContainerRef.current || !verticalLinesContainerRef.current) return;

    console.log('Populating timeline...');
    timelineContainerRef.current.removeChildren();
    verticalLinesContainerRef.current.removeChildren();
    markersRef.current = [];

    const intervalSeconds = getMarkerInterval();
    const zoomConfig = zoomLevels[currentZoomLevelRef.current];
    pixelsPerSecondRef.current = zoomConfig.pixelsPerSecond;

    // خط افقی اصلی
    const mainLine = new PIXI.Graphics();
    mainLine.lineStyle(4, 0x16213e, 1);
    mainLine.moveTo(-50000, bottomY);
    mainLine.lineTo(50000, bottomY);
    timelineContainerRef.current.addChild(mainLine);

    const startSeconds = Math.floor((timeOffsetRef.current / 1000) - 3600);
    const endSeconds = startSeconds + 7200;

    for (let sec = startSeconds; sec <= endSeconds; sec += intervalSeconds) {
      const normalizedSec = ((sec % 86400) + 86400) % 86400;
      const marker = createMarker(normalizedSec, intervalSeconds, PIXI);

      const xPos = sec * pixelsPerSecondRef.current;
      marker.x = xPos;
      marker.y = bottomY;

      timelineContainerRef.current.addChild(marker);
      markersRef.current.push({ marker, xPos });
    }

    console.log('Created', markersRef.current.length, 'markers');
  }, [createMarker, getMarkerInterval]);

  const drawCenterLine = useCallback((PIXI, centerX, bottomY) => {
    if (!centerLineRef.current) return;

    centerLineRef.current.clear();

    // سایه
    centerLineRef.current.beginFill(0x00d9ff, 0.15);
    centerLineRef.current.drawRect(centerX - 15, 130, 30, bottomY - 130);
    centerLineRef.current.endFill();

    // خط اصلی
    centerLineRef.current.lineStyle(4, 0xffffff, 1);
    centerLineRef.current.moveTo(centerX, 130);
    centerLineRef.current.lineTo(centerX, bottomY);

    // دایره بالا
    centerLineRef.current.beginFill(0xe94560);
    centerLineRef.current.drawCircle(centerX, 130, 8);
    centerLineRef.current.endFill();

    // دایره پایین
    centerLineRef.current.beginFill(0x00d9ff);
    centerLineRef.current.drawCircle(centerX, bottomY, 6);
    centerLineRef.current.endFill();

    console.log('Center line drawn');
  }, []);

  const updateVerticalLines = useCallback((PIXI, screenWidth, bottomY) => {
    if (!verticalLinesContainerRef.current || !timelineContainerRef.current) return;

    verticalLinesContainerRef.current.removeChildren();

    markersRef.current.forEach(({ marker }) => {
      const screenX = marker.x + timelineContainerRef.current.x;

      if (screenX > 0 && screenX < screenWidth) {
        const vLine = new PIXI.Graphics();
        vLine.lineStyle(1, 0x0f3460, 0.2);
        vLine.moveTo(screenX, 130);
        vLine.lineTo(screenX, bottomY - 20);
        verticalLinesContainerRef.current.addChild(vLine);
      }
    });
  }, []);

  const formatTime = useCallback((totalMs) => {
    const normalized = ((totalMs % (24 * 3600000)) + (24 * 3600000)) % (24 * 3600000);
    const hours = Math.floor(normalized / 3600000);
    const minutes = Math.floor((normalized % 3600000) / 60000);
    const seconds = Math.floor((normalized % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, []);

  // اینیشیال کردن چارت
  useEffect(() => {
    if (!pixiReady || !containerRef.current || !window.PIXI) return;

    const PIXI = window.PIXI;
    console.log('Initializing PixiJS application');

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    if (width === 0 || height === 0) {
      console.warn('Container dimensions are zero!');
      return;
    }

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x0a0e1a,
      antialias: true
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(app.view);
    appRef.current = app;

    const timelineContainer = new PIXI.Container();
    const verticalLinesContainer = new PIXI.Container();
    const centerLine = new PIXI.Graphics();

    app.stage.addChild(timelineContainer);
    app.stage.addChild(verticalLinesContainer);
    app.stage.addChild(centerLine);

    timelineContainerRef.current = timelineContainer;
    verticalLinesContainerRef.current = verticalLinesContainer;
    centerLineRef.current = centerLine;

    const timeText = new PIXI.Text('10:30:00', {
      fontFamily: 'Arial',
      fontSize: 42,
      fill: 0x00d9ff,
      fontWeight: 'bold'
    });
    timeText.anchor.set(0.5);
    timeText.x = app.screen.width / 2;
    timeText.y = 50;
    app.stage.addChild(timeText);

    const guideText = new PIXI.Text('تایم‌لاین در حال حرکت - بکشید برای مرور', {
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0x94a3b8
    });
    guideText.anchor.set(0.5);
    guideText.x = app.screen.width / 2;
    guideText.y = 100;
    app.stage.addChild(guideText);

    const bottomY = app.screen.height - 100;
    const centerX = app.screen.width / 2;

    // Mouse events
    app.view.addEventListener('mousedown', (e) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      timelineOffsetOnDragStartRef.current = manualOffsetRef.current;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartXRef.current;
        manualOffsetRef.current = timelineOffsetOnDragStartRef.current + deltaX;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;

        const startOffset = manualOffsetRef.current;
        const startTimeMs = Date.now();
        const duration = 500;

        const animate = () => {
          const elapsed = Date.now() - startTimeMs;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          manualOffsetRef.current = startOffset * (1 - easeProgress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            manualOffsetRef.current = 0;
          }
        };
        animate();
      }
    });

    // Animation loop
    app.ticker.add(() => {
      const elapsedMs = Date.now() - startTimeRef.current;
      const currentTotalMs = timeOffsetRef.current + elapsedMs;
      const currentSeconds = currentTotalMs / 1000;

      const displaySeconds = currentSeconds - (manualOffsetRef.current / pixelsPerSecondRef.current);
      const displayMs = displaySeconds * 1000;

      timeText.text = formatTime(displayMs);

      timelineContainer.x = centerX - (currentSeconds * pixelsPerSecondRef.current) + manualOffsetRef.current;

      updateVerticalLines(PIXI, app.screen.width, bottomY);

      const intervalSeconds = getMarkerInterval();
      markersRef.current.forEach(({ marker }, index) => {
        const screenX = marker.x + timelineContainer.x;

        if (screenX < -200) {
          const maxMarker = markersRef.current.reduce((max, m) =>
            m.marker.x > max.marker.x ? m : max
          );

          const newX = maxMarker.marker.x + (intervalSeconds * pixelsPerSecondRef.current);
          marker.x = newX;
          markersRef.current[index].xPos = newX;

          const newSeconds = Math.floor(newX / pixelsPerSecondRef.current);
          const normalizedSec = ((newSeconds % 86400) + 86400) % 86400;

          const hours = Math.floor(normalizedSec / 3600);
          const minutes = Math.floor((normalizedSec % 3600) / 60);
          const secs = normalizedSec % 60;

          if (intervalSeconds >= 60) {
            marker.userData.text.text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          } else {
            marker.userData.text.text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          }
        }

        if (screenX > app.screen.width + 200) {
          const minMarker = markersRef.current.reduce((min, m) =>
            m.marker.x < min.marker.x ? m : min
          );

          const newX = minMarker.marker.x - (intervalSeconds * pixelsPerSecondRef.current);
          marker.x = newX;
          markersRef.current[index].xPos = newX;

          const newSeconds = Math.floor(newX / pixelsPerSecondRef.current);
          const normalizedSec = ((newSeconds % 86400) + 86400) % 86400;

          const hours = Math.floor(normalizedSec / 3600);
          const minutes = Math.floor((normalizedSec % 3600) / 60);
          const secs = normalizedSec % 60;

          if (intervalSeconds >= 60) {
            marker.userData.text.text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          } else {
            marker.userData.text.text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          }
        }
      });
    });

    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      app.renderer.resize(newWidth, newHeight);
      timeText.x = newWidth / 2;
      guideText.x = newWidth / 2;
      drawCenterLine(PIXI, newWidth / 2, newHeight - 100);
      populateTimeline(PIXI, newHeight - 100);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    populateTimeline(PIXI, bottomY);
    drawCenterLine(PIXI, centerX, bottomY);

    console.log('PixiJS Timeline initialized successfully');

    return () => {
      console.log('Cleaning up PixiJS Timeline');
      resizeObserver.disconnect();
      app.destroy(true, { children: true });
      appRef.current = null;
      timelineContainerRef.current = null;
      verticalLinesContainerRef.current = null;
      centerLineRef.current = null;
      markersRef.current = [];
    };
  }, [pixiReady, populateTimeline, drawCenterLine, updateVerticalLines, formatTime, getMarkerInterval]);

  const handleZoomChange = (e) => {
    const level = parseInt(e.target.value);
    currentZoomLevelRef.current = level;
    setZoomLevel(level);
    setZoomLabel(zoomLevels[level].label);

    if (appRef.current && window.PIXI) {
      const bottomY = appRef.current.screen.height - 100;
      populateTimeline(window.PIXI, bottomY);
    }
  };

  const handleZoomButton = (level) => {
    currentZoomLevelRef.current = level;
    setZoomLevel(level);
    setZoomLabel(zoomLevels[level].label);

    if (appRef.current && window.PIXI) {
      const bottomY = appRef.current.screen.height - 100;
      populateTimeline(window.PIXI, bottomY);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0e1a]">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ position: 'relative' }}
      />

      {/* <div className="absolute top-5 left-5 bg-[#0b1428]/95 backdrop-blur-md p-5 rounded-xl shadow-2xl z-50">
        <div className="mb-4">
          <label className="block text-cyan-400 text-sm font-bold mb-2">
            سطح زوم (فاصله بین مارکرها)
          </label>
          <input
            type="range"
            min="0"
            max="7"
            value={zoomLevel}
            step="1"
            onChange={handleZoomChange}
            className="w-64 h-1.5 bg-[#0f3460] rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-rose-500 text-base font-bold mt-2">
            {zoomLabel}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {zoomLevels.map((level, index) => (
            <button
              key={index}
              onClick={() => handleZoomButton(index)}
              className="bg-[#0f3460] text-cyan-400 px-3 py-2 rounded-md text-xs transition-all duration-300 hover:bg-[#16213e]"
            >
              {level.label}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default PixiTimeline;