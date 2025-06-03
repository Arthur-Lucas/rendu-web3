'use client';

import { useEffect, useRef } from 'react';

const ShapeCanvas = ({ className = '', canvasWidth, canvasHeight }) => {
  const canvasRef = useRef(null);
  const previousVerticesRef = useRef(null);
  const lastDrawTimeRef = useRef(performance.now());
  const redrawIntervalRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      const currentTime = performance.now();
      const elapsedTime = currentTime - lastDrawTimeRef.current;

      if (elapsedTime > redrawIntervalRef.current) {
        redrawIntervalRef.current = 20000;

        canvas.width = canvasWidth ?? window.innerWidth;
        canvas.height = canvasHeight ?? window.innerHeight;

        const vertices = previousVerticesRef.current || [];
        if (vertices.length !== 16) {
          for (let i = 0; i < 16; i++) {
            vertices[i] = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
            };
          }
        }

        const targetVertices = Array.from({ length: 16 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        }));

        let startTime = currentTime;
        const duration = 10000;

        const tween = () => {
          const now = performance.now();
          const progress = Math.min((now - startTime) / duration, 1);
          const currentVertices = vertices.map((v, i) => ({
            x: v.x + (targetVertices[i].x - v.x) * progress,
            y: v.y + (targetVertices[i].y - v.y) * progress,
          }));

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
          );
          gradient.addColorStop(0, 'rgba(43, 74, 251, 0.46)');
          gradient.addColorStop(1, 'rgba(17, 112, 255, 0.46)');

          ctx.beginPath();
          ctx.moveTo(currentVertices[0].x, currentVertices[0].y);
          currentVertices.forEach((v) => ctx.lineTo(v.x, v.y));
          ctx.closePath();
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.filter = 'blur(100px)';
          ctx.fillStyle = gradient;
          ctx.fill();

          if (progress < 1) {
            requestAnimationFrame(tween);
          } else {
            startTime = now;
            previousVerticesRef.current = targetVertices;
          }
        };

        tween();
        lastDrawTimeRef.current = currentTime;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasWidth, canvasHeight]);

  return <canvas ref={canvasRef} className={className} />;
};

export default ShapeCanvas;
