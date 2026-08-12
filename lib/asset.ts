/**
 * Prefixes a public/ asset path with the deploy base path.
 *
 * Next rewrites its own `_next/*` output and `next/image` sources with
 * `assetPrefix`, but plain string paths handed to `useGLTF`, `useTexture`, or
 * `<img src>` are NOT rewritten. On GitHub Pages the site lives under
 * /<repo>/, so those raw paths would 404 without this prefix. Locally the base
 * path is empty and paths resolve from the root unchanged.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
