"use client";

import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Can } from "@/components/Can";
import { useTransitionProgress } from "@/hooks/useTransitionProgress";
import { screenToWorld } from "@/lib/three/screenToWorld";

// Measured from the source GLB (Círculo_0 node scale * Object_0 local bbox).
const NATURAL_HEIGHT = 1.882;

// Screen-space keyframes lifted from the Figma hero/features frames
// (can center as a fraction of viewport, and can height as a fraction of
// viewport height).
const HERO = { xFrac: 0.69, yFrac: 0.535, heightFrac: 0.72, tiltDeg: 12.42 };
const FEATURES = { xFrac: 0.5, yFrac: 0.46, heightFrac: 0.68, tiltDeg: 0 };

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function CanRig() {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useTransitionProgress();
  const { camera } = useThree();

  useFrame(() => {
    const group = groupRef.current;
    if (!group || !(camera instanceof THREE.PerspectiveCamera)) return;

    const t = easeInOutCubic(progressRef.current);

    const xFrac = THREE.MathUtils.lerp(HERO.xFrac, FEATURES.xFrac, t);
    const yFrac = THREE.MathUtils.lerp(HERO.yFrac, FEATURES.yFrac, t);
    const heightFrac = THREE.MathUtils.lerp(HERO.heightFrac, FEATURES.heightFrac, t);
    const tiltDeg = THREE.MathUtils.lerp(HERO.tiltDeg, FEATURES.tiltDeg, t);

    const target = screenToWorld(xFrac, yFrac, camera, 0);
    group.position.copy(target);

    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const halfHeight = Math.tan(vFov / 2) * camera.position.z;
    const desiredWorldHeight = 2 * halfHeight * heightFrac;
    const scale = desiredWorldHeight / NATURAL_HEIGHT;
    group.scale.setScalar(scale);

    group.rotation.y = progressRef.current * Math.PI * 2;
    group.rotation.z = THREE.MathUtils.degToRad(-tiltDeg);
  });

  return (
    <group ref={groupRef}>
      <Can />
    </group>
  );
}

export function CanScene() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} />
        <Suspense fallback={null}>
          <CanRig />
          <Environment preset="city" environmentIntensity={0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
}
