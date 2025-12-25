// import { useEffect, useRef, useState } from "react";

// const TimelineCounter = ({ currentTime, streaming = false }) => {
//     const canvasRef = useRef(null);
//     const animationFrameRef = useRef(null);
    
//     // مدیریت زمان داخلی برای حالت streaming
//     const baseTimeRef = useRef(currentTime);
//     const externalTimeRef = useRef(currentTime);
//     const streamingRef = useRef(streaming);
//     const lastFrameTimeRef = useRef(performance.now());
    
//     // مدیریت drag
//     const offsetRef = useRef(0);
//     const draggingRef = useRef(false);
//     const dragStartX = useRef(0);
    
//     console.log('TimelineCounter>>>', currentTime);

//     // به‌روزرسانی refs وقتی props تغییر می‌کند
//     useEffect(() => {
//         externalTimeRef.current = currentTime;
//         if (!streamingRef.current) {
//             baseTimeRef.current = currentTime;
//         }
//     }, [currentTime]);

//     useEffect(() => {
//         streamingRef.current = streaming;
//     }, [streaming]);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext('2d');
        
//         // تنظیم اندازه canvas بر اساس اندازه والد
//         const resizeCanvas = () => {
//             const parent = canvas.parentElement;
//             const dpr = window.devicePixelRatio || 1;
            
//             canvas.width = parent.clientWidth * dpr;
//             canvas.height = parent.clientHeight * dpr;
//             canvas.style.width = parent.clientWidth + 'px';
//             canvas.style.height = parent.clientHeight + 'px';
            
//             ctx.scale(dpr, dpr);
//         };
        
//         resizeCanvas();
//         window.addEventListener('resize', resizeCanvas);

//         // ==========================================
//         // 🎨 تنظیمات Drag Interactions
//         // ==========================================
//         const handlePointerDown = (e) => {
//             draggingRef.current = true;
//             dragStartX.current = e.clientX;
//         };

//         const handlePointerMove = (e) => {
//             if (!draggingRef.current) return;
//             const delta = e.clientX - dragStartX.current;
//             offsetRef.current = delta * 250;
//         };

//         const handlePointerUp = () => {
//             if (!draggingRef.current) return;
//             draggingRef.current = false;

//             // smooth reset
//             const start = offsetRef.current;
//             const duration = 500;
//             const startTime = performance.now();

//             const animate = (t) => {
//                 const p = Math.min((t - startTime) / duration, 1);
//                 const ease = 1 - Math.pow(1 - p, 3);

//                 offsetRef.current = start * (1 - ease);
//                 if (p < 1) requestAnimationFrame(animate);
//                 else offsetRef.current = 0;
//             };
//             requestAnimationFrame(animate);
//         };

//         canvas.addEventListener('pointerdown', handlePointerDown);
//         canvas.addEventListener('pointermove', handlePointerMove);
//         canvas.addEventListener('pointerup', handlePointerUp);
//         canvas.addEventListener('pointerleave', handlePointerUp);

//         // ==========================================
//         // 🔄 Render Loop
//         // ==========================================
//         const render = (now) => {
//             const w = canvas.width / (window.devicePixelRatio || 1);
//             const h = canvas.height / (window.devicePixelRatio || 1);
//             const centerX = w / 2;
//             const baselineY = h - 30;

//             // محاسبه deltaTime
//             const deltaMS = now - lastFrameTimeRef.current;
//             lastFrameTimeRef.current = now;

//             // ⏱️ مدیریت زمان: اگر streaming فعال باشد، زمان خودکار جلو می‌رود
//             if (streamingRef.current) {
//                 baseTimeRef.current += deltaMS;
//             } else {
//                 baseTimeRef.current = externalTimeRef.current;
//             }

//             const baseTime = baseTimeRef.current;
            
//             // ⏩ اضافه کردن ۵ ثانیه به زمان خط عمودی
//             const lineTimeOffset = 5000; // 5 seconds in milliseconds
//             const lineTime = baseTime + lineTimeOffset;
            
//             // drag offset
//             const dragOffset = offsetRef.current;
            
//             // زمان نهایی برای محاسبات مارکرها (بدون ۵ ثانیه اضافه)
//             const markerTime = baseTime + dragOffset;
//             const markerTimeInSeconds = Math.floor(markerTime / 1000);

