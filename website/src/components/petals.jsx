import React, { useEffect, useRef } from 'react';

class Petal {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = (Math.random() * canvas.height * 2) - canvas.height;
    this.w = 25 + Math.random() * 15;
    this.h = 20 + Math.random() * 10;
    this.opacity = this.w / 40;
    this.flip = Math.random();
    this.xSpeed = 1.5 + Math.random() * 2;
    this.ySpeed = 1 + Math.random() * 1;
    this.flipSpeed = Math.random() * 0.03;
  }

  draw(ctx, petalImg) {
    if (this.y > this.canvas.height || this.x > this.canvas.width) {
      this.x = -petalImg.width;
      this.y = (Math.random() * this.canvas.height * 2) - this.canvas.height;
      this.xSpeed = 1.5 + Math.random() * 2;
      this.ySpeed = 1 + Math.random() * 1;
      this.flip = Math.random();
    }
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      petalImg,
      this.x,
      this.y,
      this.w * (0.6 + (Math.abs(Math.cos(this.flip)) / 3)),
      this.h * (0.8 + (Math.abs(Math.sin(this.flip)) / 5))
    );
  }

  animate(ctx, petalImg, mouseX) {
    this.x += this.xSpeed + mouseX * 5;
    this.y += this.ySpeed + mouseX * 2;
    this.flip += this.flipSpeed;
    this.draw(ctx, petalImg);
  }
}

export default function FallingPetals() {
  const canvasRef = useRef(null);
  const mouseXRef = useRef(0);
  const petalsRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const TOTAL = 100;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load petal image
    const petalImg = new Image();
    petalImg.src = 'https://djjjk9bjm164h.cloudfront.net/petal.png';

    petalImg.addEventListener('load', () => {
      // Initialize petals
      petalsRef.current = [];
      for (let i = 0; i < TOTAL; i++) {
        petalsRef.current.push(new Petal(canvas));
      }

      // Start animation
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petalsRef.current.forEach(petal => {
          petal.animate(ctx, petalImg, mouseXRef.current);
        });
        animationRef.current = window.requestAnimationFrame(render);
      };
      render();
    });

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Update canvas reference for existing petals
      petalsRef.current.forEach(petal => {
        petal.canvas = canvas;
      });
    };

    // Handle mouse/touch movement
    const handleMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (clientX !== undefined) {
        mouseXRef.current = clientX / window.innerWidth;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#1a1a1a', overflow: 'hidden' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}