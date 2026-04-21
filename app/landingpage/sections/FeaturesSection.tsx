'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { FaHeart, FaPaw, FaUserMd, FaBath } from 'react-icons/fa'
import styles from './FeaturesSection.module.css'

const features = [
  {
    icon: <FaHeart />,
    title: 'Cuidado humanizado 24h',
    desc: 'Ficamos 24h com seu pet. Ele dorme com a gente, fica solto e é tratado como parte da família.',
  },
  {
    icon: <FaPaw />,
    title: 'Sem gaiolinha',
    desc: 'Os pets ficam livres o tempo todo — no banho, na creche e no hotel. Espaço aberto e acolhedor.',
  },
  {
    icon: <FaUserMd />,
    title: 'Assistência veterinária',
    desc: 'Temos a Dra. Camila Cordeiro disponível para qualquer necessidade durante a estadia.',
  },
  {
    icon: <FaBath />,
    title: 'Banho & Tosa no check-out',
    desc: 'No dia de ir pra casa, seu pet pode sair limpinho e cheiroso com nosso serviço de banho & tosa.',
  },
]

interface FeaturesSectionProps {
  imageSrc: string
}

export default function FeaturesSection({ imageSrc }: FeaturesSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.layout}>
        {/* Image side */}
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.imageInner}>
            <Image
              src={imageSrc}
              alt="Pets felizes no PitPet"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.imageDecor} />
        </motion.div>

        {/* Content side */}
        <div className={styles.content}>
          <motion.span
            className={styles.kicker}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaPaw size={13} />
            Por que o PitPet
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Seu pet em boas patas
          </motion.h2>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Mais de 1.000 animais já passaram pelo PitPet desde 2019. Descubra por que somos o lar
            favorito dos pets da região.
          </motion.p>

          <div className={styles.featuresList}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                className={styles.featureItem}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <div>
                  <div className={styles.featureTitle}>{f.title}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
