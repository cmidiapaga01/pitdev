'use client'

import React, { useRef, useCallback } from 'react'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import type { DateRange } from '@/types/booking'
// import ClimateIcon from './ClimateIcon'
import { useDateRangePicker } from './useDateRangePicker'
import { useMediaQuery } from './useMediaQuery'
import { trackCalendarApply, trackCalendarOpen } from '@/lib/gtm'
import 'react-day-picker/dist/style.css'
import styles from './DateRangePicker.module.css'

interface Props {
  value: DateRange
  onChange: (dates: DateRange) => void
  onlyCheckInTrigger?: boolean
}

export default function DateRangePicker({ value, onChange, onlyCheckInTrigger = false }: Props) {
  const [closing, setClosing] = React.useState(false)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [validationHint, setValidationHint] = React.useState<string | null>(null)
  React.useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
        @media (min-width: 768px) {
          .DateRangePicker-module__fJcfsW__date-picker-modal__calendar .rdp .rdp-months {
            display: flex !important;
            gap: 30px !important;
          }
        }
      `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 767px)')

  const {
    isOpen,
    draft,
    today,
    isApplied,
    daysCount,
    climateDays,
    formatters,
    isLoading,
    error,
    handleOpen,
    handleClose,
    handleApply,
    handleClear,
    handleSelect,
    handleKeyDown,
  } = useDateRangePicker({ value, onChange })

  const numberOfMonths = isDesktop ? 2 : 1

  /* ==============================
     TRIGGER INICIAL
  ============================== */

  const renderInitialTrigger = () => {
    // Get today's date
    const todayDate = new Date()
    // Get tomorrow's date
    const tomorrowDate = new Date(todayDate)
    tomorrowDate.setDate(todayDate.getDate() + 1)

    return (
      <button
        id="date-picker-trigger"
        type="button"
        onClick={() => {
          trackCalendarOpen({ triggerType: 'initial', hasDates: false })
          handleOpen()
        }}
        className={styles['date-picker']}
        aria-label="Selecionar datas"
      >
        <div className={styles['date-picker__field']}>
          <span className={styles['date-picker__label']}>Check-in</span>
          <span className={styles['date-picker__value']}>{format(todayDate, 'dd/MM/yyyy')}</span>
        </div>
        {!onlyCheckInTrigger && <div className={styles['date-picker__separator']} />}
        {!onlyCheckInTrigger && (
          <div className={styles['date-picker__field']}>
            <span className={styles['date-picker__label']}>Check-out</span>
            <span className={styles['date-picker__value']}>
              {format(tomorrowDate, 'dd/MM/yyyy')}
            </span>
          </div>
        )}
      </button>
    )
  }

  // <button
  //   type="button"
  //   onClick={handleOpen}
  //   className={styles['date-picker']}
  //   aria-label="Selecionar datas"
  // >
  //   <CalendarIcon className={styles['date-picker__icon']} />

  //   <div className={styles['date-picker__text-group']}>
  //     <span className={styles['date-picker__text-label']}>Quando você quer relaxar?</span>
  //     <span className={styles['date-picker__text-value']}>Escolha suas datas</span>
  //   </div>
  // </button>

  /* ==============================
     TRIGGER APLICADO
  ============================== */

  const renderAppliedTrigger = () => (
    <button
      id="date-picker-preview"
      type="button"
      onClick={() => {
        trackCalendarOpen({ triggerType: 'applied', hasDates: true })
        handleOpen()
      }}
      className={styles['date-preview']}
      aria-label="Alterar datas selecionadas"
    >
      <div className={styles['date-preview__range']}>
        {value.from && (
          <div className={styles['date-preview__date']}>
            <span className={styles['date-preview__day-number']}>{format(value.from, 'd')}</span>
            <span className={styles['date-preview__month']}>
              {format(value.from, 'MMM', { locale: ptBR })}
            </span>
          </div>
        )}

        {daysCount > 1 && value.to && (
          <>
            <span className={styles['date-preview__arrow']}>→</span>
            <div className={styles['date-preview__date']}>
              <span className={styles['date-preview__day-number']}>{format(value.to, 'd')}</span>
              <span className={styles['date-preview__month']}>
                {format(value.to, 'MMM', { locale: ptBR })}
              </span>
            </div>
          </>
        )}
      </div>

      {value.from && value.to && (
        <div className={styles['date-preview__range-subtitle']}>
          {formatters.formatWeekRangeLabel(value.from, value.to)}
        </div>
      )}

      {climateDays.length > 0 && (
        <div
          className={`${styles['date-preview__strip']} ${
            styles[`date-preview__strip--${climateDays.length}`]
          }`}
        >
          {climateDays.map((day) => (
            <div key={day.key} className={styles['date-preview__day']}>
              {/* <span className={styles['date-preview__day-label']}>{day.dayLabel}</span> */}

              {/* <span className={styles['date-preview__icon']}>
                <ClimateIcon icon={day.icon} className={styles['date-preview__icon-lottie']} />
              </span>

              <span className={styles['date-preview__temp']}>{day.temp}°</span>

              <span className={styles['date-preview__weekday']}>{day.weekdayShort}</span> */}
            </div>
          ))}
        </div>
      )}
    </button>
  )

  // Handle slide down and delayed close
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sync native <dialog> open/close with React state
  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen || closing) {
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
    }
  }, [isOpen, closing])

  React.useEffect(() => {
    if (isOpen) {
      setClosing(false)
      setShowConfirmation(false)
      setValidationHint(null)
    }
  }, [isOpen])

  // Close on backdrop click (native <dialog> fires click on ::backdrop)
  const handleDialogClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        handleClose()
      }
    },
    [handleClose],
  )

  const handleApplyWithAnimation = async () => {
    // Show confirmation screen first
    setShowConfirmation(true)

    // Wait for animation to show (1.5 seconds for nice effect)
    setTimeout(() => {
      if (isMobile) {
        setShowConfirmation(false)
        trackCalendarApply({
          hasDates: Boolean(draft.from && draft.to),
          daysCount,
        })
        handleApply()
        return
      }

      setClosing(true)
      // Wait for slide down animation (0.3s)
      setTimeout(() => {
        setClosing(false)
        setShowConfirmation(false)
        trackCalendarApply({
          hasDates: Boolean(draft.from && draft.to),
          daysCount,
        })
        handleApply()
      }, 300)
    }, 1500)
  }

  return (
    <>
      <div className={styles['date-picker-wrapper']} onKeyDown={handleKeyDown}>
        {isApplied ? renderAppliedTrigger() : renderInitialTrigger()}
      </div>

      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onCancel={(e) => {
          e.preventDefault()
          handleClose()
        }}
        className={styles['date-picker-modal']}
        aria-label="Selecionar datas"
      >
        <div className={styles['date-picker-modal__container']}>
          <div
            className={
              closing
                ? `${styles['date-picker-modal__panel']} ${styles['slideDown']}`
                : styles['date-picker-modal__panel']
            }
          >
            {showConfirmation ? (
              /* CONFIRMATION SCREEN WITH ANIMATION */
              <div className={styles['date-confirmation']}>
                <div className={styles['date-confirmation__badge']} aria-hidden="true">
                  ✓
                </div>

                <h3 className={styles['date-confirmation__title']}>Datas Selecionadas!</h3>

                <div className={styles['date-confirmation__dates']}>
                  {draft.from && draft.to && (
                    <>
                      <div className={styles['date-confirmation__date-group']}>
                        <div className={styles['date-confirmation__date']}>
                          <span className={styles['date-confirmation__day']}>
                            {format(draft.from, 'd')}
                          </span>
                          <span className={styles['date-confirmation__month']}>
                            {format(draft.from, 'MMM', { locale: ptBR })}
                          </span>
                        </div>
                        <span className={styles['date-confirmation__arrow']}>→</span>
                        <div className={styles['date-confirmation__date']}>
                          <span className={styles['date-confirmation__day']}>
                            {format(draft.to, 'd')}
                          </span>
                          <span className={styles['date-confirmation__month']}>
                            {format(draft.to, 'MMM', { locale: ptBR })}
                          </span>
                        </div>
                      </div>

                      <p className={styles['date-confirmation__subtitle']}>
                        {formatters.formatWeekRangeLabel(draft.from, draft.to)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* CALENDAR SELECTION SCREEN */
              <>
                <h2 className={styles['date-picker-modal__title']}>Selecione as datas</h2>

                {error && (
                  <div className={styles['date-picker-modal__error']} role="alert">
                    {error}
                  </div>
                )}

                <div
                  className={`${styles['date-picker-modal__calendar']} ${draft.from || draft.to ? styles['date-picker-modal__calendar--has-selection'] : ''}`}
                >
                  <DayPicker
                    mode="range"
                    // month={today}
                    today={today}
                    disabled={{ before: today }}
                    selected={{
                      from: draft.from ?? undefined,
                      to: draft.to ?? undefined,
                    }}
                    onSelect={(range) => {
                      setValidationHint(null)
                      handleSelect(range)
                    }}
                    numberOfMonths={numberOfMonths}
                    locale={ptBR}
                    formatters={formatters}
                    fixedWeeks={false}
                    classNames={{
                      root: 'rdp',
                      months: 'rdp-months',
                      month: 'rdp-month',
                      nav: 'rdp-nav',
                      nav_button: 'rdp-nav_button',
                      table: 'rdp-table',
                      head_cell: 'rdp-head_cell',
                      cell: 'rdp-cell',
                      day: 'rdp-day',
                      day_selected: 'rdp-day_selected',
                      day_today: 'rdp-day_today',
                      day_range_start: 'rdp-day_range_start',
                      day_range_end: 'rdp-day_range_end',
                      day_range_middle: 'rdp-day_range_middle',
                      day_disabled: 'rdp-day_disabled',
                    }}
                  />
                </div>

                {(validationHint || (draft.from && !draft.to)) && (
                  <p className={styles['date-picker-modal__hint']}>
                    {validationHint || 'Selecione a data de check-out'}
                  </p>
                )}

                <div className={styles['date-picker-modal__actions']}>
                  <button
                    onClick={() => {
                      if (!draft.from || !draft.to) {
                        setValidationHint(
                          !draft.from ? 'Selecione suas datas' : 'Selecione a data de check-out',
                        )
                        return
                      }
                      if (draft.from.getTime() === draft.to.getTime()) {
                        setValidationHint('Selecione a data de check-out')
                        return
                      }
                      setValidationHint(null)
                      handleApplyWithAnimation()
                    }}
                    disabled={isLoading}
                    className={`${styles['date-picker-modal__btn']} ${styles['date-picker-modal__btn--done']}`}
                  >
                    {isLoading ? 'Aplicando...' : 'OK'}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className={`${styles['date-picker-modal__btn']} ${styles['date-picker-modal__btn--reset']}`}
                  >
                    Limpar
                  </button>

                  <div className={styles['date-picker-modal__actions-right']}>
                    <button
                      onClick={handleClose}
                      disabled={isLoading}
                      className={`${styles['date-picker-modal__btn']} ${styles['date-picker-modal__btn--cancel']}`}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}
