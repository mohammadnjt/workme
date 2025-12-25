import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class TimelineScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TimelineScene' });
    this.timeLabels = [];
    this.visibleRange = null;
    this.barSpacing = 2.5;
    this.lastPointTime = null;
    this.currentTimeSeconds = Date.now() / 1000; // زمان جاری برحسب ثانیه
  }

  preload() {}

  create() {
    this.graphics = this.add.graphics();
    this.cameras.main.setBackgroundColor('#1a1f2e');

    this.drawTimeline();

    // آپدیت نرم زمان با دلتا
    this.time.addEvent({
      delay: 16, // حدود 60fps
      callback: (/** time */ _, delta) => {
        this.currentTimeSeconds += delta / 1000;
        this.drawTimeline();
      },
      callbackScope: this,
      loop: true,
    });
  }

  formatTime(ts) {
    const date = new Date(ts * 1000);
    const h = date.getUTCHours().toString().padStart(2, '0');
    const m = date.getUTCMinutes().toString().padStart(2, '0');
    const s = date.getUTCSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  formatDate(ts) {
    const date = new Date(ts * 1000);
    const d = date.getUTCDate().toString().padStart(2, '0');
    const mo = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    return `${d}-${mo}`;
  }

  calculateTimeInterval(rangeSeconds, width) {
    const pps = width / rangeSeconds;
    if (pps > 2) return 1;
    if (pps > 0.5) return 5;
    if (pps > 0.2) return 15;
    if (pps > 0.1) return 30;
    if (pps > 0.05) return 60;
    if (pps > 0.02) return 300;
    if (pps > 0.01) return 900;
    if (pps > 0.005) return 1800;
    return 3600;
  }

  drawTimeline() {
    this.graphics.clear();
    this.timeLabels.forEach((l) => l.destroy());
    this.timeLabels = [];

    if (!this.visibleRange) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const { from, to } = this.visibleRange;
    const rangeSeconds = to - from;

    const interval = this.calculateTimeInterval(rangeSeconds, width);
    const startTime = Math.ceil(from / interval) * interval;

    // پس‌زمینه
    this.graphics.fillStyle(0x1a1f2e, 1);
    this.graphics.fillRect(0, 0, width, height);

    // خط بالایی
    this.graphics.lineStyle(1, 0x2a3447, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(width, 0);
    this.graphics.strokePath();

    // خطوط عمودی و برچسب زمان
    for (let t = startTime; t <= to; t += interval) {
      const x = ((t - from) / rangeSeconds) * width;
      if (x < 0 || x > width) continue;

      this.graphics.lineStyle(1, 0x2a3447, 0.3);
      this.graphics.beginPath();
      this.graphics.moveTo(x, 0);
      this.graphics.lineTo(x, height);
      this.graphics.strokePath();

      const timeText = this.formatTime(t);
      const label = this.add.text(x, height / 2, timeText, {
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        color: '#9aa3b5',
        align: 'center',
      });
      label.setOrigin(0.5, 0.5);
      this.timeLabels.push(label);

      if (interval >= 3600 || t % 86400 === 0) {
        const dateText = this.formatDate(t);
        const dateLabel = this.add.text(x, height - 12, dateText, {
          fontSize: '9px',
          fontFamily: 'Inter, sans-serif',
          color: '#6b7280',
          align: 'center',
        });
        dateLabel.setOrigin(0.5, 0.5);
        this.timeLabels.push(dateLabel);
      }
    }

    // خط زمان فعلی
    const currentTime = this.currentTimeSeconds;
    if (currentTime >= from && currentTime <= to) {
      const x = ((currentTime - from) / rangeSeconds) * width;
      this.graphics.lineStyle(2, 0x3694ff, 0.8);
      this.graphics.beginPath();
      this.graphics.moveTo(x, 0);
      this.graphics.lineTo(x, height);
      this.graphics.strokePath();

      this.graphics.fillStyle(0x3694ff, 1);
      this.graphics.fillCircle(x, 5, 3);
    }

    // خط تارگت (10 ثانیه جلوتر از آخرین نقطه) + تایمر
    if (Number.isFinite(this.lastPointTime)) {
      const targetTime = this.lastPointTime + 10;
      if (targetTime >= from && targetTime <= to) {
        const x = ((targetTime - from) / rangeSeconds) * width;

        // خط چین عمودی
        this.graphics.lineStyle(2, 0xff6b35, 0.6);
        const dashLength = 5;
        const gapLength = 5;
        let y = 0;
        let isDash = true;
        while (y < height) {
          if (isDash) {
            this.graphics.beginPath();
            this.graphics.moveTo(x, y);
            this.graphics.lineTo(x, Math.min(y + dashLength, height));
            this.graphics.strokePath();
          }
          y += isDash ? dashLength : gapLength;
          isDash = !isDash;
        }

        // نشانگر مثلثی بالا
        this.graphics.fillStyle(0xff6b35, 0.8);
        this.graphics.fillTriangle(x, 2, x - 4, 10, x + 4, 10);

        // برچسب تارگت
        const targetLabel = this.add.text(x, 15, 'TARGET', {
          fontSize: '9px',
          fontFamily: 'Inter, sans-serif',
          color: '#ff6b35',
          align: 'center',
          fontStyle: 'bold',
        });
        targetLabel.setOrigin(0.5, 0);
        this.timeLabels.push(targetLabel);

        // تایمر ثانیه‌ای کنار خط تارگت: اختلاف با زمان فعلی
        const diffSec = targetTime - currentTime;
        const timerText = `${diffSec >= 0 ? '+' : ''}${diffSec.toFixed(1)}s`;
        const timerLabel = this.add.text(x + 8, height / 2, timerText, {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          color: '#ffb185',
          align: 'left',
          fontStyle: 'bold',
        });
        timerLabel.setOrigin(0, 0.5);
        this.timeLabels.push(timerLabel);
      }
    }
  }

  updateVisibleRange(range, barSpacing) {
    this.visibleRange = range;
    this.barSpacing = barSpacing;
    // همگام‌سازی مجدد زمان جاری با ساعت واقعی
    this.currentTimeSeconds = Date.now() / 1000;
  }

  updateLastPointTime(t) {
    this.lastPointTime = t;
  }

  resize(width, height) {
    this.cameras.main.setSize(width, height);
    this.drawTimeline();
  }
}

const PhaserTimeline = ({ visibleRange, barSpacing, lastPointTime }) => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth,
      height: 60,
      transparent: false,
      scene: TimelineScene,
      backgroundColor: '#1a1f2e',
    };

    gameRef.current = new Phaser.Game(config);

    gameRef.current.events.on('ready', () => {
      sceneRef.current = gameRef.current.scene.scenes[0];
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length || !sceneRef.current) return;
      const { width } = entries[0].contentRect;
      sceneRef.current.resize(width, 60);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && visibleRange) {
      sceneRef.current.updateVisibleRange(visibleRange, barSpacing);
    }
  }, [visibleRange, barSpacing]);

  useEffect(() => {
    if (sceneRef.current && Number.isFinite(lastPointTime)) {
      sceneRef.current.updateLastPointTime(lastPointTime);
    }
  }, [lastPointTime]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '60px',
        backgroundColor: '#1a1f2e',
      }}
    />
  );
};

export default PhaserTimeline;