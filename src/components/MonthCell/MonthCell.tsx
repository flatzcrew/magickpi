import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Status } from '../Status'
import styles from './MonthCell.module.css'

/**
 * MonthCell — ячейка месяца в поповере выбора периода (сетка 4 × 3).
 * Figma: kpi-bro · web, ext `MonthCell` `226:1029` (9 ячеек), сверено 2026-11-26.
 * Period=open — точка Status success в правом верхнем углу. future не кликабелен (только disabled).
 * На экранах не используется (SCR-10 на Datepicker, решение 2026-11-25), в ДС остаётся.
 */
export type MonthCellPeriod = 'closed' | 'open' | 'future'
export type MonthCellState = 'default' | 'hover' | 'focus' | 'selected' | 'disabled'

export interface MonthCellProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** Period: closed · open · future */
  period?: MonthCellPeriod
  /** State: default · hover · focus · selected (closed / open) · disabled (future) — принудительно для каталога. */
  state?: MonthCellState
  /** Выбранный месяц (= State selected). */
  selected?: boolean
  /** month — короткое название, 3 буквы («Янв»…«Дек»). */
  month?: ReactNode
  htmlType?: 'button' | 'submit' | 'reset'
}

export function MonthCell({
  period = 'closed',
  state,
  selected,
  month = 'Ноя',
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: MonthCellProps) {
  const isFuture = period === 'future'
  const isDisabled = isFuture || disabled || state === 'disabled'
  const isSelected = !isDisabled && (selected ?? state === 'selected')
  const dataState = isDisabled ? 'disabled' : isSelected ? 'selected' : state
  return (
    <button
      {...rest}
      type={htmlType}
      disabled={isDisabled}
      aria-pressed={isSelected}
      data-state={dataState}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <span className={[styles.month, 'ui-body-1-medium'].join(' ')}>{month}</span>
      {period === 'open' && (
        <span className={styles.openMark}>
          <Status type="success" />
        </span>
      )}
    </button>
  )
}
