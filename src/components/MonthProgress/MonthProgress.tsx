import type { HTMLAttributes, ReactNode } from 'react'
import styles from './MonthProgress.module.css'

/**
 * MonthProgress — прогресс месяца в колонке матрицы сотрудника.
 * Figma: kpi-bro · web, ext `MonthProgress` `174:1319` (Status 4 × Value 5 = 20 ячеек), сверено 2026-11-26.
 * Шаг 25%: закрашено Value/25 из 4 сегментов. Точное значение — в подписи valueText.
 */
export type MonthProgressStatus = 'done' | 'progress' | 'fail' | 'nodata'
export type MonthProgressValue = 0 | 25 | 50 | 75 | 100

export interface MonthProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Status: done · progress · fail · nodata — цвет закрашенных сегментов. */
  status?: MonthProgressStatus
  /** Value (вариант): 0 · 25 · 50 · 75 · 100 — сколько сегментов закрашено. */
  value?: MonthProgressValue
  /** label — подпись слева сверху. */
  label?: ReactNode
  /** value (TEXT в Figma) — подпись «N%» справа сверху; переименована, чтобы не спорить с вариантом Value. */
  valueText?: ReactNode
  /** period — подпись под шкалой. */
  period?: ReactNode
  /** showPeriod */
  showPeriod?: boolean
}

const SEGMENTS = [1, 2, 3, 4] as const

export function MonthProgress({
  status = 'done',
  value = 0,
  label = 'Месячный прогресс',
  valueText = '60%',
  period = 'ноябрь 2026',
  showPeriod = true,
  className,
  ...rest
}: MonthProgressProps) {
  const filled = value / 25
  return (
    <div {...rest} className={[styles.root, styles[status], className].filter(Boolean).join(' ')}>
      <div className={styles.top}>
        <span className={[styles.label, 'ui-body-1-normal'].join(' ')}>{label}</span>
        <span className={[styles.value, 'ui-caption-2-normal'].join(' ')}>{valueText}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        {SEGMENTS.map((n) => (
          <span key={n} className={[styles.seg, n <= filled ? styles.filled : ''].filter(Boolean).join(' ')} />
        ))}
      </div>
      {showPeriod && <span className={[styles.period, 'ui-caption-2-normal'].join(' ')}>{period}</span>}
    </div>
  )
}
