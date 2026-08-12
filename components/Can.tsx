"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { prepareCanBody } from "@/lib/three/prepareCanBody";
import { asset } from "@/lib/asset";

useGLTF.preload(asset("/models/can.glb"));

export function Can(props: { scale?: number }) {
  const { scene } = useGLTF(asset("/models/can.glb"));
  const rawLabelTexture = useTexture(asset("/textures/label-wrap.png"));

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Configure a clone rather than mutating the texture the hook returned.
  const labelTexture = useMemo(() => {
    const texture = rawLabelTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.flipY = true;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [rawLabelTexture]);

  useEffect(() => {
    const meshes: THREE.Mesh[] = [];
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
    });
    meshes.sort(
      (a, b) =>
        (b.geometry.attributes.position?.count ?? 0) -
        (a.geometry.attributes.position?.count ?? 0)
    );

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xdadadc),
      metalness: 1,
      roughness: 0.28,
    });

    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      metalness: 0.25,
      roughness: 0.6,
    });

    meshes.forEach((mesh, i) => {
      if (i === 0) {
        // The straight cylindrical wall runs from frac ~0.025 to ~0.95 of the
        // body height (measured from the mesh); the band is set just outside
        // those rings so the label covers the whole wall — only the thin base
        // curve and the top neck/rim stay bare metal.
        prepareCanBody(mesh, {
          bandStart: 0.02,
          bandEnd: 0.955,
          angleOffset: Math.PI,
        });
        mesh.material = [labelMaterial, metalMaterial];
      } else {
        mesh.material = metalMaterial;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [cloned, labelTexture]);

  return <primitive object={cloned} scale={props.scale ?? 1} />;
}