//             // پاک کردن canvas
//             ctx.clearRect(0, 0, w, h);

//             const pixelsPerSec = 4;
//             const interval = 15;

//             // ==========================================
//             // 📏 رسم Baseline (خط افقی پایین)
//             // استایل: ضخامت، رنگ، شفافیت
//             // ==========================================
//             ctx.strokeStyle = 'rgba(22, 33, 62, 0.6)';
//             ctx.lineWidth = 3;
//             ctx.beginPath();
//             ctx.moveTo(0, baselineY);
//             ctx.lineTo(w, baselineY);
//             ctx.stroke();

//             // ==========================================
//             // 🎯 رسم Markers (نشانگرهای زمان)
//             // ==========================================
//             ctx.font = 'bold 11px Arial';
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'top';

//             for (let i = -30; i <= 30; i++) {
//                 const sec = Math.floor(markerTimeInSeconds / interval) * interval + i * interval;
//                 const x = centerX + (sec - markerTimeInSeconds) * pixelsPerSec;

//                 if (x < -50 || x > w + 50) continue;

//                 // 📐 خط کمکی بالایی (helper line)
//                 // استایل: ضخامت ۱، رنگ آبی تیره، شفافیت ۰.۲
//                 ctx.strokeStyle = 'rgba(15, 52, 96, 0.2)';
//                 ctx.lineWidth = 1;
//                 ctx.beginPath();
//                 ctx.moveTo(x, 0);
//                 ctx.lineTo(x, baselineY - 20);
//                 ctx.stroke();

//                 // 📍 تیک مارکر (tick)
//                 // استایل: ضخامت ۲، رنگ آبی تیره، شفافیت ۰.۸
//                 ctx.strokeStyle = 'rgba(15, 52, 96, 0.8)';
//                 ctx.lineWidth = 2;
//                 ctx.beginPath();
//                 ctx.moveTo(x, baselineY - 20);
//                 ctx.lineTo(x, baselineY);
//                 ctx.stroke();

//                 // 🏷️ متن زمان روی مارکر
//                 const d = new Date(sec * 1000);
//                 const t = `${String(d.getHours()).padStart(2, "0")}:${String(
//                     d.getMinutes()
//                 ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

//                 ctx.fillStyle = '#ffffff';
//                 ctx.fillText(t, x, baselineY + 5);
//             }

//             // ==========================================
//             // ⚡ رسم خط عمودی مرکزی (Center Line) با افکت درخشش
//             // استایل: ضخامت، رنگ، شفافیت
//             // برای تغییر استایل این خط، اینجا را ویرایش کنید:
//             //   - lineWidth برای ضخامت
//             //   - strokeStyle برای رنگ
//             //   - shadowBlur برای میزان درخشش
//             // ==========================================
            
//             // افکت درخشش (Glow Effect)
//             ctx.shadowColor = '#3694ff';
//             ctx.shadowBlur = 10;  // 👈 میزان درخشش
            
//             ctx.strokeStyle = '#3694ff';  // 👈 رنگ خط اصلی
//             ctx.lineWidth = 1;  // 👈 ضخامت خط
//             ctx.beginPath();
//             ctx.moveTo(centerX, 0);
//             ctx.lineTo(centerX, baselineY);
//             ctx.stroke();
            
//             // بازنشانی shadow برای بقیه رسم‌ها
//             ctx.shadowBlur = 0;

//             // ==========================================
//             // 🔵 رسم نقطه مرکزی (Center Dot)
//             // استایل: رنگ پر کردن، شعاع دایره
//             // برای تغییر استایل نقطه، اینجا را ویرایش کنید:
//             //   - fillStyle برای رنگ
//             //   - arc(..., شعاع, ...) برای اندازه
//             // ==========================================
//             ctx.fillStyle = '#00d9ff';  // 👈 رنگ نقطه
//             ctx.beginPath();
//             ctx.arc(centerX, baselineY, 6, 0, Math.PI * 2);  // 👈 شعاع نقطه = 6
//             ctx.fill();

//             // ==========================================
//             // 🏷️ برچسب زمان روی خط عمودی (با ۵ ثانیه جلوتر)
//             // استایل متن: font, fillStyle, shadowBlur
//             // برای تغییر استایل متن، اینجا را ویرایش کنید:
//             // ==========================================
//             const dt = new Date(lineTime + dragOffset);
//             const tt = `${String(dt.getHours()).padStart(2, "0")}:${String(
//                 dt.getMinutes()
//             ).padStart(2, "0")}:${String(dt.getSeconds()).padStart(2, "0")}`;

