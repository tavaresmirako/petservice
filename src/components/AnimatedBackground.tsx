import React, { useEffect, useState } from 'react';

interface PawData {
  id: number;
  left: string;
  top: string;
  rotation: string;
  size: string;
}

const AnimatedBackground: React.FC = () => {
  const [paws, setPaws] = useState<PawData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPaw: PawData = {
        id: Date.now() + Math.random(),
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 90 + 5}%`,
        rotation: `${Math.random() * 360}deg`,
        size: `${50 + Math.random() * 40}px`,
      };

      setPaws((prev) => [...prev, newPaw]);

      setTimeout(() => {
        setPaws((prev) => prev.filter((p) => p.id !== newPaw.id));
      }, 5000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="canvas-container"
      className="fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-500"
      style={{
        zIndex: -1,
        background: 'linear-gradient(135deg, var(--bg-start) 0%, var(--bg-end) 100%)',
      }}
    >
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="paw absolute opacity-0 pointer-events-none"
          style={{
            left: paw.left,
            top: paw.top,
            width: paw.size,
            height: paw.size,
            fill: 'var(--paw-color)', // Usando a variável CSS
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
            animation: 'fadeInOut 5s ease-in-out forwards',
            // @ts-ignore
            '--rotation': paw.rotation,
          }}
        >
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="112" cy="192" rx="48" ry="64" />
            <ellipse cx="208" cy="128" rx="48" ry="64" />
            <ellipse cx="304" cy="128" rx="48" ry="64" />
            <ellipse cx="400" cy="192" rx="48" ry="64" />
            <path d="M160 336c0-44 43-80 96-80s96 36 96 80c0 50-43 112-96 112s-96-62-96-112z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(var(--rotation));
          }
          25% {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation)); 
          }
          75% {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation));
          }
          100% {
            opacity: 0;
            transform: scale(1.1) rotate(var(--rotation));
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
