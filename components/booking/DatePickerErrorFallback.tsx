'use client'

import styles from './DateRangePickerMobile.module.css'

interface Props {
  onRetry: () => void
  error?: string
}

export default function DatePickerErrorFallback({
  onRetry,
  error = 'Componente temporariamente indisponível',
}: Props) {
  return (
    <div className={styles['date-picker-error']}>
      <p>{error}</p>
      <button
        onClick={onRetry}
        className={styles['date-picker-error__retry']}
        type="button"
        aria-label="Tentar novamente"
      >
        Tentar novamente
      </button>
    </div>
  )
}
