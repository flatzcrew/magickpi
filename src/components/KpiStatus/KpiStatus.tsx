import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './KpiStatus.module.css'

/** KpiStatus — статус выполнения KPI-показателя. Figma: kpi-bro · web, ext `KpiStatus` `164:663`. */
export type KpiStatusStatus = 'done' | 'progress' | 'fail' | 'nodata'
export type KpiStatusType = '1' | '1+1'

/** Подпись и иконка (Icons / Check · History · Cross · Minus) по Status — из Figma. */
const STATUS: Record<KpiStatusStatus, { label: string; icon: string; value: string }> = {
  done: { label: 'выполнен', icon: 'check', value: '100%' },
  progress: { label: 'в процессе', icon: 'history', value: '60%' },
  fail: { label: 'не выполнен', icon: 'cross', value: '0%' },
  nodata: { label: 'нет данных', icon: 'minus', value: '' },
}

export interface KpiStatusProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Status: done · progress · fail · nodata */
  status?: KpiStatusStatus
  /** Type: 1 — один бейдж; 1+1 — бейдж статуса + бейдж-значение (у nodata второго бейджа нет). */
  type?: KpiStatusType
  /** showLabel — подпись статуса (в Type=1; в Figma в 1+1 не привязан, подпись показана всегда). */
  showLabel?: boolean
  /** Значение второго бейджа в Type=1+1 (в Figma текст слоя: 100% / 60% / 0%). */
  value?: ReactNode
}

export function KpiStatus({ status = 'done', type = '1', showLabel = true, value, className, ...rest }: KpiStatusProps) {
  const meta = STATUS[status]
  const pair = type === '1+1' && status !== 'nodata'
  const label = <span className={[styles.label, 'ui-caption-2-medium'].join(' ')}>{meta.label}</span>
  const badge = (
    <span className={[styles.badge, styles.statusBadge].join(' ')}>
      <span className={styles.circle}>
        <Icon name={meta.icon} className={styles.icon} />
      </span>
      {(showLabel || type === '1+1') && label}
    </span>
  )
  return (
    <span
      {...rest}
      role="status"
      aria-label={rest['aria-label'] ?? meta.label}
      className={[styles.root, styles[status], className].filter(Boolean).join(' ')}
    >
      {badge}
      {pair && (
        <span className={[styles.badge, styles.valueBadge].join(' ')}>
          <span className={[styles.label, 'ui-caption-2-medium'].join(' ')}>{value ?? meta.value}</span>
        </span>
      )}
    </span>
  )
}