//             // استایل متن مرکزی
//             ctx.font = 'bold 22px Arial';  // 👈 اندازه و فونت
//             ctx.fillStyle = '#720b0b';  // 👈 رنگ متن
//             ctx.textAlign = 'center';
//             ctx.textBaseline = 'top';
            
//             // افکت سایه روی متن
//             ctx.shadowColor = '#00d9ff';  // 👈 رنگ سایه
//             ctx.shadowBlur = 10;  // 👈 میزان blur سایه
            
//             ctx.fillText(tt, centerX, 10);
            
//             // بازنشانی shadow
//             ctx.shadowBlur = 0;

//             animationFrameRef.current = requestAnimationFrame(render);
//         };

//         animationFrameRef.current = requestAnimationFrame(render);

//         return () => {
//             window.removeEventListener('resize', resizeCanvas);
//             canvas.removeEventListener('pointerdown', handlePointerDown);
//             canvas.removeEventListener('pointermove', handlePointerMove);
//             canvas.removeEventListener('pointerup', handlePointerUp);
//             canvas.removeEventListener('pointerleave', handlePointerUp);
            
//             if (animationFrameRef.current) {
//                 cancelAnimationFrame(animationFrameRef.current);
//             }
//         };
//     }, []); // ✅ فقط یکبار اجرا می‌شود

//     return (
//         <canvas 
//             ref={canvasRef} 
//             className="absolute inset-0 w-full h-full"
//             style={{ cursor: draggingRef.current ? 'grabbing' : 'grab' }}
//         />
//     );
// };

// export default TimelineCounter;

// import React, { useEffect, useRef } from 'react';

// export default function TimelineCounter({ 
//   currentTime, 
//   streaming = false, 
//   offsetSeconds = 0,
//   barSpacing = 2.5,
//   visibleRange = null
// }) {
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const dpr = window.devicePixelRadius || 1;

//     const resizeCanvas = () => {
//       const rect = canvas.getBoundingClientRect();
//       canvas.width = rect.width * dpr;
//       canvas.height = rect.height * dpr;
//       ctx.scale(dpr, dpr);
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     // تعیین فاصله زمانی بر اساس barSpacing (زوم)
//     // barSpacing کوچکتر = زوم این = فاصله زمانی کمتر
//     // barSpacing بزرگتر = زوم اوت = فاصله زمانی بیشتر
//     const getTimeInterval = (spacing) => {
// console.log('spacing',spacing)
//       if (spacing >= 18) {
//         return 15; // 15 ثانیه
//       } else if (spacing >= 12) {
//         return 600; // 10 دقیقه
//       } else if (spacing >= 8) {
//         return 300; // 5 دقیقه
//       } else if (spacing >= 5) {
//         return 120; // 2 دقیقه
//       } else if (spacing >= 3) {
//         return 60; // 1 دقیقه
//       } else if (spacing >= 1.5) {
//         return 30; // 30 ثانیه
//       } else {
//                  return 1800; // 30 دقیقه (زوم اوت ترین حالت)

//       }
//     };

//     const formatTime = (timestamp, intervalSeconds) => {
//       const date = new Date(timestamp);
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');

//       // اگر فاصله کمتر از 60 ثانیه باشد، ثانیه هم نشان بده
//       if (intervalSeconds < 60) {
//         return `${hours}:${minutes}:${seconds}`;
//       } else {
//         return `${hours}:${minutes}`;
//       }
//     };

//     const drawTimeline = () => {
//       const rect = canvas.getBoundingClientRect();
//       const width = rect.width;
//       const height = rect.height;

//       ctx.clearRect(0, 0, width, height);

//       // استفاده از visibleRange برای محاسبه زمان‌های قابل مشاهده
//       if (!visibleRange) return;

//       const startTime = visibleRange.from * 1000; // تبدیل به میلی‌ثانیه
//       const endTime = visibleRange.to * 1000;
//       const timeRange = endTime - startTime;

//       const intervalSeconds = getTimeInterval(barSpacing);
//       const intervalMs = intervalSeconds * 1000;

