"use client";

import { useEffect, useRef } from 'react';

export default function AnimatedGridBackground({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let columns = Math.floor(width / 20);
    let rows = Math.floor(height / 20);
    let nodes: [number, number, number, number, string][] = [];

    function setup() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / 20);
      rows = Math.floor(height / 20);
      nodes = [];
      for (let i = 0; i < columns * rows; i++) {
        const x = (i % columns) * 20;
        const y = Math.floor(i / columns) * 20;
        nodes.push([x, y, 0, 0, `hsl(${Math.random() * 360}, 100%, 70%)`]);
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const [x, y, vx, vy, color] = nodes[i];
        const newX = x + vx;
        const newY = y + vy;

        nodes[i][0] = newX;
        nodes[i][1] = newY;
        nodes[i][2] *= 0.94;
        nodes[i][3] *= 0.94;

        if (Math.random() > 0.99) {
          nodes[i][2] = Math.random() * 2 - 1;
          nodes[i][3] = Math.random() * 2 - 1;
        }

        if (newX < 0 || newX > width) nodes[i][2] *= -1;
        if (newY < 0 || newY > height) nodes[i][3] *= -1;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(newX, newY, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', setup);
    setup();
    draw();

    return () => window.removeEventListener('resize', setup);
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
