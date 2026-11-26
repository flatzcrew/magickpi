import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'
import { KpiStatus } from '../KpiStatus'
import type { KpiStatusStatus } from '../KpiStatus'
import styles from './KpiCard.module.css'

/**
 * KpiCard — группа KPI в краткой матрице в колонке. Figma: kpi-bro · web, ext `KpiCard` `171:1251` (State 4 ячейки), сверено 2026-11-26.
 * Checkbox sm · Content [Head: Name, Sub · Stats: Вес · План · Факт] · Right [KpiStatus Type=1 · Icon-button tertiary md ↗].
 * Полная таблица KPI — MatrixRow.
 */
export type KpiCardState = 'default' | 'hover' | 'focus' | 'selected'

export interface KpiCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** State: default · hover · focus · selected — принудительно для каталога; hover / focus — нативно. */
  state?: KpiCardState
  /** Выбрана (= State selected, Checkbox отмечен). */
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** name — до 2 строк. */
  name?: ReactNode
  /** sub */
  sub?: ReactNode
  /** weight / plan / fact — значения строки Stats (подписи «Вес: / План: / Факт:» — в компоненте). */
  weight?: ReactNode
  plan?: ReactNode
  fact?: ReactNode
  /** Статус — вариант вложенного KpiStatus Type=1. */
  status?: KpiStatusStatus
  /** ↗ — переход в полную матрицу. */
  onOpen?: MouseEventHandler<HTMLButtonElement>
}

export function KpiCard({
  state,
  selected,
  onSelectedChange,
  name = 'Осенние продажи',
  sub = 'KPI внутри: 3',
  weight = '70%',
  plan = '921 200 000',
  fact = '41 980 000',
  status = 'progress',
  onOpen,
  className,
  tabIndex = 0,
  ...rest
}: KpiCardProps) {
  const isSelected = selected ?? state === 'selected'
  const stats: Array<[string, ReactNode]> = [
    ['Вес:', weight],
    ['План:', plan],
    ['Факт:', fact],
  ]
  return (
    <div
      {...rest}
      tabIndex={tabIndex}
      data-state={isSelected ? 'selected' : state}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <Checkbox
        size="sm"
        /* Figma: в State=selected Checkbox = checked-pressed (решение дизайнера 2026-11-21 — оставить как есть). */
        state={state === 'selected' ? 'checked-pressed' : undefined}
        checked={isSelected}
        onChange={onSelectedChange ? (e) => onSelectedChange(e.target.checked) : undefined}
        readOnly={!onSelectedChange}
        aria-label="Выбрать"
      />
      <div className={styles.content}>
        <div className={styles.head}>
          <span className={[styles.name, 'ui-title-1-semibold'].join(' ')}>{name}</span>
          <span className={[styles.sub, 'ui-caption-2-normal'].join(' ')}>{sub}</span>
        </div>
        <div className={[styles.stats, 'ui-caption-2-normal'].join(' ')}>
          {stats.map(([label, value], i) => (
            <span key={label} className={styles.statGroup}>
              {i > 0 && <span className={styles.dot}>·</span>}
              <span className={styles.stat}>
                <span className={styles.statLabel}>{label}</span> {value}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <KpiStatus status={status} type="1" />
        <IconButton type="tertiary" size="md" icon="arrow-right-up" aria-label="Открыть матрицу" onClick={onOpen} />
      </div>
    </div>
  )
}
