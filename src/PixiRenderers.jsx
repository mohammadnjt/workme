// pixiRenderers.js
import * as PIXI from 'pixi.js';

// Custom marker renderer with Pixi.js
export class PixiMarkerRenderer {
  constructor(chartContainer) {
    this.container = chartContainer;
    this.app = null;
    this.markersContainer = null;
    this.markers = new Map();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Create overlay div for markers
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.pointerEvents = 'none';
    overlayDiv.style.zIndex = '100';
    
    this.container.appendChild(overlayDiv);
    
    // Initialize Pixi.js
    this.app = new PIXI.Application({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundAlpha: 0,
    });
    
    overlayDiv.appendChild(this.app.view);
    this.markersContainer = new PIXI.Container();
    this.app.stage.addChild(this.markersContainer);
    
    this.initialized = true;
  }

  createTradeMarker(config) {
    const { id, x, y, type, amount } = config;
    
    // Create container for marker
    const markerContainer = new PIXI.Container();
    markerContainer.x = x;
    markerContainer.y = y;
    
    // Background with gradient
    const bgWidth = 80;
    const bgHeight = 36;
    const bg = new PIXI.Graphics();
    
    // Create gradient fill
    const gradientColors = type === 'call' 
      ? [0x22c55e, 0x16a34a] // Green gradient
      : [0xef4444, 0xdc2626]; // Red gradient
    
    bg.beginFill(gradientColors[0]);
    bg.drawRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 6);
    bg.endFill();
    
    // Add glass effect
    const glass = new PIXI.Graphics();
    glass.beginFill(0xffffff, 0.15);
    glass.drawRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight/2, 6);
    glass.endFill();
    
    // Create arrow icon
    const arrow = new PIXI.Graphics();
    arrow.beginFill(0xffffff);
    
    if (type === 'call') {
      // Up arrow
      arrow.drawPolygon([
        -6, 4,
        0, -4,
        6, 4
      ]);
    } else {
      // Down arrow
      arrow.drawPolygon([
        -6, -4,
        0, 4,
        6, -4
      ]);
    }
    arrow.endFill();
    arrow.x = -20;
    
    // Create text
    const text = new PIXI.Text(type === 'call' ? 'BUY' : 'SELL', {
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0xffffff,
      fontWeight: 'bold',
    });
    text.x = -15;
    text.y = -6;
    
    const amountText = new PIXI.Text(`$${amount}`, {
      fontFamily: 'Arial',
      fontSize: 9,
      fill: 0xffffff,
      opacity: 0.9,
    });
    amountText.x = -15;
    amountText.y = 6;
    
    // Assemble marker
    markerContainer.addChild(bg);
    markerContainer.addChild(glass);
    markerContainer.addChild(arrow);
    markerContainer.addChild(text);
    markerContainer.addChild(amountText);
    
    // Add interactivity
    markerContainer.interactive = true;
    markerContainer.buttonMode = true;
    
    markerContainer.on('pointerover', () => {
      markerContainer.scale.set(1.05);
    });
    
    markerContainer.on('pointerout', () => {
      markerContainer.scale.set(1);
    });
    
    return markerContainer;
  }

  addMarker(markerConfig, chartApi) {
    if (!this.initialized) this.init();
    
    // Convert time/price to screen coordinates
    const time = markerConfig.time;
    const price = markerConfig.price || markerConfig.value;
    
    if (!chartApi || time === undefined || price === undefined) return;
    
    const coordinate = chartApi.timeScale().timeToCoordinate(time);
    const priceCoordinate = chartApi.priceScale('right').priceToCoordinate(price);
    
    if (coordinate === null || priceCoordinate === null) return;
    
    const marker = this.createTradeMarker({
      id: markerConfig.id,
      x: coordinate,
      y: priceCoordinate,
      type: markerConfig.type || 'call',
      amount: markerConfig.amount || '100',
    });
    
    this.markersContainer.addChild(marker);
    this.markers.set(markerConfig.id, marker);
  }

  updateMarkers(chartApi, markersData) {
    if (!this.initialized || !chartApi) return;
    
    // Clear existing markers
    this.markersContainer.removeChildren();
    this.markers.clear();
    
    // Add new markers
    markersData.forEach(marker => {
      this.addMarker(marker, chartApi);
    });
  }

  removeMarker(id) {
    const marker = this.markers.get(id);
    if (marker) {
      this.markersContainer.removeChild(marker);
      this.markers.delete(id);
    }
  }

  resize(width, height) {
    if (this.app) {
      this.app.renderer.resize(width, height);
    }
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.initialized = false;
    }
  }
}

