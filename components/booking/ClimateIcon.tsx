import type { ClimateIcon as ClimateIconType } from '@/lib/climate'
import styles from './ClimateIcon.module.css'

interface Props {
  icon: ClimateIconType
  className?: string
  'aria-label'?: string
}

const ICON_MAP: Record<ClimateIconType, string> = {
  sun: '☀',
  cloud: '☁',
  rain: '☂',
}

const LABEL_MAP: Record<ClimateIconType, string> = {
  sun: 'Sol',
  cloud: 'Nublado',
  rain: 'Chuva',
}

export default function ClimateIcon({ icon, className, 'aria-label': ariaLabel }: Props) {
  return (
    <span
      className={`${styles['climate-icon']} ${styles[`climate-icon--${icon}`]} ${className ?? ''}`}
      aria-label={ariaLabel || `Ícone de clima ${LABEL_MAP[icon]}`}
      role="img"
    >
      <span className={styles['climate-icon__glyph']} aria-hidden="true">
        {ICON_MAP[icon]}
      </span>
    </span>
  )
}
