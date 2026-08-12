import * as THREE from "three";

/**
 * Converts a fraction of the viewport (0..1, 0,0 = top-left) into a world
 * position on the z=targetZ plane for a perspective camera, so the can can
 * be pinned to the same screen position the Figma mock uses regardless of
 * viewport size.
 */
export function screenToWorld(
  xFrac: number,
  yFrac: number,
  camera: THREE.PerspectiveCamera,
  targetZ = 0
) {
  const distance = camera.position.z - targetZ;
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const halfHeight = Math.tan(vFov / 2) * distance;
  const halfWidth = halfHeight * camera.aspect;

  const ndcX = xFrac * 2 - 1;
  const ndcY = 1 - yFrac * 2;

  return new THREE.Vector3(ndcX * halfWidth, ndcY * halfHeight, targetZ);
}
