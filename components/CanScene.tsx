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
// viewport height). Desktop overlays the can beside the copy; the mobile
// mock stacks it — can on top of the hero, and off to the right on features.
//
// heightFrac is kept EQUAL across the two keyframes of a breakpoint so the can
// never grows or shrinks while it travels between screens (that size change
// read as a "jump"). Only position and rotation interpolate.
const HERO = { xFrac: 0.69, yFrac: 0.55, heightFrac: 0.7, tiltDeg: 12.42 };
const FEATURES = { xFrac: 0.5, yFrac: 0.462, heightFrac: 0.7, tiltDeg: 0 };
const HERO_M = { xFrac: 0.52, yFrac: 0.263, heightFrac: 0.44, tiltDeg: 12 };
const FEATURES_M = { xFrac: 0.88, yFrac: 0.453, heightFrac: 0.44, tiltDeg: 0 };

const MOBILE_MAX = 768;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function CanRig() {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useTransitionProgress();
  const { camera } = useThree();

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || !(camera instanceof THREE.PerspectiveCamera)) return;

    const t = easeInOutCubic(progressRef.current);

    const isMobile = state.size.width <= MOBILE_MAX;
    const hero = isMobile ? HERO_M : HERO;
    const features = isMobile ? FEATURES_M : FEATURES;

    const xFrac = THREE.MathUtils.lerp(hero.xFrac, features.xFrac, t);
    const yFrac = THREE.MathUtils.lerp(hero.yFrac, features.yFrac, t);
    const heightFrac = THREE.MathUtils.lerp(hero.heightFrac, features.heightFrac, t);
    const tiltDeg = THREE.MathUtils.lerp(hero.tiltDeg, features.tiltDeg, t);

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
