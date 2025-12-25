import Phaser from "phaser";

class Example extends Phaser.Scene
{
    create ()
    {
        // this.graphics = this.add.graphics();
        // this.cameras.main.setBackgroundColor('#1a1f2e');
        this.angle = 0;

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa } });

        this.point = new Phaser.Math.Vector2(250, 0);
        this.point2 = new Phaser.Math.Vector2(250, 0);

        this.text = this.add.text(30, 30, '');

        this.input.on('pointermove', (pointer) => {

            this.point2.copy(pointer);

            this.point2.x -= 400;
            this.point2.y -= 300;

        });
    }

    update ()
    {
        const graphics = this.graphics;

        graphics.clear();

        this.angle += 0.005;

        //  Vector starting at 0/0
        this.point.set(Math.cos(this.angle) * 250, Math.sin(this.angle) * 250);

        // drawn from the center (as if center was 0/0)
        graphics.lineBetween(400, 300, 400 + this.point.x, 300 + this.point.y);

        graphics.lineStyle(2, 0x00aa00);
        graphics.lineBetween(400, 300, 400 + this.point2.x, 300 + this.point2.y);

        const dotProduct = this.point.dot(this.point2);

        const area = this.point.length() * this.point2.length();

        const angleBetween = Math.acos(dotProduct / area);

        // only used to determine arc direction
        const cross = this.point.cross(this.point2);

        graphics.lineStyle(2, 0xaa0000);
        graphics.beginPath();
        graphics.arc(400, 300, 100, this.angle, this.angle + (cross < 0 ? -angleBetween : angleBetween));
        graphics.strokePath();

        this.text.setText([
            'Dot product: ' + dotProduct,
            'Normalized dot product: ' + dotProduct / area,
            'Angle between vectors: ' + Phaser.Math.RadToDeg(angleBetween),
            'Pointer is ' + (dotProduct > 0 ? 'in front of' : 'behind') + ' the blue vector direction'
        ]);
    }
}

// export {game};
export default Example

// import React, { useEffect, useRef } from 'react';
// import Phaser from 'phaser';

// class TimelineScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'TimelineScene' });
//     this.timeLabels = [];
//     this.visibleRange = null;
//     this.barSpacing = 2.5;
//     this.lastPointTime = null;
//     this.currentLineX = 0;
//     this.targetLineX = 0;
//   }

//   create() {
//     this.graphics = this.add.graphics();
//     this.cameras.main.setBackgroundColor('#1a1f2e');
    
//     // Draw initial timeline
//     this.drawTimeline();
//   }

//   update() {
//     // Update current time line position every frame
//     this.drawTimeline();
//   }

//   formatTime(timestamp) {
//     const date = new Date(timestamp * 1000);
//     const hours = date.getUTCHours().toString().padStart(2, '0');
//     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
//     const seconds = date.getUTCSeconds().toString().padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
//   }

//   formatDate(timestamp) {
//     const date = new Date(timestamp * 1000);
//     const day = date.getUTCDate().toString().padStart(2, '0');
//     const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//     return `${day}-${month}`;
//   }

//   calculateTimeInterval(rangeSeconds, width) {
//     const pixelsPerSecond = width / rangeSeconds;
    
//     if (pixelsPerSecond > 2) return 1;
//     if (pixelsPerSecond > 0.5) return 5;
//     if (pixelsPerSecond > 0.2) return 15;
//     if (pixelsPerSecond > 0.1) return 30;
//     if (pixelsPerSecond > 0.05) return 60;
//     if (pixelsPerSecond > 0.02) return 300;
//     if (pixelsPerSecond > 0.01) return 900;
//     if (pixelsPerSecond > 0.005) return 1800;
//     return 3600;
//   }

//   drawTimeline() {
//     this.graphics.clear();
    
//     this.timeLabels.forEach(label => label.destroy());
//     this.timeLabels = [];

//     if (!this.visibleRange) return;

//     const width = this.cameras.main.width;
//     const height = this.cameras.main.height;
    
//     const { from, to } = this.visibleRange;
//     const rangeSeconds = to - from;
    
//     const interval = this.calculateTimeInterval(rangeSeconds, width);
//     const startTime = Math.ceil(from / interval) * interval;
    
//     // Draw background
//     this.graphics.fillStyle(0x1a1f2e, 1);
//     this.graphics.fillRect(0, 0, width, height);
    
//     // Draw horizontal line at top
//     this.graphics.lineStyle(1, 0x2a3447, 1);
//     this.graphics.beginPath();
//     this.graphics.moveTo(0, 0);
//     this.graphics.lineTo(width, 0);
//     this.graphics.strokePath();
    
//     // Draw time labels and vertical lines
//     for (let time = startTime; time <= to; time += interval) {
//       const x = ((time - from) / rangeSeconds) * width;
      
//       if (x < 0 || x > width) continue;
      
//       this.graphics.lineStyle(1, 0x2a3447, 0.3);
//       this.graphics.beginPath();
//       this.graphics.moveTo(x, 0);
//       this.graphics.lineTo(x, height);
//       this.graphics.strokePath();
      
