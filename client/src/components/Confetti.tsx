import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  color: string;
  size: number;
  shape: 'square' | 'circle' | 'triangle';
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  pieces?: number;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE'
];

export function Confetti({ active, duration = 3000, pieces = 50 }: ConfettiProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    console.log('Confetti effect triggered:', { active, duration, pieces });
    
    if (!active) {
      setConfettiPieces([]);
      return;
    }

    // Create initial confetti pieces
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const initialPieces: ConfettiPiece[] = Array.from({ length: pieces }, (_, i) => ({
      id: i,
      x: Math.random() * windowWidth,
      y: -20,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      fallSpeed: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)] as 'square' | 'circle' | 'triangle'
    }));

    setConfettiPieces(initialPieces);

    // Animation loop
    const animationFrame = () => {
      setConfettiPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          y: piece.y + piece.fallSpeed,
          x: piece.x + Math.sin(piece.y * 0.01) * 0.5,
          rotation: piece.rotation + piece.rotationSpeed
        })).filter(piece => piece.y < window.innerHeight + 50)
      );
    };

    const intervalId = setInterval(animationFrame, 16);

    // Clear confetti after duration
    const timeoutId = setTimeout(() => {
      setConfettiPieces([]);
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [active, duration, pieces]);

  if (!active || confettiPieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            transform: `rotate(${piece.rotation}deg)`,
            transition: 'none'
          }}
        >
          {piece.shape === 'square' && (
            <div
              className="transform-gpu"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                borderRadius: '2px'
              }}
            />
          )}
          {piece.shape === 'circle' && (
            <div
              className="transform-gpu rounded-full"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color
              }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div
              className="transform-gpu"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${piece.size / 2}px solid transparent`,
                borderRight: `${piece.size / 2}px solid transparent`,
                borderBottom: `${piece.size}px solid ${piece.color}`
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}