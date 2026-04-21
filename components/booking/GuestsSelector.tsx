'use client'

import type { Guests } from '@/types/booking'
import { trackGuestsInteraction } from '@/lib/gtm'
import styles from './GuestsSelector.module.css'
import { useGuestsSelector } from './useGuestsSelector'

interface Props {
  value: Guests
  onChange: (guests: Guests) => void
  highlight?: boolean
}

export default function GuestsSelector({ value, onChange, highlight }: Props) {
  const { rooms, update } = useGuestsSelector({ value, onChange })

  return (
    <div
      className={`${styles['inline-panel']} ${highlight ? styles['inline-panel--highlight'] : ''}`}
    >
      <RoomControls rooms={rooms} update={update} />
    </div>
  )
}

function RoomControls({
  rooms,
  update,
}: {
  rooms: ReturnType<typeof useGuestsSelector>['rooms']
  update: ReturnType<typeof useGuestsSelector>['update']
}) {
  const getSummary = () => {
    const adults = rooms.reduce((sum, room) => sum + room.adults, 0)
    const children = rooms.reduce((sum, room) => sum + room.children, 0)

    return {
      rooms: rooms.length,
      adults,
      children,
    }
  }

  return (
    <>
      <div className={styles['inline__headers']}>
        <div />
        <div className={styles['inline__header-col']}>Quarto</div>
        <div className={styles['inline__header-col']}>Adultos</div>
        <div className={styles['inline__header-col']}>Crianças</div>
      </div>

      {rooms.map((room, index) => (
        <div className={styles['inline__room-row']} key={room.id}>
          <div>
            {/* {index > 0 && rooms.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const summary = getSummary()
                  trackGuestsInteraction({
                    action: 'room_remove',
                    rooms: summary.rooms,
                    adults: summary.adults,
                    children: summary.children,
                  })
                  removeRoom(room.id)
                }}
                className={styles['modal__remove-room']}
                aria-label={`Remover quarto ${index + 1}`}
              >
                ×
              </button>
            )} */}
          </div>

          <div className={styles['inline__room-label']}>Quarto {index + 1}</div>

          <div className={styles['modal__controls']}>
            <button
              type="button"
              onClick={() => {
                const summary = getSummary()
                trackGuestsInteraction({
                  action: 'adults_decrease',
                  rooms: summary.rooms,
                  adults: summary.adults,
                  children: summary.children,
                })
                update(room.id, 'adults', -1)
              }}
              className={styles['modal__btn']}
              disabled={room.adults <= 1}
              aria-label={`Diminuir adultos do quarto ${index + 1}`}
            >
              -
            </button>
            <span className={styles['modal__value']}>{room.adults}</span>
            <button
              type="button"
              onClick={() => {
                const summary = getSummary()
                trackGuestsInteraction({
                  action: 'adults_increase',
                  rooms: summary.rooms,
                  adults: summary.adults,
                  children: summary.children,
                })
                update(room.id, 'adults', 1)
              }}
              className={styles['modal__btn']}
              aria-label={`Aumentar adultos do quarto ${index + 1}`}
            >
              +
            </button>
          </div>

          <div className={styles['modal__controls']}>
            <button
              type="button"
              onClick={() => {
                const summary = getSummary()
                trackGuestsInteraction({
                  action: 'children_decrease',
                  rooms: summary.rooms,
                  adults: summary.adults,
                  children: summary.children,
                })
                update(room.id, 'children', -1)
              }}
              className={styles['modal__btn']}
              disabled={room.children <= 0}
              aria-label={`Diminuir crianças do quarto ${index + 1}`}
            >
              -
            </button>
            <span className={styles['modal__value']}>{room.children}</span>
            <button
              type="button"
              onClick={() => {
                const summary = getSummary()
                trackGuestsInteraction({
                  action: 'children_increase',
                  rooms: summary.rooms,
                  adults: summary.adults,
                  children: summary.children,
                })
                update(room.id, 'children', 1)
              }}
              className={styles['modal__btn']}
              aria-label={`Aumentar crianças do quarto ${index + 1}`}
            >
              +
            </button>
          </div>
        </div>
      ))}

      {/* <button
        type="button"
        onClick={() => {
          const summary = getSummary()
          trackGuestsInteraction({
            action: 'room_add',
            rooms: summary.rooms,
            adults: summary.adults,
            children: summary.children,
          })
          addRoom()
        }}
        className={styles['modal__add-room']}
      >
        <span className={styles['modal__add-room-icon']}>+</span>
        <span className={styles['modal__add-room-text']}>Adicionar Quarto</span>
      </button> */}
    </>
  )
}
