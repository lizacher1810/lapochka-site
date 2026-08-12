"use client";

import { useParallax } from "@/hooks/useParallax";
import { asset } from "@/lib/asset";
import styles from "./HeroSection.module.css";

type Photo = {
  src: string;
  style: React.CSSProperties;
  rotate?: number;
  flip?: boolean;
  opacity?: number;
  depth: number;
};

const PHOTOS: Photo[] = [
  {
    src: "/assets/screen1/object-lavender-a.png",
    style: { top: "2.78%", left: "-6.51%", right: "19.06%", bottom: "51.42%" },
    rotate: -121.43,
    flip: true,
    depth: 0.6,
  },
  {
    src: "/assets/screen1/object-lavender-a.png",
    style: { top: "4.17%", left: "57.5%", right: "24.64%", bottom: "64.75%" },
    rotate: -169.93,
    flip: true,
    depth: 1.4,
  },
  {
    src: "/assets/screen1/object-blueberry-a.png",
    style: { top: "69.81%", left: "79.06%", right: "15.31%", bottom: "20.19%" },
    depth: 1.8,
  },
  {
    src: "/assets/screen1/object-blueberry-a.png",
    style: { top: "51.48%", left: "75.83%", right: "19.69%", bottom: "40.56%" },
    opacity: 0.6,
    depth: 1.1,
  },
  {
    src: "/assets/screen1/object-blueberry-a.png",
    style: { top: "35.93%", left: "81.88%", right: "15.31%", bottom: "59.07%" },
    opacity: 0.6,
    depth: 0.8,
  },
  {
    src: "/assets/screen1/object-blueberry-single.png",
    style: { top: "55.56%", left: "83.39%", right: "12.03%", bottom: "36.76%" },
    depth: 2.2,
  },
  {
    src: "/assets/screen1/object-lavender-b.png",
    style: { top: "35.09%", left: "52.97%", right: "40.63%", bottom: "53.56%" },
    rotate: 22.68,
    flip: true,
    depth: 1.6,
  },
  {
    src: "/assets/screen1/object-flower.png",
    style: { top: "64.39%", left: "82.53%", right: "-0.65%", bottom: "-6.17%" },
    rotate: 19.7,
    depth: 1.3,
  },
  {
    src: "/assets/screen1/object-blueberry-b.png",
    style: { top: "10.56%", left: "72.97%", right: "9.24%", bottom: "63.1%" },
    rotate: 86.48,
    depth: 2.0,
  },
  {
    src: "/assets/screen1/object-flower-branch.png",
    style: { top: "51.02%", left: "45.36%", right: "32.47%", bottom: "9.02%" },
    rotate: -40.55,
    depth: 1.5,
  },
];

export function HeroSection() {
  const sectionRef = useParallax<HTMLElement>(22);

  return (
    <section ref={sectionRef} className={styles.section}>
      <img src={asset("/assets/screen1/blob-1.svg")} alt="" className={styles.blobA} />
      <img src={asset("/assets/screen1/blob-2.svg")} alt="" className={styles.blobB} />

      <p className={styles.ghostText}>blueberry × sagan-dalya × lavender</p>

      {PHOTOS.map((photo, i) => (
        <img
          key={i}
          src={asset(photo.src)}
          alt=""
          className={styles.photo}
          style={{
            ...photo.style,
            opacity: photo.opacity,
            transform: `translate(calc(var(--px, 0px) * ${photo.depth}), calc(var(--py, 0px) * ${photo.depth})) ${
              photo.flip ? "scaleX(-1) " : ""
            }rotate(${photo.rotate ?? 0}deg)`,
          }}
        />
      ))}

      <nav className={styles.nav}>
        <img src={asset("/assets/screen1/icon-menu.svg")} alt="Меню" className={styles.menuIcon} />
        <img src={asset("/assets/screen1/logo.svg")} alt="lapochka" className={styles.logo} />
        <div className={styles.navIcons}>
          <img src={asset("/assets/screen1/icon-search.svg")} alt="Поиск" />
          <img src={asset("/assets/screen1/icon-heart.svg")} alt="Избранное" />
          <svg
            className={styles.navSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Корзина"
          >
            <path d="M6.5 8h11l-.9 11.2a1.5 1.5 0 0 1-1.5 1.4H8.9a1.5 1.5 0 0 1-1.5-1.4L6.5 8Z" />
            <path d="M9 8V6.8a3 3 0 0 1 6 0V8" />
          </svg>
          <svg
            className={styles.navSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Профиль"
          >
            <circle cx="12" cy="8" r="3.4" />
            <path d="M5.8 20a6.2 6.2 0 0 1 12.4 0" />
          </svg>
        </div>
      </nav>

      <h1 className={styles.headline}>
        лимонад, в котором встретились байкал и лето
      </h1>
      <p className={styles.subcopy}>
        Черника, саган-дайля и лаванда в освежающем натуральном лимонаде без
        сахара. Попробуйте вкус, который сложно забыть.
      </p>
      <button className={styles.cta}>попробовать</button>
    </section>
  );
}
