"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaStar } from "react-icons/fa";
import styles from "./TestimonialsSection.module.css";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time: string;
}

const REVIEWS: Review[] = [
  {
    author_name: "Fernanda Oliveira",
    rating: 5,
    text: "Minha Mel ficou super bem cuidada! A Cris mandou fotos e vídeos todos os dias. Sabia que ela estava feliz e segura. Com certeza voltarei sempre! ❤️",
    relative_time: "1 semana atrás",
  },
  {
    author_name: "Ricardo Santos",
    rating: 5,
    text: "Serviço impecável. Deixei meu labrador por 10 dias e ele saiu ainda mais saudável. O espaço é lindo, os pets ficam livres e bem tratados. Super indico!",
    relative_time: "2 semanas atrás",
  },
  {
    author_name: "Juliana Mendes",
    rating: 5,
    text: "Deixar meu pet pela primeira vez foi ansioso para mim, mas a equipe do PitPet me deixou super tranquila. Minha cachorrinha adorou e voltou super feliz!",
    relative_time: "3 semanas atrás",
  },
  {
    author_name: "Carlos Pereira",
    rating: 5,
    text: "Ambiente maravilhoso, equipe dedicada e muito carinhosa. Meu dog ficou 5 dias e foi tratado como rei. Preços justos e comunicação excelente!",
    relative_time: "1 mês atrás",
  },
  {
    author_name: "Amanda Costa",
    rating: 5,
    text: "Recomendo de olhos fechados. A Cris é apaixonada pelo que faz e isso aparece no cuidado com cada animalzinho. Voltamos sempre! 🐾",
    relative_time: "1 mês atrás",
  },
  {
    author_name: "Marcos Lima",
    rating: 5,
    text: "Minha golden ficou super bem. Adoro que não usam gaiola e os pets ficam soltos. Isso faz toda a diferença no bem-estar deles. PitPet nota 10!",
    relative_time: "2 meses atrás",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.kicker}>
          <FaStar size={12} />
          Avaliações
        </span>
        <h2 className={styles.title}>O que dizem os tutores</h2>
        <p className={styles.subtitle}>
          5.0 no Google — mais de 100 avaliações reais de tutores que confiam no
          PitPet.
        </p>
      </motion.div>

      <div className={styles.grid}>
        {REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            {/* Stars */}
            <div className={styles.stars}>
              {Array.from({ length: review.rating }).map((_, s) => (
                <FaStar key={s} size={14} className={styles.star} />
              ))}
            </div>

            <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>

            <div className={styles.author}>
              <div className={styles.avatar}>
                {getInitials(review.author_name)}
              </div>
              <div>
                <div className={styles.authorName}>{review.author_name}</div>
                <div className={styles.authorTime}>{review.relative_time}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
