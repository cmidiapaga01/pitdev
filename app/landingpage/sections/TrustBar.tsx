'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './TrustBar.module.css'

function useAnimatedCounter(target: number, duration = 1800, isVisible: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    let startTime: number
    let animFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [target, duration, isVisible])

  return count
}

function StatItem({
  target,
  suffix,
  label,
  emoji,
  isVisible,
}: {
  target: number
  suffix: string
  label: string
  emoji: string
  isVisible: boolean
}) {
  const count = useAnimatedCounter(target, 2000, isVisible)
  return (
    <div className={styles.trustItem}>
      <div className={styles.trustEmoji}>{emoji}</div>
      <div className={styles.trustNumber}>
        {count.toLocaleString('pt-BR')}
        {suffix}
      </div>
      <div className={styles.trustLabel}>{label}</div>
    </div>
  )
}

const stats = [
  { target: 1000, suffix: '+', label: 'Pets hospedados', emoji: '🐾' },
  { target: 5, suffix: '.0', label: 'Avaliação Google', emoji: '⭐' },
  { target: 2019, suffix: '', label: 'Fundado em', emoji: '🏠' },
  { target: 24, suffix: 'h', label: 'Cuidado contínuo', emoji: '❤️' },
]

export default function TrustBar() {
  const trustRef = useRef<HTMLElement>(null)
  const trustInView = useInView(trustRef, { once: true, margin: '-100px' })

  return (
    <section ref={trustRef} className={styles.trustBar}>
      <div className={styles.trustGrid}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={trustInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <StatItem
              target={s.target}
              suffix={s.suffix}
              label={s.label}
              emoji={s.emoji}
              isVisible={trustInView}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