//       const timeText = this.formatTime(time);
//       const label = this.add.text(x, height / 2, timeText, {
//         fontSize: '11px',
//         fontFamily: 'Inter, sans-serif',
//         color: '#9aa3b5',
//         align: 'center'
//       });
//       label.setOrigin(0.5, 0.5);
//       this.timeLabels.push(label);
      
//       if (interval >= 3600 || (time % 86400 === 0)) {
//         const dateText = this.formatDate(time);
//         const dateLabel = this.add.text(x, height - 12, dateText, {
//           fontSize: '9px',
//           fontFamily: 'Inter, sans-serif',
//           color: '#6b7280',
//           align: 'center'
//         });
//         dateLabel.setOrigin(0.5, 0.5);
//         this.timeLabels.push(dateLabel);
//       }
//     }
    
//     // Draw current time line (smooth animated)
//     const currentTime = Date.now() / 1000;
//     if (currentTime >= from && currentTime <= to) {
//       const x = ((currentTime - from) / rangeSeconds) * width;
//       this.currentLineX = x;
      
//       this.graphics.lineStyle(2, 0x3694ff, 0.8);
//       this.graphics.beginPath();
//       this.graphics.moveTo(x, 0);
//       this.graphics.lineTo(x, height);
//       this.graphics.strokePath();
      
//       this.graphics.fillStyle(0x3694ff, 1);
//       this.graphics.fillCircle(x, 5, 3);
//     }
    
//     // Draw target line (10 seconds ahead)
//     if (this.lastPointTime) {
//       const targetTime = this.lastPointTime + 10;
//       if (targetTime >= from && targetTime <= to) {
//         const x = ((targetTime - from) / rangeSeconds) * width;
//         this.targetLineX = x;
        
//         // Dashed line effect
//         this.graphics.lineStyle(2, 0xff6b35, 0.6);
//         const dashLength = 5;
//         const gapLength = 5;
//         let currentY = 0;
//         let isDash = true;
        
//         while (currentY < height) {
//           if (isDash) {
//             this.graphics.beginPath();
//             this.graphics.moveTo(x, currentY);
//             this.graphics.lineTo(x, Math.min(currentY + dashLength, height));
//             this.graphics.strokePath();
//           }
//           currentY += isDash ? dashLength : gapLength;
//           isDash = !isDash;
//         }
        
//         this.graphics.fillStyle(0xff6b35, 0.8);
//         this.graphics.fillTriangle(x, 2, x - 4, 10, x + 4, 10);
        
//         const targetLabel = this.add.text(x, 15, 'TARGET', {
//           fontSize: '9px',
//           fontFamily: 'Inter, sans-serif',
//           color: '#ff6b35',
//           align: 'center',
//           fontStyle: 'bold'
//         });
//         targetLabel.setOrigin(0.5, 0);
//         this.timeLabels.push(targetLabel);
//       }
//     }
//   }

//   updateVisibleRange(range, barSpacing) {
//     this.visibleRange = range;
//     this.barSpacing = barSpacing;
//   }

//   updateLastPointTime(time) {
//     this.lastPointTime = time;
//   }

//   getCurrentLinePosition() {
//     return this.currentLineX;
//   }

//   getTargetLinePosition() {
//     return this.targetLineX;
//   }

//   resize(width, height) {
//     this.cameras.main.setSize(width, height);
//     this.drawTimeline();
//   }
// }

// const PhaserTimeline = ({ visibleRange, barSpacing, lastPointTime }) => {
//   const gameRef = useRef(null);
//   const containerRef = useRef(null);
//   const sceneRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const config = {
//       type: Phaser.AUTO,
//       parent: containerRef.current,
//       width: containerRef.current.clientWidth,
//       height: 60,
//       transparent: false,
//       scene: TimelineScene,
//       backgroundColor: '#1a1f2e',
//       fps: {
//         target: 60,
//         forceSetTimeOut: false
//       }
//     };

//     gameRef.current = new Phaser.Game(config);
    
//     gameRef.current.events.on('ready', () => {
//       sceneRef.current = gameRef.current.scene.scenes[0];
//     });

//     const resizeObserver = new ResizeObserver((entries) => {
//       if (!entries.length || !sceneRef.current) return;
//       const { width } = entries[0].contentRect;
//       sceneRef.current.resize(width, 60);
//     });

//     resizeObserver.observe(containerRef.current);

//     return () => {
//       resizeObserver.disconnect();
//       if (gameRef.current) {
//         gameRef.current.destroy(true);
//         gameRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (sceneRef.current && visibleRange) {
//       sceneRef.current.updateVisibleRange(visibleRange, barSpacing);
//     }
//   }, [visibleRange, barSpacing]);

//   useEffect(() => {
//     if (sceneRef.current && lastPointTime) {
//       sceneRef.current.updateLastPointTime(lastPointTime);
//     }
//   }, [lastPointTime]);

//   return (
//     <div 
//       ref={containerRef} 
//       style={{ 
//         width: '100%', 
//         height: '60px',
//         backgroundColor: '#1a1f2e',
//         position: 'relative'
//       }} 
//     />
//   );
// };

// export default PhaserTimeline;