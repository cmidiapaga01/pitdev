import styles from './CalendarIcon.module.css'

interface Props {
  className?: string
}

export default function CalendarIcon({ className }: Props) {
  return (
    <span className={`${styles['calendar-icon']} ${className ?? ''}`}>
      <svg
        className={styles['calendar-icon__svg']}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      </svg>
    </span>
  )
}
