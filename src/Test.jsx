import React, { useEffect, useRef, useState } from 'react';

const PixiTimeline = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [zoomLabel, setZoomLabel] = useState('5 دقیقه');

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

  useEffect(() => {
    if (typeof window.PIXI === 'undefined') return;

    const PIXI = window.PIXI;
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x0a0e1a,
      antialias: true
    });

    canvasRef.current.appendChild(app.view);
    appRef.current = app;

    let currentZoomLevel = 4;
    let pixelsPerSecond = zoomLevels[currentZoomLevel].pixelsPerSecond;

    const startTime = Date.now();
    const startHour = 10;
    const startMinute = 30;
    const timeOffset = startHour * 3600 * 1000 + startMinute * 60 * 1000;

    let isDragging = false;
    let dragStartX = 0;
    let timelineOffsetOnDragStart = 0;
    let manualOffset = 0;

    const timelineContainer = new PIXI.Container();
    app.stage.addChild(timelineContainer);

    const centerLine = new PIXI.Graphics();
    app.stage.addChild(centerLine);

    const timeText = new PIXI.Text('10:30:00', {
      fontFamily: 'Segoe UI',
      fontSize: 42,
      fill: 0x00d9ff,
      fontWeight: 'bold',
      dropShadow: true,
      dropShadowColor: 0x00d9ff,
      dropShadowBlur: 10,
      dropShadowDistance: 0
    });
    timeText.anchor.set(0.5);
    timeText.x = app.screen.width / 2;
    timeText.y = 50;
    app.stage.addChild(timeText);

    const guideText = new PIXI.Text('تایم‌لاین در حال حرکت - بکشید برای مرور', {
      fontFamily: 'Segoe UI',
      fontSize: 16,
      fill: 0x94a3b8,
      fontStyle: 'italic'
    });
    guideText.anchor.set(0.5);
    guideText.x = app.screen.width / 2;
    guideText.y = 100;
    app.stage.addChild(guideText);

    const bottomY = app.screen.height - 150;
    const centerX = app.screen.width / 2;

    const markers = [];

    function createMarker(seconds, intervalSeconds) {
      const marker = new PIXI.Container();
      
      const line = new PIXI.Graphics();
      line.beginFill(0x16213e);
      line.drawRect(-2, -30, 4, 30);
      line.endFill();
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
        fontFamily: 'Segoe UI',
        fontSize: 13,
        fill: 0xe94560,
        fontWeight: 'bold'
      });
      text.anchor.set(0.5);
      text.y = 20;
      marker.addChild(text);

      marker.userData = { seconds, text, line };
      return marker;
    }

    function getMarkerInterval() {
      const zoomConfig = zoomLevels[currentZoomLevel];
      const totalSeconds = zoomConfig.seconds;
      
      if (totalSeconds <= 30) return 5;
      if (totalSeconds <= 120) return 15;
      if (totalSeconds <= 600) return 60;
      return 300;
    }

    function populateTimeline() {
      timelineContainer.removeChildren();
      markers.length = 0;

      const intervalSeconds = getMarkerInterval();
      const zoomConfig = zoomLevels[currentZoomLevel];
      pixelsPerSecond = zoomConfig.pixelsPerSecond;

      const mainLine = new PIXI.Graphics();
      mainLine.beginFill(0x16213e);
      mainLine.drawRect(-50000, bottomY - 3, 100000, 6);
      mainLine.endFill();
      timelineContainer.addChild(mainLine);

      const startSeconds = Math.floor((timeOffset / 1000) - 3600);
      const endSeconds = startSeconds + 7200;

      for (let sec = startSeconds; sec <= endSeconds; sec += intervalSeconds) {
        const normalizedSec = ((sec % 86400) + 86400) % 86400;
        const marker = createMarker(normalizedSec, intervalSeconds);
        
        const xPos = sec * pixelsPerSecond;
        marker.x = xPos;
        marker.y = bottomY;
        
        timelineContainer.addChild(marker);
        markers.push(marker);
      }
    }

    function drawCenterLine() {
      centerLine.clear();
      
      centerLine.beginFill(0x00d9ff, 0.15);
      centerLine.drawRect(centerX - 15, 120, 30, bottomY - 100);
      centerLine.endFill();
      
      centerLine.beginFill(0xffffff);
      centerLine.drawRect(centerX - 2, 120, 4, bottomY - 100);
      centerLine.endFill();
      
      centerLine.beginFill(0xe94560);
      centerLine.drawCircle(centerX, 125, 10);
      centerLine.endFill();
      
      centerLine.beginFill(0x00d9ff);
      centerLine.drawCircle(centerX, bottomY, 8);
      centerLine.endFill();
    }

    function formatTime(totalMs) {
      const normalized = ((totalMs % (24 * 3600000)) + (24 * 3600000)) % (24 * 3600000);
      const hours = Math.floor(normalized / 3600000);
      const minutes = Math.floor((normalized % 3600000) / 60000);
      const seconds = Math.floor((normalized % 60000) / 1000);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    app.view.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      timelineOffsetOnDragStart = manualOffset;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        manualOffset = timelineOffsetOnDragStart + deltaX;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        
        const startOffset = manualOffset;
        const startTimeMs = Date.now();
        const duration = 500;
        
        function animate() {
          const elapsed = Date.now() - startTimeMs;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          manualOffset = startOffset * (1 - easeProgress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            manualOffset = 0;
          }
        }
        animate();
      }
    });

    app.ticker.add(() => {
      const elapsedMs = Date.now() - startTime;
      const currentTotalMs = timeOffset + elapsedMs;
      const currentSeconds = currentTotalMs / 1000;

      const displaySeconds = currentSeconds - (manualOffset / pixelsPerSecond);
      const displayMs = displaySeconds * 1000;
      
      timeText.text = formatTime(displayMs);

      timelineContainer.x = centerX - (currentSeconds * pixelsPerSecond) + manualOffset;

      const intervalSeconds = getMarkerInterval();
      markers.forEach(marker => {
        const screenX = marker.x + timelineContainer.x;
        
        if (screenX < -200) {
          const maxMarker = markers.reduce((max, m) => 
            m.x > max.x ? m : max
          , markers[0]);
          
          marker.x = maxMarker.x + (intervalSeconds * pixelsPerSecond);
          
          const newSeconds = Math.floor(marker.x / pixelsPerSecond);
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
          const minMarker = markers.reduce((min, m) => 
            m.x < min.x ? m : min
          , markers[0]);
          
          marker.x = minMarker.x - (intervalSeconds * pixelsPerSecond);
          
          const newSeconds = Math.floor(marker.x / pixelsPerSecond);
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
      app.renderer.resize(window.innerWidth, window.innerHeight);
      timeText.x = app.screen.width / 2;
      guideText.x = app.screen.width / 2;
      drawCenterLine();
    };

    window.addEventListener('resize', handleResize);

    populateTimeline();
    drawCenterLine();

    // اتصال به state برای زوم
    window.updateTimelineZoom = (level) => {
      currentZoomLevel = level;
      populateTimeline();
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      app.destroy(true, true);
    };
  }, []);

  const handleZoomChange = (e) => {
    const level = parseInt(e.target.value);
    setZoomLevel(level);
    setZoomLabel(zoomLevels[level].label);
    if (window.updateTimelineZoom) {
      window.updateTimelineZoom(level);
    }
  };

  const handleZoomButton = (level) => {
    setZoomLevel(level);
    setZoomLabel(zoomLevels[level].label);
    if (window.updateTimelineZoom) {
      window.updateTimelineZoom(level);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0e1a] cursor-grab active:cursor-grabbing">
      {/* Canvas Container */}
      <div ref={canvasRef} className="w-full h-full" />
      
      {/* Controls Panel */}
      <div className="absolute top-5 left-5 bg-[#0b1428]/95 backdrop-blur-md p-5 rounded-xl shadow-2xl z-50">
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
            className="w-64 h-1.5 bg-[#0f3460] rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4.5
                     [&::-webkit-slider-thumb]:h-4.5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-cyan-400
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,217,255,0.5)]
                     [&::-moz-range-thumb]:w-4.5
                     [&::-moz-range-thumb]:h-4.5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-cyan-400
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="text-rose-500 text-base font-bold mt-2">
            {zoomLabel}
          </div>
        </div>
        
        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          {zoomLevels.map((level, index) => (
            <button
              key={index}
              onClick={() => handleZoomButton(index)}
              className="bg-[#0f3460] text-cyan-400 px-3 py-2 rounded-md text-xs
                       transition-all duration-300 hover:bg-[#16213e] hover:-translate-y-0.5
                       hover:shadow-[0_4px_12px_rgba(0,217,255,0.3)]"
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Drag Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-cyan-400/20 text-cyan-400 
                    px-5 py-2.5 rounded-lg text-sm pointer-events-none opacity-0
                    transition-opacity duration-300">
        در حال مرور تایم‌لاین - رها کنید تا بازگردد
      </div>
      
      {/* Load PixiJS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.4/pixi.min.js"></script>
    </div>
  );
};

export default PixiTimeline;