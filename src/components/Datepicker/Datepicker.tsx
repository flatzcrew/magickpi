import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { Button } from '../Button'
import { DividerHorizontal } from '../DividerHorizontal'
import { IconButton } from '../IconButton'
import { InputField } from '../InputField'
import { SidebarItem } from '../SidebarItem'
import styles from './Datepicker.module.css'

/** Datepicker — календарь выбора даты или периода. Figma: кит, `Datepicker` `14131:86649`. */
export type DatepickerType = 'range' | 'single' | 'single-sm'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DatepickerShortcut {
  value: string
  label: ReactNode
}

/** Тексты кита (англ.) — дефолты; для экранов передаются русские. */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Демо-значения кита: single — сентябрь 2025; range — 07.08.2025 — 12.09.2025, шорткаты Today…All time. */
const DEMO_DATE = new Date(2025, 8, 17)
const DEMO_RANGE: DateRange = { start: new Date(2025, 7, 7), end: new Date(2025, 8, 12) }
const DEMO_SHORTCUTS: DatepickerShortcut[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '14d', label: 'Last 14 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: 'all', label: 'All time' },
]

export interface DatepickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** ☘️ Type: range (два месяца + шорткаты + поля дат) · single (крупная дата сверху) · single-sm (компактные ячейки 32 + поле даты) */
  type?: DatepickerType
  /** single / single-sm: выбранная дата (контролируемо). */
  value?: Date | null
  /** single / single-sm: начальная дата без контроля (по умолчанию демо 17.09.2025). */
  defaultValue?: Date | null
  onChange?: (value: Date) => void
  /** range: выбранный период (контролируемо). */
  range?: DateRange
  /** range: начальный период без контроля (по умолчанию демо 07.08 — 12.09.2025). */
  defaultRange?: DateRange
  onRangeChange?: (range: DateRange) => void
  /** Первый показанный месяц (любой день месяца). По умолчанию — месяц значения. */
  month?: Date
  onMonthChange?: (month: Date) => void
  /** range, ✅ Shortcuts: список быстрых периодов слева; `false` скрывает. */
  shortcuts?: DatepickerShortcut[] | false
  shortcut?: string
  onShortcutChange?: (value: string) => void
  /** single-sm, ✅ Date-field: поле с датой над кнопками. */
  dateField?: boolean
  /** Тексты: названия месяцев / дней недели (с воскресенья), кнопки. */
  monthNames?: string[]
  weekdayNames?: string[]
  weekdayShortNames?: string[]
  cancelLabel?: ReactNode
  applyLabel?: ReactNode
  onCancel?: () => void
  onApply?: () => void
}

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate())
const dayKey = (d: Date) => d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate()
const pad = (n: number) => String(n).padStart(2, '0')
const formatDate = (d: Date | null | undefined) =>
  d ? `${pad(d.getDate())} / ${pad(d.getMonth() + 1)} / ${d.getFullYear()}` : ''

