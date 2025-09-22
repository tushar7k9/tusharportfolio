import React, { useState, useRef, useCallback, useMemo } from 'react';
import './DraggableLetter.css';

const DraggableLetter = ({ letter, initialX = 0, initialY = 0, initialRotation = 0, index }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [rotation, setRotation] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const letterRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = letterRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position.x, position.y]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      setPosition({ x: newX, y: newY });
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={letterRef}
      className={`draggable-letter ${isDragging ? 'dragging' : ''}`}
      data-letter={letter}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : 1,
        animationDelay: `${index * 0.3}s`,
      }}
      onMouseDown={handleMouseDown}
    >
      {letter}
    </div>
  );
};

export default DraggableLetter;