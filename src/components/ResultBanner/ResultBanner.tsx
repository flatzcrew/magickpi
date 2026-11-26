import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { KpiStatus } from '../KpiStatus'
import type { KpiStatusStatus } from '../KpiStatus'
import { Link } from '../Link'
import styles from './ResultBanner.module.css'

/**
 * ResultBanner — итог месяца. Figma: kpi-bro · web, ext `ResultBanner` `174:1349` (Type 2 ячейки), сверено 2026-11-26.
 * month-result — Title + KpiStatus в строку (SCR-03); my-matrix — Title, KpiStatus и Link кита столбцом (SCR-13).
 */
export type ResultBannerType = 'month-result' | 'my-matrix'

export interface ResultBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** Type: month-result · my-matrix */
  type?: ResultBannerType
  /** title */
  title?: ReactNode
  /** Статус — вариант вложенного KpiStatus Type=1. */
  status?: KpiStatusStatus
  /** Type=my-matrix: текст Link. */
  linkLabel?: ReactNode
  /** Type=my-matrix: адрес Link (на SCR-13 → матрица 83:729). */
  linkHref?: string
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>
}

export function ResultBanner({
  type = 'month-result',
  title = 'Результат за ноябрь — 79%',
  status = 'progress',
  linkLabel = 'Ваши задачи не отправлены',
  linkHref,
  onLinkClick,
  className,
  ...rest
}: ResultBannerProps) {
  return (
    <section {...rest} className={[styles.root, styles[type], className].filter(Boolean).join(' ')}>
      <span className={[styles.title, 'ui-title-1-semibold'].join(' ')}>{title}</span>
      <KpiStatus status={status} type="1" />
      {type === 'my-matrix' && (
        <Link type="primary" size="md" href={linkHref} onClick={onLinkClick}>
          {linkLabel}
        </Link>
      )}
    </section>
  )
}