/** Сетка месяца с воскресенья: целые недели, дни соседних месяцев — «вне месяца». */
function monthGrid(month: Date) {
  const first = startOfMonth(month)
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay())
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  const total = Math.ceil((first.getDay() + last.getDate()) / 7) * 7
  return Array.from({ length: total }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

export function Datepicker({
  type = 'range',
  value,
  defaultValue = DEMO_DATE,
  onChange,
  range,
  defaultRange = DEMO_RANGE,
  onRangeChange,
  month,
  onMonthChange,
  shortcuts = DEMO_SHORTCUTS,
  shortcut,
  onShortcutChange,
  dateField = true,
  monthNames = MONTHS,
  weekdayNames = WEEKDAYS,
  weekdayShortNames = WEEKDAYS_SHORT,
  cancelLabel = 'Cancel',
  applyLabel = 'Apply',
  onCancel,
  onApply,
  className,
  ...rest
}: DatepickerProps) {
  const isRange = type === 'range'
  const [innerValue, setInnerValue] = useState<Date | null>(defaultValue)
  const [innerRange, setInnerRange] = useState<DateRange>(defaultRange)
  const selected = value !== undefined ? value : innerValue
  const period = range ?? innerRange
  const anchor = (isRange ? period.start : selected) ?? new Date()
  const [innerMonth, setInnerMonth] = useState<Date>(startOfMonth(anchor))
  const viewMonth = month ? startOfMonth(month) : innerMonth
  const [innerShortcut, setInnerShortcut] = useState<string | undefined>(shortcuts ? shortcuts[0]?.value : undefined)
  const currentShortcut = shortcut ?? innerShortcut

  const shiftMonth = (n: number) => {
    const next = addMonths(viewMonth, n)
    setInnerMonth(next)
    onMonthChange?.(next)
  }

  const pick = (d: Date) => {
    if (!isRange) {
      setInnerValue(d)
      onChange?.(d)
      return
    }
    let next: DateRange
    if (!period.start || period.end) next = { start: d, end: null }
    else if (dayKey(d) < dayKey(period.start)) next = { start: d, end: period.start }
    else next = { start: period.start, end: d }
    setInnerRange(next)
    onRangeChange?.(next)
  }

  const cellSize = type === 'single-sm' ? 'sm' : 'md'

  const renderMonthHeader = (m: Date) => (
    <div className={styles.monthYear}>
      <IconButton type="tertiary" size="sm" icon="chevron-left" aria-label="Предыдущий месяц" onClick={() => shiftMonth(-1)} />
      <span className={[styles.info, 'ui-para-medium'].join(' ')}>
        <span className={styles.monthName}>{monthNames[m.getMonth()]}</span>
        <span className={styles.year}>{m.getFullYear()}</span>
      </span>
      <IconButton type="tertiary" size="sm" icon="chevron-right" aria-label="Следующий месяц" onClick={() => shiftMonth(1)} />
    </div>
  )

  const renderDays = (m: Date) => {
    const days = monthGrid(m)
    const s = period.start ? dayKey(period.start) : null
    const e = period.end ? dayKey(period.end) : null
    return (
      <>
        <div className={[styles.weekdays, 'ui-caption-1-medium'].join(' ')} aria-hidden>
          {weekdayShortNames.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
        <DividerHorizontal align="center" ends="rounded" />
        <div className={styles.grid} role="grid" aria-label={`${monthNames[m.getMonth()]} ${m.getFullYear()}`}>
          {days.map((d, i) => {
            const outside = d.getMonth() !== m.getMonth()
            const k = dayKey(d)
            const col = i % 7
            let isSel = false
            let edge: 'start' | 'end' | 'single' | null = null
            let inRange = false
            if (isRange) {
              if (!outside && s !== null && k === s) edge = e === null || e === s ? 'single' : 'start'
              else if (!outside && e !== null && k === e) edge = 'end'
              else if (!outside && s !== null && e !== null && k > s && k < e) inRange = true
              isSel = edge !== null
            } else {
              isSel = !outside && sameDay(d, selected)
            }
            const rowStart = col === 0 || d.getDate() === 1
            const rowEnd = col === 6 || new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getMonth() !== d.getMonth()
            const button = (
              <Button
                type={isSel ? 'primary' : 'flat'}
                size={cellSize}
                aria-pressed={isSel}
                aria-label={`${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`}
                onClick={() => pick(d)}
                className={[
                  styles.day,
                  outside && styles.outside,
                  inRange && styles.inRange,
                  inRange && rowStart && styles.rowStart,
                  inRange && rowEnd && styles.rowEnd,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {d.getDate()}
              </Button>
            )
            return edge && edge !== 'single' ? (
              <span key={k} className={[styles.edge, styles[`edge-${edge}`]].join(' ')}>
                {button}
              </span>
            ) : (
              <span key={k} className={styles.cell}>
                {button}
              </span>
            )
          })}
        </div>
      </>
    )
  }

  const ctas = (
    <div className={[styles.ctas, !isRange && styles.ctasFill].filter(Boolean).join(' ')}>
      <Button type="secondary" size="md" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="primary" size="md" onClick={onApply}>
        {applyLabel}
      </Button>
    </div>
  )

  return (
    <div {...rest} className={[styles.root, styles[type], className].filter(Boolean).join(' ')}>
      <div className={styles.body}>
        {isRange ? (
          <div className={styles.rangeWrap}>
            {shortcuts && (
              <div className={styles.shortcuts}>
                <div className={styles.shortcutNav}>
                  {shortcuts.map((sc) => (
                    <SidebarItem
                      key={sc.value}
                      size="sm"
                      type={sc.value === currentShortcut ? 'active-tertiary' : 'inactive'}
                      onClick={() => {
                        setInnerShortcut(sc.value)
                        onShortcutChange?.(sc.value)
                      }}
                    >
                      {sc.label}
                    </SidebarItem>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.datesWrap}>
              {[viewMonth, addMonths(viewMonth, 1)].map((m) => (
                <div key={m.getTime()} className={styles.dates}>
                  {renderMonthHeader(m)}
                  {renderDays(m)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {renderMonthHeader(viewMonth)}
            <div className={styles.wrap}>
              {type === 'single' && selected && (
                <div className={styles.display}>
                  <span className={[styles.displayDay, 'ui-display-1-normal'].join(' ')}>{selected.getDate()}</span>
                  <span className={[styles.displayDash, 'ui-heading-5-normal'].join(' ')}>-</span>
                  <span className={styles.displayMonth}>
                    <span className={[styles.displayMonthName, 'ui-heading-1-semibold'].join(' ')}>
                      {monthNames[selected.getMonth()].slice(0, 3)}
                    </span>
                    <span className={[styles.displayWeekday, 'ui-title-1-medium'].join(' ')}>
                      {weekdayNames[selected.getDay()]}
                    </span>
                  </span>
                </div>
              )}
              <div className={styles.dates}>{renderDays(viewMonth)}</div>
            </div>
          </>
        )}

        <DividerHorizontal align="center" ends="rounded" />

        <div className={styles.footer}>
          {isRange && (
            <div className={styles.fields}>
              <InputField className={styles.field} readOnly value={formatDate(period.start)} aria-label="Начало периода" />
              <span className={[styles.dash, 'ui-body-1-medium'].join(' ')}>—</span>
              <InputField className={styles.field} readOnly value={formatDate(period.end)} aria-label="Конец периода" />
            </div>
          )}
          {type === 'single-sm' && dateField && (
            <InputField readOnly value={formatDate(selected)} rightIcon="calender" aria-label="Дата" />
          )}
          {ctas}
        </div>
      </div>
    </div>
  )
}
