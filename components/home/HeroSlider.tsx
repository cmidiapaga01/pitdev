"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HeroSlider.module.css";

interface Slide {
  image: string;
  name: string;
}

interface Props {
  slides: Slide[];
}

const imageVariants = {
  initial: { opacity: 0, scale: 1.08 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const captionVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: "easeIn" as const },
  },
};

export default function HeroSlider({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slide = slides[index];

  return (
    <section className={styles.hero}>
      {/* Parallax wrapper */}
      <div
        className={styles.hero__parallax}
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={styles.hero__imageMotion}
          >
            <Image
              src={slide.image}
              fill
              alt={slide.name}
              priority={index === 0}
              className={styles.hero__image}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className={styles.hero__overlay} />
      </div>

      {/* Content */}
      <div className={styles.hero__content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={captionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={styles.hero__caption}
          >
            <span className={styles.hero__badge}>🐾 PitPet Store</span>
            <h1 className={styles.hero__title}>
              Seu pet {" "}
              <span className={styles.hero__titleAccent}>bem cuidado e feliz</span>
            </h1>
            <p className={styles.hero__subtitle}>
              Carinho e segurança para nossos anjos!
            </p>
            <a
              href="https://wa.me/5500000000000?text=Olá!%20Gostaria%20de%20fazer%20uma%20reserva%20no%20PitPet%20🐾"
              className={styles.hero__cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservar pelo WhatsApp
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className={styles.hero__dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.hero__dot} ${i === index ? styles["hero__dot--active"] : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
