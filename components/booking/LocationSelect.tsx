'use client'

import { allHotels } from '@/lib/hotels'
import styles from './LocationSelect.module.css'

export default function LocationSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className={styles['location-select']}>
      <label htmlFor="location" className={styles['location-select__label']}>
        Hotel
      </label>
      <select
        id="location"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles['location-select__input']}
        aria-label="Selecione o hotel"
      >
        <option value="">Selecione o hotel</option>
        {allHotels.map((hotel) => (
          <option key={hotel.url} value={hotel.url}>
            {hotel.name}
          </option>
        ))}
      </select>
    </div>
  )
}
