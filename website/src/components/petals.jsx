import React, { useEffect, useRef } from 'react';

class Petal {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = (Math.random() * this.canvas.height * 2) - this.canvas.height;
    this.w = 25 + Math.random() * 15;
    this.h = 20 + Math.random() * 10;
    this.opacity = Math.random() * 0.7 + 0.3;
    this.flip = Math.random();
    this.xSpeed = 1.5 + Math.random() * 2;
    this.ySpeed = 1 + Math.random() * 1;
    this.flipSpeed = Math.random() * 0.03;
  }

  draw(ctx, petalImg) {
    if (this.y > this.canvas.height || this.x > this.canvas.width) {
      this.reset();
      this.x = -petalImg.width;
    }

    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      petalImg,
      this.x,
      this.y,
      this.w * (0.6 + Math.abs(Math.cos(this.flip)) / 3),
      this.h * (0.8 + Math.abs(Math.sin(this.flip)) / 5)
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
  const petalImgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const MAX_PETALS = 400;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petalImg = new Image();
    petalImg.src = 'https://djjjk9bjm164h.cloudfront.net/petal.png';
    petalImgRef.current = petalImg;

    petalImg.onload = () => {
      petalsRef.current = Array.from({ length: MAX_PETALS }, () => new Petal(canvas));

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petalsRef.current.forEach((petal) => petal.animate(ctx, petalImg, mouseXRef.current));
        animationRef.current = requestAnimationFrame(render);
      };

      render();
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      petalsRef.current.forEach((p) => (p.canvas = canvas));
    };

    const handleMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      if (clientX !== undefined) {
        mouseXRef.current = clientX / window.innerWidth - 0.5; // make movement subtle and centered
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed', // stays behind everything
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // lets user interact with the page
        }}
      />
    </div>
  );
}
