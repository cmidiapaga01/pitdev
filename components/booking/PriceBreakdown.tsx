'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { PriceSummary } from '@/lib/pricing'
import styles from './PriceBreakdown.module.css'

interface Props {
  pricing: PriceSummary
}

export default function PriceBreakdown({ pricing }: Props) {
  const { nights, subtotal, weightLabel, weightDetail } = pricing

  return (
    <div className={styles.breakdown} aria-label="Detalhamento do preço">
      <div className={styles.header}>
        <span className={styles.header__title}>Detalhamento</span>
        <span className={styles.header__weight}>
          {weightLabel} <span className={styles.header__weightDetail}>({weightDetail})</span>
        </span>
      </div>

      <ul className={styles.list}>
        {nights.map((night, i) => (
          <li key={i} className={styles.row}>
            <span className={styles.row__date}>
              {format(night.date, 'EEE, d MMM', { locale: ptBR })}
            </span>
            <span className={`${styles.row__badge} ${night.isWeekend ? styles['row__badge--weekend'] : styles['row__badge--weekday']}`}>
              {night.isWeekend ? 'fim de sem.' : 'semana'}
            </span>
            <span className={styles.row__calc}>
              R${night.basePrice}
              {night.surcharge > 0 && (
                <span className={styles.row__surcharge}> +R${night.surcharge}</span>
              )}
            </span>
            <span className={styles.row__total}>R${night.total}</span>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className={styles.footer__label}>{nights.length} noite{nights.length !== 1 ? 's' : ''}</span>
        <span className={styles.footer__total}>R$ {subtotal.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}
