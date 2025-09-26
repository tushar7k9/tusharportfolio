import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Environment, Float } from '@react-three/drei';

const AnimatedLetter = ({ letter, position, rotation, index }) => {
  const meshRef = useRef();
  const initialRotation = useRef(rotation);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(position);
  const { viewport } = useThree();
  const dragOffset = useRef([0, 0]);

  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      const time = state.clock.elapsedTime;

      // Subtle floating animation only when not dragging
      meshRef.current.position.y = dragPosition[1] + Math.sin(time * 0.5 + index * 0.5) * 0.2;

      // Gentle rotation animation
      meshRef.current.rotation.x = initialRotation.current[0] + Math.sin(time * 0.3 + index * 0.3) * 0.1;
      meshRef.current.rotation.y = initialRotation.current[1] + Math.cos(time * 0.4 + index * 0.4) * 0.15;
      meshRef.current.rotation.z = initialRotation.current[2] + Math.sin(time * 0.2 + index * 0.6) * 0.08;
    }
  });

  const handlePointerDown = useCallback((event) => {
    event.stopPropagation();
    setIsDragging(true);

    // Calculate offset between mouse position and object center
    const objectPosition = meshRef.current.position;
    const mouseX = (event.pointer.x * viewport.width) / 2;
    const mouseY = (event.pointer.y * viewport.height) / 2;

    dragOffset.current = [
      objectPosition.x - mouseX,
      objectPosition.y - mouseY
    ];

    // Capture pointer to ensure we get all subsequent events
    event.target.setPointerCapture?.(event.pointerId);
  }, [viewport.width, viewport.height]);

  const handlePointerMove = useCallback((event) => {
    if (!isDragging || !meshRef.current) return;
    event.stopPropagation();

    // Convert normalized mouse coordinates to world coordinates
    const x = (event.pointer.x * viewport.width) / 2 + dragOffset.current[0];
    const y = (event.pointer.y * viewport.height) / 2 + dragOffset.current[1];

    // Update position directly on mesh, keeping original Z depth
    meshRef.current.position.x = x;
    meshRef.current.position.y = y;

    // Update state less frequently to reduce re-renders
    setDragPosition(prev => [x, y, prev[2]]);
  }, [isDragging, viewport.width, viewport.height]);

  const handlePointerUp = useCallback((event) => {
    event.stopPropagation();
    setIsDragging(false);

    // Release pointer capture
    event.target.releasePointerCapture?.(event.pointerId);
  }, []);

  return (
    <Float
      speed={isDragging ? 0 : 1.5}
      rotationIntensity={isDragging ? 0 : 0.2}
      floatIntensity={isDragging ? 0 : 0.3}
    >
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_bold.typeface.json"
        size={7}
        height={0.8}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.15}
        bevelSize={0.2}
        bevelSegments={5}
        position={dragPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {letter}
        <meshPhysicalMaterial
          color="#000000"
          metalness={1.5}
          roughness={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.0}
          envMapIntensity={2.0}
          transparent={true}
          opacity={0.9}
          ior={1.9}
          transmission={0}
        />
      </Text3D>
    </Float>
  );
};

const GlossyLetters3D = ({ letters = "TUSHAR" }) => {
  const letterPositions = useMemo(() => {
    // Define specific scattered positions for each letter (similar to original design)
    const scatteredPositions = [
      [-18, 3, -4],   // T - top left area
      [8, 5, -2],     // U - top right area
      [-11, -8, -6],   // S - bottom left area
      [15, -15, -3],    // H - center right area
      [-18, -12, -2],   // A - bottom left area
      [3, -6, -5],     // R - right area
    ];

    return letters.split('').map((_, index) => {
      // Use predefined positions if available, otherwise generate random ones
      if (index < scatteredPositions.length) {
        return scatteredPositions[index];
      }
      return [
        (Math.random() - 0.5) * 16, // x spread
        (Math.random() - 0.5) * 10, // y spread
        (Math.random() - 0.5) * 10, // z depth
      ];
    });
  }, [letters]);

  const letterRotations = useMemo(() => {
    return letters.split('').map(() => [
      (Math.random() - 0.5) * 0.3, // x rotation
      (Math.random() - 0.5) * 0.5, // y rotation
      (Math.random() - 0.5) * 0.2, // z rotation
    ]);
  }, [letters]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[-10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        <pointLight position={[10, -10, -10]} intensity={0.3} color="#00ffff" />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* Render letters */}
        {letters.split('').map((letter, index) => (
          <AnimatedLetter
            key={index}
            letter={letter}
            position={letterPositions[index]}
            rotation={letterRotations[index]}
            index={index}
          />
        ))}

        {/* Optional fog for depth */}
        <fog attach="fog" args={['#000000', 15, 25]} />
      </Canvas>
    </div>
  );
};

export default GlossyLetters3D;