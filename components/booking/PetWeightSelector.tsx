'use client'

import { WEIGHT_TIERS } from '@/lib/pricing'
import type { PetWeight } from '@/types/booking'
import styles from './PetWeightSelector.module.css'

interface Props {
  value: PetWeight
  onChange: (w: PetWeight) => void
  highlight?: boolean
}

const TIER_ICONS = ['🐾', '🐕', '🐕‍🦺', '🦣']

export default function PetWeightSelector({ value, onChange, highlight }: Props) {
  return (
    <div
      className={`${styles.selector} ${highlight ? styles['selector--highlight'] : ''}`}
      role="group"
      aria-label="Peso do pet"
    >
      <p className={styles.label}>Porte do pet</p>

      <div className={styles.grid}>
        {WEIGHT_TIERS.map((tier, index) => {
          const isSelected = value.tier === index
          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange({ tier: index as PetWeight['tier'] })}
              className={`${styles.card} ${isSelected ? styles['card--selected'] : ''}`}
              aria-pressed={isSelected}
              aria-label={`${tier.label} — ${tier.detail}`}
            >
              <span className={styles.card__icon} aria-hidden="true">
                {TIER_ICONS[index]}
              </span>
              <span className={styles.card__name}>{tier.label}</span>
              <span className={styles.card__detail}>{tier.detail}</span>
              <span className={styles.card__price}>
                {tier.surcharge === 0 ? 'incluído' : `+R$${tier.surcharge}/noite`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
