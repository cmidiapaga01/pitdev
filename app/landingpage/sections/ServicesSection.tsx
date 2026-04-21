'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ServicesSection.module.css'

const services = [
  {
    emoji: '🏠',
    title: 'Hotel para Cães',
    desc: 'Seu pet fica livre o tempo todo e dorme com a gente. Monitoramento 24h, alimentação personalizada e muito amor.',
    prices: ['Pequeno/Médio: R$100/diária', 'Grande porte: R$120/diária'],
    highlight: 'Acima de 5 diárias com desconto',
    color: '#f07070',
  },
  {
    emoji: '🌞',
    title: 'Creche',
    desc: 'O espaço perfeito para o seu pet socializar, brincar e gastar energia enquanto você trabalha.',
    prices: [
      'Avulso: R$80',
      '1x/semana: R$200/mês',
      '2x/semana: R$360/mês',
      '3x/semana: R$480/mês',
    ],
    highlight: 'Pacotes mensais com desconto',
    color: '#40d9c8',
  },
  {
    emoji: '🛁',
    title: 'Banho & Tosa',
    desc: 'Banho humanizado sem gaiolinha. No dia do check-out, seu pet sai limpinho e cheiroso!',
    prices: ['Consulte valores por porte'],
    highlight: 'Disponível no dia do check-out',
    color: '#ffa8a8',
  },
]

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.services}>
      <div className={styles.services__inner}>
        <motion.div
          className={styles.services__header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.services__kicker}>🐾 Nossos Serviços</span>
          <h2 className={styles.services__title}>Cuidado completo para o seu pet</h2>
          <p className={styles.services__subtitle}>
            Tudo que o seu animalzinho precisa em um só lugar, com muito carinho e profissionalismo.
          </p>
        </motion.div>

        <div className={styles.services__grid}>
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className={styles.services__card}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ '--card-accent': s.color } as React.CSSProperties}
            >
              <div className={styles.services__cardEmoji}>{s.emoji}</div>
              <h3 className={styles.services__cardTitle}>{s.title}</h3>
              <p className={styles.services__cardDesc}>{s.desc}</p>
              <ul className={styles.services__priceList}>
                {s.prices.map((p) => (
                  <li key={p}>
                    <span className={styles.services__priceDot} />
                    {p}
                  </li>
                ))}
              </ul>
              <div className={styles.services__highlight}>{s.highlight}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className={styles.services__disclaimer}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          * As diárias podem ter alteração de valor em feriados.
        </motion.p>
      </div>
    </section>
  )
}
