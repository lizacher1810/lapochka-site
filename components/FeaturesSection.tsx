"use client";

import { useParallax } from "@/hooks/useParallax";
import { asset } from "@/lib/asset";
import styles from "./FeaturesSection.module.css";

type Photo = {
  src: string;
  style: React.CSSProperties;
  rotate?: number;
  flip?: boolean;
  depth: number;
};

const PHOTOS: Photo[] = [
  {
    src: "/assets/screen2/object-blueberry-a.png",
    style: { top: "78.15%", left: "5%", right: "86.71%", bottom: "7.16%" },
    rotate: 22.68,
    flip: true,
    depth: 1.8,
  },
  {
    src: "/assets/screen2/object-lavender-a.png",
    style: { top: "78.15%", left: "64.11%", right: "30.26%", bottom: "11.85%" },
    depth: 1.4,
  },
  {
    src: "/assets/screen2/object-lavender-a.png",
    style: { top: "10.56%", left: "31.72%", right: "62.97%", bottom: "80%" },
    depth: 2.0,
  },
  {
    src: "/assets/screen2/object-flower.png",
    style: { top: "10.12%", left: "88.46%", right: "6.17%", bottom: "80.02%" },
    rotate: -74.99,
    depth: 1.2,
  },
  {
    src: "/assets/screen2/object-blueberry-b.png",
    style: { top: "6.3%", left: "2.08%", right: "82.57%", bottom: "64.16%" },
    rotate: 40.91,
    depth: 1.6,
  },
  {
    src: "/assets/screen2/object-lavender-b.png",
    style: { top: "58.06%", left: "80.94%", right: "-2.17%", bottom: "6.93%" },
    rotate: 64.92,
    depth: 1.5,
  },
  {
    src: "/assets/screen2/object-flower-b.png",
    style: { top: "79.84%", left: "23.37%", right: "62.91%", bottom: "-6.8%" },
    rotate: 15.62,
    depth: 1.3,
  },
];

export function FeaturesSection() {
  const sectionRef = useParallax<HTMLElement>(18);

  return (
    <section ref={sectionRef} className={styles.section}>
      <img src={asset("/assets/screen2/blob-circle.svg")} alt="" className={styles.blob} />

      <p className={styles.ghostText}>
        blueberry
        <br />×<br />
        sagan-dalya
        <br />×<br />
        lavender
      </p>

      {PHOTOS.map((photo, i) => (
        <img
          key={i}
          src={asset(photo.src)}
          alt=""
          className={styles.photo}
          style={{
            ...photo.style,
            transform: `translate(calc(var(--px, 0px) * ${photo.depth}), calc(var(--py, 0px) * ${photo.depth})) ${
              photo.flip ? "scaleX(-1) " : ""
            }rotate(${photo.rotate ?? 0}deg)`,
          }}
        />
      ))}

      <div className={`${styles.feature} ${styles.featureTopLeft}`}>
        <h3>необычный вкус</h3>
        <p>
          Черника, саган-дайля и лаванда создают мягкое ягодно-цветочное
          сочетание, которого не встретишь в обычном лимонаде.
        </p>
      </div>
      <div className={`${styles.feature} ${styles.featureBottomLeft}`}>
        <h3>без сахара</h3>
        <p>
          Освежающий вкус без добавленного сахара — лёгкий вариант для тех,
          кто выбирает меньше сладости.
        </p>
      </div>
      <div className={`${styles.feature} ${styles.featureTopRight}`}>
        <h3>натуральный состав</h3>
        <p>
          Только понятные ингредиенты и натуральные растительные компоненты —
          ничего лишнего.
        </p>
      </div>
      <div className={`${styles.feature} ${styles.featureBottomRight}`}>
        <h3>вдохновлён природой</h3>
        <p>
          В напитке встретились ягоды, цветы и сибирская трава — всё то, что
          делает вкус особенным и узнаваемым.
        </p>
      </div>

      <button className={styles.cta}>попробовать</button>
    </section>
  );
}
