import * as THREE from "three";

/**
 * The source GLB has geometry but no UVs and no textures at all (bare
 * Sketchfab aluminium shell), so the label wrap has to be projected onto
 * the can body by hand: cylindrical UVs from vertex position, then the
 * body mesh is split into two triangle groups (label band vs bare metal
 * caps/shoulders) so only the middle band samples the label texture.
 */
export function prepareCanBody(
  mesh: THREE.Mesh,
  options: { bandStart: number; bandEnd: number; angleOffset: number }
) {
  const { bandStart, bandEnd, angleOffset } = options;
  const geometry = mesh.geometry as THREE.BufferGeometry;

  if (!geometry.index) {
    geometry.setIndex(
      Array.from({ length: geometry.attributes.position.count }, (_, i) => i)
    );
  }

  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;
  const minY = bbox.min.y;
  const maxY = bbox.max.y;
  const height = maxY - minY;

  const bandMinY = minY + bandStart * height;
  const bandMaxY = minY + bandEnd * height;

  const posAttr = geometry.attributes.position;
  const count = posAttr.count;
  const uv = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);

    let angle = -Math.atan2(z, x) + angleOffset;
    angle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const u = angle / (Math.PI * 2);

    const v = THREE.MathUtils.clamp((y - bandMinY) / (bandMaxY - bandMinY), 0, 1);

    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

  // Classify each triangle as "label band" or "bare metal", then rebuild the
  // index into two contiguous ranges exposed as geometry groups.
  //
  // A triangle joins the label band only when ALL THREE of its vertices sit
  // inside the band. Triangles that straddle the boundary (one vertex in, one
  // out) go to metal instead — otherwise their out-of-band vertices get their
  // v clamped to the band edge and stretch the purple/white edge of the label
  // downward as a spiky fringe over the metal base.
  const index = geometry.index!.array as Uint16Array | Uint32Array;
  const bandIndices: number[] = [];
  const metalIndices: number[] = [];

  const inBand = (vi: number) => {
    const y = posAttr.getY(vi);
    return y >= bandMinY && y <= bandMaxY;
  };

  for (let i = 0; i < index.length; i += 3) {
    const a = index[i];
    const b = index[i + 1];
    const c = index[i + 2];

    if (inBand(a) && inBand(b) && inBand(c)) {
      bandIndices.push(a, b, c);
    } else {
      metalIndices.push(a, b, c);
    }
  }

  const newIndex = [...bandIndices, ...metalIndices];
  geometry.setIndex(newIndex);
  geometry.clearGroups();
  geometry.addGroup(0, bandIndices.length, 0);
  geometry.addGroup(bandIndices.length, metalIndices.length, 1);

  return { minY, maxY, bandMinY, bandMaxY };
}
