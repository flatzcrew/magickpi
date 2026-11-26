import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './ScaleChart.module.css'

/**
 * ScaleChart — ступенчатый график шкалы: как выполнение превращается в результат.
 * Figma: kpi-bro · web, ext `ScaleChart` `209:1144` (Marker: show 209:1097 · hide 209:1121), сверено 2026-11-26.
 * Шкала демо-ТЗ не параметризована (как в Figma): до 80 → 0; 80…105 → равно выполнению; от 105 → 117,5.
 * Ось X 0…130%, ось Y 0…120%. Marker=hide — когда факта нет.
 */
export type ScaleChartMarker = 'show' | 'hide'

/** Геометрия Plot 560 × 224 из Figma (координаты — числами, переменных нет). */
const X0 = 44
const X_MAX = 544
const Y0 = 180
const Y_TOP = 8
const xAt = (pct: number) => X0 + ((X_MAX - X0) * pct) / 130
const yAt = (pct: number) => Y0 - ((Y0 - Y_TOP) * pct) / 120

/** Результат по выполнению — ступени демо-шкалы ТЗ. */
export function scaleResult(fact: number) {
  if (fact < 80) return 0
  if (fact <= 105) return fact
  return 117.5
}

const STEP = [
  [0, 0],
  [80, 0],
  [80, 80],
  [105, 105],
  [105, 117.5],
  [130, 117.5],
]
  .map(([x, y], i) => `${i ? 'L' : 'M'}${xAt(x)} ${yAt(y)}`)
  .join(' ')

const Y_TICKS: Array<[number, string]> = [
  [0, '0'],
  [80, '80'],
  [117.5, '117,5'],
]
const X_TICKS: Array<[number, string]> = [
  [0, '0%'],
  [80, '80%'],
  [105, '105%'],
]

export interface ScaleChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Marker: show · hide */
  marker?: ScaleChartMarker
  /** you — подпись маркера, 1 строка. */
  you?: ReactNode
  /** Выполнение для позиции маркера, % (в Figma — override x/y у Marker; в мастере 82). */
  fact?: number
}

export function ScaleChart({ marker = 'show', you = 'Вы здесь: 82%', fact = 82, className, ...rest }: ScaleChartProps) {
  const mx = xAt(Math.min(Math.max(fact, 0), 130))
  const my = yAt(scaleResult(fact))
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <span className={[styles.axisTitle, 'ui-caption-1-medium'].join(' ')}>Результат, %</span>
      <div className={styles.plot}>
        <svg className={styles.svg} viewBox="0 0 560 224" aria-hidden>
          <line className={styles.grid} x1={X0} x2={X_MAX} y1={yAt(80)} y2={yAt(80)} />
          <line className={styles.grid} x1={X0} x2={X_MAX} y1={yAt(117.5)} y2={yAt(117.5)} />
          <line className={styles.threshold} x1={xAt(80)} x2={xAt(80)} y1={Y_TOP} y2={Y0} />
          <line className={styles.threshold} x1={xAt(105)} x2={xAt(105)} y1={Y_TOP} y2={Y0} />
          <line className={styles.axis} x1={X0} x2={X_MAX} y1={Y0} y2={Y0} />
          <line className={styles.axis} x1={X0} x2={X0} y1={Y_TOP} y2={Y0} />
          <path className={styles.step} d={STEP} />
          {marker === 'show' && (
            <g>
              <line className={styles.drop} x1={mx} x2={mx} y1={my} y2={Y0} />
              <circle className={styles.dot} cx={mx} cy={my} r={7} />
            </g>
          )}
        </svg>
        {Y_TICKS.map(([v, t]) => (
          <span
            key={t}
            className={[styles.yTick, 'ui-caption-1-medium'].join(' ')}
            style={{ '--sc-y': `${yAt(v)}px` } as CSSProperties}
          >
            {t}
          </span>
        ))}
        {X_TICKS.map(([v, t]) => (
          <span
            key={t}
            className={[styles.xTick, 'ui-caption-1-medium'].join(' ')}
            style={{ '--sc-x': `${xAt(v)}px` } as CSSProperties}
          >
            {t}
          </span>
        ))}
        <span className={[styles.xTickEnd, 'ui-caption-1-medium'].join(' ')}>130%</span>
        <span className={[styles.xTitle, 'ui-caption-1-medium'].join(' ')}>Выполнение, %</span>
        {marker === 'show' && (
          <span
            className={[styles.label, 'ui-caption-2-medium'].join(' ')}
            style={{ '--sc-x': `${mx}px`, '--sc-y': `${my}px` } as CSSProperties}
          >
            {you}
          </span>
        )}
      </div>
    </div>
  )
}
