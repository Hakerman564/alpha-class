import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

interface Candlestick {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  isGreen: boolean;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generar datos de candlestick
    const generateCandlesticks = (): Candlestick[] => {
      const candlesticks: Candlestick[] = [];
      const basePrice = canvas.height * 0.5;
      let currentPrice = basePrice;

      for (let i = 0; i < 25; i++) {
        const volatility = canvas.height * 0.05;
        const change = (Math.random() - 0.5) * volatility;
        const open = currentPrice;
        const close = currentPrice + change;
        const high = Math.max(open, close) + Math.random() * canvas.height * 0.03;
        const low = Math.min(open, close) - Math.random() * canvas.height * 0.03;
        const isGreen = close > open;

        candlesticks.push({
          x: (i * canvas.width) / 25,
          open: canvas.height - open,
          close: canvas.height - close,
          high: canvas.height - high,
          low: canvas.height - low,
          isGreen
        });

        currentPrice = close;
      }

      return candlesticks;
    };

    let candlesticks = generateCandlesticks();
    let animationId: number;

    const drawCandlestick = (candlestick: Candlestick, alpha: number = 1) => {
      const { x, open, close, high, low, isGreen } = candlestick;
      const width = canvas.width / 40; // Más ancho
      const bodyHeight = Math.abs(close - open);
      const bodyY = Math.min(open, close);

      // Dibujar sombra (wick)
      ctx.strokeStyle = `rgba(100, 116, 139, ${alpha * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + width / 2, high);
      ctx.lineTo(x + width / 2, low);
      ctx.stroke();

      // Dibujar cuerpo
      const gradient = ctx.createLinearGradient(x, bodyY, x + width, bodyY + bodyHeight);
      
      if (isGreen) {
        gradient.addColorStop(0, `rgba(34, 197, 94, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(16, 185, 129, ${alpha * 0.4})`);
      } else {
        gradient.addColorStop(0, `rgba(239, 68, 68, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(220, 38, 38, ${alpha * 0.4})`);
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(x, bodyY, width, bodyHeight);

      // Borde del cuerpo
      ctx.strokeStyle = isGreen 
        ? `rgba(34, 197, 94, ${alpha * 0.6})` 
        : `rgba(239, 68, 68, ${alpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, bodyY, width, bodyHeight);
    };

    const drawBackground = () => {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo degradado
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#f8fafc');
      bgGradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar candlesticks
      candlesticks.forEach((candlestick, index) => {
        const alpha = 0.3 + (index / candlesticks.length) * 0.7;
        drawCandlestick(candlestick, alpha);
      });

      // Números flotantes de dinero
      const moneyNumbers = ['+€1,250', '-€89', '+€320', '-€45', '+€890', '-€156', '+€2,100', '-€67', '+€445', '-€234'];
      
      for (let i = 0; i < 15; i++) {
        const x = (Date.now() * 0.0005 + i * 150) % (canvas.width + 200) - 100;
        const y = (Math.sin(Date.now() * 0.0008 + i) * 100 + i * 40) % canvas.height;
        const alpha = 0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2;
        const isPositive = Math.sin(Date.now() * 0.001 + i) > 0;
        const number = moneyNumbers[i % moneyNumbers.length];
        
        ctx.font = `bold ${16 + Math.sin(Date.now() * 0.003 + i) * 4}px Montserrat, sans-serif`;
        ctx.fillStyle = isPositive 
          ? `rgba(34, 197, 94, ${alpha})` 
          : `rgba(239, 68, 68, ${alpha})`;
        
        ctx.fillText(number, x, y);
      }

      animationId = requestAnimationFrame(drawBackground);
    };

    drawBackground();

    // Regenerar candlesticks cada 10 segundos
    const interval = setInterval(() => {
      candlesticks = generateCandlesticks();
    }, 10000);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="animated-background">
      <canvas
        ref={canvasRef}
        className="background-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
