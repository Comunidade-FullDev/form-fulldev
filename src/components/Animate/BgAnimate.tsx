'use client'
import React, { useRef, useEffect } from "react";

export default function AnimatedBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 100; // Número de partículas
    const maxDistance = 150; // Distância máxima para conectar partículas

    // Configurar o tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);

    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhar partículas e linhas
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Movimento das partículas
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Reflexão nas bordas
        if (p1.x <= 0 || p1.x >= canvas.width) p1.vx *= -1;
        if (p1.y <= 0 || p1.y >= canvas.height) p1.vy *= -1;

        // Desenhar a partícula
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#E14817"; // Cor das partículas
        ctx.fill();
        ctx.closePath();

        // Conectar com partículas próximas
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(178, 43, 0, ${1 - distance / maxDistance})`; // Cor com opacidade baseada na distância
            ctx.stroke();
            ctx.closePath();
          }
        }
      }

      // Loop da animação
      requestAnimationFrame(animateParticles);
    };

    // Iniciar animação
    animateParticles();

    // Limpar evento ao desmontar
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