// Pixi.js Animation Handler
export class PixiAnimationHandler {
  constructor(container) {
    this.container = container;
    this.app = null;
    this.animationLayer = null;
    this.animations = new Map();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    this.app = new PIXI.Application({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundAlpha: 0,
    });
    
    this.container.appendChild(this.app.view);
    this.animationLayer = new PIXI.Container();
    this.app.stage.addChild(this.animationLayer);
    this.initialized = true;
  }

  createValueLineAnimation(startX, startY, endX, endY, duration = 360) {
    const line = new PIXI.Graphics();
    line.lineStyle(1.5, 0x3694ff, 0.8);
    line.moveTo(startX, startY);
    line.lineTo(startX, startY);
    
    this.animationLayer.addChild(line);
    
    const startTime = performance.now();
    const animationId = `line_${Date.now()}`;
    
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      
      line.clear();
      line.lineStyle(1.5, 0x3694ff, 0.8 - progress * 0.3);
      line.moveTo(startX, startY);
      line.lineTo(currentX, currentY);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animations.delete(animationId);
        this.animationLayer.removeChild(line);
      }
    };
    
    this.animations.set(animationId, animate);
    requestAnimationFrame(animate);
    
    return animationId;
  }

  createParticleAnimation(x, y, color, count = 20) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(color);
      particle.drawCircle(0, 0, Math.random() * 3 + 1);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 8;
      particle.vy = (Math.random() - 0.5) * 8;
      particle.alpha = 1;
      particle.life = 1;
      
      this.animationLayer.addChild(particle);
      particles.push(particle);
    }
    
    const animationId = `particles_${Date.now()}`;
    
    const animate = () => {
      let allDead = true;
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.alpha = particle.life;
        particle.scale.set(particle.life);
        
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        
        if (particle.life > 0) allDead = false;
      });
      
      if (!allDead) {
        requestAnimationFrame(animate);
      } else {
        particles.forEach(particle => {
          this.animationLayer.removeChild(particle);
        });
        this.animations.delete(animationId);
      }
    };
    
    this.animations.set(animationId, animate);
    requestAnimationFrame(animate);
    
    return animationId;
  }

  createSmoothValueTransition(startValue, endValue, duration, onUpdate) {
    const startTime = performance.now();
    const animationId = `transition_${Date.now()}`;
    
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = this.easeInOutCubic(progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      onUpdate(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animations.delete(animationId);
      }
    };
    
    this.animations.set(animationId, animate);
    requestAnimationFrame(animate);
    
    return animationId;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  resize(width, height) {
    if (this.app) {
      this.app.renderer.resize(width, height);
    }
  }

  clear() {
    this.animationLayer.removeChildren();
    this.animations.clear();
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.initialized = false;
    }
  }
}

// Helper function to create gradient texture
export function createGradientTexture(width, height, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return PIXI.Texture.from(canvas);
}

// Utility for creating glass effect
export function createGlassEffect(width, height, radius) {
  const graphics = new PIXI.Graphics();
  
  // Main glass shape
  graphics.beginFill(0xffffff, 0.1);
  graphics.drawRoundedRect(0, 0, width, height, radius);
  graphics.endFill();
  
  // Reflection
  graphics.beginFill(0xffffff, 0.2);
  graphics.drawRoundedRect(0, 0, width, height / 2, radius);
  graphics.endFill();
  
  return graphics;
}