//       // محاسبه اولین زمان که باید نمایش داده شود (رند شده به نزدیک‌ترین فاصله)
//       const firstTime = Math.floor(startTime / intervalMs) * intervalMs;

//       // تعداد تیک‌هایی که باید نمایش داده شوند
//       const tickCount = Math.ceil((endTime - firstTime) / intervalMs) + 1;

//       ctx.strokeStyle = 'rgba(154, 163, 181, 0.2)';
//       ctx.fillStyle = '#9aa3b5';
//       ctx.font = '11px Inter, sans-serif';

//       for (let i = 0; i < tickCount; i++) {
//         const tickTime = firstTime + (i * intervalMs);
        
//         // محاسبه موقعیت x بر اساس نسبت زمان در بازه قابل مشاهده
//         const timeRatio = (tickTime - startTime) / timeRange;
//         const x = timeRatio * width;

//         // فقط تیک‌هایی که در محدوده canvas هستند را رسم کن
//         if (x >= 0 && x <= width) {
//           // رسم خط عمودی
//           ctx.beginPath();
//           ctx.moveTo(x, 0);
//           ctx.lineTo(x, 8);
//           ctx.stroke();

//           // رسم متن زمان
//           const timeText = formatTime(tickTime, intervalSeconds);
//           const textWidth = ctx.measureText(timeText).width;
          
//           // مرکز کردن متن روی خط
//           const textX = Math.max(5, Math.min(width - textWidth - 5, x - textWidth / 2));
          
//           ctx.fillText(timeText, textX, 24);
//         }
//       }

//       // اگر streaming فعال باشد، خط قرمز نقطه فعلی را نشان بده
//       if (streaming && currentTime) {
//         const currentTimeRatio = (currentTime - startTime) / timeRange;
//         const currentX = currentTimeRatio * width;

//         if (currentX >= 0 && currentX <= width) {
//           ctx.strokeStyle = 'rgba(54, 148, 255, 0.8)';
//           ctx.lineWidth = 2;
//           ctx.beginPath();
//           ctx.moveTo(currentX, 0);
//           ctx.lineTo(currentX, height);
//           ctx.stroke();
//           ctx.lineWidth = 1;
//         }
//       }
//     };

//     const animate = () => {
//       drawTimeline();
//       if (streaming) {
//         animationRef.current = requestAnimationFrame(animate);
//       }
//     };

//     animate();

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [currentTime, streaming, offsetSeconds, barSpacing, visibleRange]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="w-full h-full"
//       style={{ display: 'block' }}
//     />
//   );
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////
// import * as PIXI from "pixi.js";
// import { useEffect, useRef } from "react";

// const TimelineCounter = ({ currentTime, offsetSeconds = 0, streaming = false, visibleRange, barSpacing }) => {
//     const pixiRef = useRef(null);
//     const appRef = useRef(null);
//     const internalTimeRef = useRef(0);
//     const lastTimeRef = useRef(null);
//     const currentTimeRef = useRef(currentTime);
//     const offsetRef = useRef(offsetSeconds);
//     const streamingRef = useRef(streaming);
//     const visibleRangeRef = useRef(visibleRange);
//     const barSpacingRef = useRef(barSpacing);

//     useEffect(() => {
//         currentTimeRef.current = currentTime;
//     }, [currentTime]);

//     useEffect(() => {
//         offsetRef.current = offsetSeconds;
//     }, [offsetSeconds]);

//     useEffect(() => {
//         streamingRef.current = streaming;
//         if (streaming) {
//             lastTimeRef.current = null;
//         }
//     }, [streaming]);

//     useEffect(() => {
//         visibleRangeRef.current = visibleRange;
//     }, [visibleRange]);

//     useEffect(() => {
//         barSpacingRef.current = barSpacing;
//     }, [barSpacing]);

//     useEffect(() => {
//         const view = pixiRef.current;
//         if (!view) return;
//         const app = new PIXI.Application({
//             backgroundAlpha: 0,
//             resizeTo: view,
//             antialias: true,
//             autoDensity: true,
//             resolution: window.devicePixelRatio || 1,
//         });
//         view.appendChild(app.view);
//         appRef.current = app;
//         const stage = app.stage;
//         const baseline = new PIXI.Graphics();
//         stage.addChild(baseline);
//         const markers = new PIXI.Container();
//         stage.addChild(markers);

