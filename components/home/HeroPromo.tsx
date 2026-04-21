import Link from 'next/link'
import styles from './HeroPromo.module.css'

interface Props {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  image: string
  imageAlt?: string
}

export default function HeroPromo({ title, subtitle, ctaText, ctaLink }: Props) {
  return (
    <section className={styles['hero-promo']}>
      <div className={styles['hero-promo__inner']}>
        {/* Decorative paw prints */}
        <span className={styles['hero-promo__paw']} aria-hidden="true">🐾</span>
        <span className={styles['hero-promo__paw2']} aria-hidden="true">🐾</span>

        <div className={styles['hero-promo__container']}>
          <div className={styles['hero-promo__content']}>
            <h2 className={styles['hero-promo__title']}>{title}</h2>
            <p className={styles['hero-promo__subtitle']}>{subtitle}</p>
            <Link href={ctaLink} className={styles['hero-promo__cta']}>
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
