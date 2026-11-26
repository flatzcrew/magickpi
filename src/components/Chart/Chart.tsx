import { useId } from 'react'
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { Icon } from '../Icon'
import { TopNav } from '../TopNav'
import type { TopNavOption } from '../TopNav'
import styles from './Chart.module.css'

/**
 * Chart — карточка-график дашборда. Figma: кит, `Chart` `16187:3670` (одиночный, без свойств).
 * Статичная разметка: линия строится из `data` в SVG, без графических библиотек.
 */
export interface ChartAction {
  'aria-label': string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

/** Демо-ряд — форма линии из кита (точки излома вектора, 0 — низ, 100 — верх). */
export const DEMO_CHART_DATA: readonly number[] = [0, 17, 21, 13, 17, 49, 66, 57, 58, 55, 38, 44, 81, 96, 88]

/** Периоды — Top-nav sm из кита. */
export const DEMO_CHART_PERIODS: TopNavOption[] = ['1H', '1D', '1W', '1M', '3M', 'YTD', 'All'].map((p) => ({
  value: p,
  label: p,
}))

export interface ChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** Label — подпись метрики (с Icons / Info). */
  label?: ReactNode
  labelIcon?: string | false
  /** Primary — значение. */
  value?: ReactNode
  /** Изменение рядом со значением, Text/success-med-em. */
  change?: ReactNode
  /** Значения ряда; масштабируются по min / max в высоту графика. */
  data?: readonly number[]
  /** Периоды переключателя под графиком; пустой массив скрывает Nav-wrap. */
  periods?: TopNavOption[]
  period?: string
  onPeriodChange?: (value: string) => void
  /** Feature-icon tertiary xs; `false` скрывает. */
  featureIcon?: string | false
  action?: ChartAction
}

/** Холст линии (единицы viewBox) — как у вектора в ките. */
const W = 355
const H = 160
const PAD = 1.5

function toPoints(data: readonly number[]) {
  if (data.length === 0) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = data.length > 1 ? (W - PAD * 2) / (data.length - 1) : 0
  return data
    .map((v, i) => {
      const x = PAD + i * step
      const y = PAD + (1 - (v - min) / span) * (H - PAD * 2)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

export function Chart({
  label = 'Total earnings:',
  labelIcon = 'info',
  value = '$226.88',
  change = '+24%',
  data = DEMO_CHART_DATA,
  periods = DEMO_CHART_PERIODS,
  period,
  onPeriodChange,
  featureIcon = 'arrow-right-up',
  action,
  className,
  ...rest
}: ChartProps) {
  const gradientId = useId()
  const feature = featureIcon ? <FeatureIcon type="tertiary" size="xs" icon={featureIcon} /> : null
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.textWrap}>
            {label != null && (
              <span className={styles.label}>
                {labelIcon && <Icon name={labelIcon} size={16} />}
                <span className="ui-body-1-medium">{label}</span>
              </span>
            )}
            <div className={styles.primary}>
              <span className={[styles.value, 'ui-heading-2-medium'].join(' ')}>{value}</span>
              {change != null && <span className={[styles.change, 'ui-title-1-semibold'].join(' ')}>{change}</span>}
            </div>
          </div>
          {feature &&
            (action ? (
              <button type="button" className={styles.action} aria-label={action['aria-label']} onClick={action.onClick}>
                {feature}
              </button>
            ) : (
              feature
            ))}
        </div>

        <div className={styles.chartWrap}>
          <div className={styles.chart}>
            <svg className={styles.plot} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0" className={styles.stop} />
                  <stop offset="1" className={styles.stop} />
                </linearGradient>
              </defs>
              <polyline
                className={styles.line}
                points={toPoints(data)}
                stroke={`url(#${gradientId})`}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {periods.length > 0 && (
              <div className={styles.navWrap}>
                <TopNav
                  size="sm"
                  items={periods}
                  value={period ?? periods[0]?.value}
                  onChange={onPeriodChange}
                  className={styles.nav}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