//         // No centerLine, centerDot, label for timescale-like rendering

//         const blurFilter = new PIXI.filters.BlurFilter(4);
//         let pixelsPerSec = 4; // Default

//         // Function to round to nice interval
//         const getNiceInterval = (suggestedInterval) => {
//             const levels = [15, 30, 60, 120, 300, 600, 900, 1800, 3600];
//             for (let level of levels) {
//                 if (suggestedInterval <= level) return level;
//             }
//             return 1800; // Max 30 min
//         };

//         app.ticker.add((delta) => {
//             const w = app.screen.width;
//             const h = app.screen.height;
//             const baselineY = h - 10; // Adjust for timescale height

//             // Update internal time if streaming
//             if (streamingRef.current) {
//                 const now = performance.now();
//                 if (lastTimeRef.current === null) {
//                     lastTimeRef.current = now;
//                     internalTimeRef.current = currentTimeRef.current;
//                 } else {
//                     const deltaMs = now - lastTimeRef.current;
//                     internalTimeRef.current += deltaMs;
//                     lastTimeRef.current = now;
//                 }
//             }

//             const effectiveTimeMs = streamingRef.current ? internalTimeRef.current : currentTimeRef.current;
//             const timeMs = effectiveTimeMs + offsetRef.current * 1000;
//             const baseTime = timeMs / 1000;

//             // Use visibleRange if available, else fallback
//             let from = visibleRangeRef.current?.from ?? (baseTime - w / (2 * pixelsPerSec));
//             let to = visibleRangeRef.current?.to ?? (baseTime + w / (2 * pixelsPerSec));

//             // Calculate pixelsPerSec from visibleRange and width
//             if (visibleRangeRef.current) {
//                 pixelsPerSec = w / (to - from);
//             }

//             // Calculate suggested interval: aim for ~8 ticks on screen
//             const totalSeconds = to - from;
//             const suggestedInterval = totalSeconds / 8; // ~8 ticks
//             let interval = getNiceInterval(suggestedInterval);

//             // Enforce min 15s at max zoom (small barSpacing means zoom-in)
//             if (barSpacingRef.current <= 2) { // Adjust threshold based on your minBarSpacing
//                 interval = 15;
//             }
//             // Max 30min at min zoom (large barSpacing means zoom-out)
//             if (barSpacingRef.current >= 20) {
//                 interval = 1800;
//             }

//             // Clear
//             markers.removeChildren();
//             baseline.clear();

//             // Baseline
//             baseline.lineStyle(3, 0x16213e, 0.6);
//             baseline.moveTo(0, baselineY);
//             baseline.lineTo(w, baselineY);

//             // Markers based on visible range
//             const startSec = Math.floor(from / interval) * interval;
//             for (let sec = startSec; sec <= to; sec += interval) {
//                 const x = (sec - from) * pixelsPerSec;
//                 if (x < -50 || x > w + 50) continue;

//                 const g = new PIXI.Graphics();
//                 g.lineStyle(1, 0x0f3460, 0.3);
//                 g.moveTo(x, baselineY - 20);
//                 g.lineTo(x, baselineY);
//                 markers.addChild(g);

//                 const d = new Date(sec * 1000);
//                 let t;
//                 if (interval >= 3600) {
//                     // For large intervals, show HH or date if needed
//                     t = `${d.getHours().toString().padStart(2, "0")}`;
//                 } else if (interval >= 60) {
//                     // HH:MM for minute-level
//                     t = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
//                 } else {
//                     // For small intervals, alternate format
//                     if (d.getSeconds() === 0) {
//                         t = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
//                     } else {
//                         t = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
//                     }
//                 }

//                 const txt = new PIXI.Text(t, {
//                     fontSize: 11,
//                     fill: "#fff",
//                     fontWeight: "bold",
//                 });
//                 txt.anchor.set(0.5, 0);
//                 txt.x = x;
//                 txt.y = baselineY + 5;
//                 markers.addChild(txt);
//             }

//             // Optional: Alternate format for every other tick
//             // But for now, use interval-based
//         });
//         return () => app.destroy(true, { children: true });
//     }, []);
//     return <div ref={pixiRef} className="w-full h-full" />;
// };
// export default TimelineCounter;