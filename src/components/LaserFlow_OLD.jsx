import React, { useRef, useState, useCallback } from 'react';
import './LaserFlow.css';

const LaserFlow = ({ onCursorMove }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    // Call parent's cursor move handler
    if (onCursorMove) {
      onCursorMove({ x: e.clientX, y: e.clientY });
    }
  }, [onCursorMove]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (onCursorMove) {
      onCursorMove(null);
    }
  }, [onCursorMove]);

  return (
    <div
      ref={containerRef}
      className="laser-flow-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main laser beam */}
      <div className="laser-beam-main" />

      {/* Animated laser streams */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="laser-stream"
          style={{
            '--delay': `${i * 0.2}s`,
            '--offset': `${i * 8.33}%`,
            '--duration': `${2 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Pulsing nodes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`node-${i}`}
          className="laser-node"
          style={{
            '--delay': `${i * 0.5}s`,
            '--position': `${15 + i * 15}%`
          }}
        />
      ))}

      {/* Interactive cursor effect */}
      {isHovered && (
        <div
          className="laser-cursor-effect"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
      )}

      {/* Side glow effects */}
      <div className="laser-glow-left" />
      <div className="laser-glow-right" />
    </div>
  );
};

export default LaserFlow;