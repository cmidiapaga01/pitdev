'use client'

import styles from './DateRangePickerMobile.module.css'

export default function DatePickerSkeleton() {
  return (
    <div className={styles['date-picker-skeleton']}>
      <div className={styles['date-picker-skeleton__trigger']} />
    </div>
  )
}
