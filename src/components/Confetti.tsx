import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'star' | 'rect';
}

const COLORS = ['#FF6B35', '#FFD700', '#4CAF50', '#2196F3', '#9B59B6', '#E91E8C', '#00BCD4', '#FF9800'];

interface Props {
  active: boolean;
}

export default function Confetti({ active }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 6,
      delay: Math.random() * 0.8,
      duration: Math.random() * 1.5 + 1.5,
      shape: (['circle', 'star', 'rect'] as const)[Math.floor(Math.random() * 3)],
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 3500);
    return () => clearTimeout(timer);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.shape === 'star' ? (
            <span style={{ fontSize: p.size + 4, color: p.color }}>⭐</span>
          ) : p.shape === 'circle' ? (
            <div style={{
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: p.color,
            }} />
          ) : (
            <div style={{
              width: p.size, height: p.size * 0.5,
              borderRadius: 2,
              background: p.color,
              transform: `rotate(${Math.random() * 360}deg)`,
            }} />
          )}
        </div>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
