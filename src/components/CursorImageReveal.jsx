import React, { useState, useEffect, useRef } from 'react';
import './CursorImageReveal.css';

const CursorImageReveal = ({ isActive, cursorPosition }) => {
  const [images] = useState([
    // You can add your own images here
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=400&h=600&fit=crop',
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null);

  // Cycle through images while cursor is active
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 800); // Change image every 800ms
    } else {
      setIsVisible(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, images.length]);

  if (!cursorPosition || !isVisible) return null;

  return (
    <div
      className={`cursor-image-reveal ${isActive ? 'active' : ''}`}
      style={{
        left: cursorPosition.x - 100, // Center the image on cursor
        top: cursorPosition.y - 75,
      }}
    >
      <div className="image-container">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Reveal ${index + 1}`}
            className={`reveal-image ${index === currentImageIndex ? 'active' : ''}`}
            loading="lazy"
          />
        ))}
      </div>

      {/* Glowing border effect */}
      <div className="glow-border"></div>

      {/* Particle effects around the image */}
      <div className="image-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.1}s`,
              '--angle': `${i * 30}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CursorImageReveal;