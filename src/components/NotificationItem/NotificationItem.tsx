import type { HTMLAttributes, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { NavDot } from '../NavDot'
import styles from './NotificationItem.module.css'

/**
 * NotificationItem — строка уведомления (SCR-11). Figma: kpi-bro · web, ext `NotificationItem` `227:1038`
 * (Read 2 × State 2 = 4 ячейки), сверено 2026-11-26.
 * Feature-icon tertiary xs · Content [Text до 3 строк · Time] · NavDot — только у непрочитанного.
 * Иконки событий на SCR-11: на согласовании и напоминание — history, выполнено — check, факт — info, оценка — star.
 */
export type NotificationItemState = 'default' | 'hover'

export interface NotificationItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Read: false — непрочитанное (Surface/s1 + NavDot) · true — прочитанное (Surface/s0). */
  read?: boolean
  /** State: default · hover — принудительно для каталога; hover — нативно. */
  state?: NotificationItemState
  /** text — до 3 строк с «…». */
  text?: ReactNode
  /** time */
  time?: ReactNode
  /** Иконка события в Feature-icon (exposed swap). */
  icon?: string
}

export function NotificationItem({
  read = false,
  state,
  text = 'Пётр Смирнов отправил задачу «Дегустация в ТЦ Мега» на согласование',
  time = '10:42',
  icon = 'check',
  className,
  ...rest
}: NotificationItemProps) {
  return (
    <div
      {...rest}
      data-state={state}
      data-read={read}
      className={[styles.root, read ? styles.read : styles.unread, className].filter(Boolean).join(' ')}
    >
      <FeatureIcon type="tertiary" size="xs" icon={icon} />
      <div className={styles.content}>
        <span className={[styles.text, 'ui-para-medium'].join(' ')}>{text}</span>
        <span className={[styles.time, 'ui-caption-2-normal'].join(' ')}>{time}</span>
      </div>
      {!read && <NavDot label="Непрочитанное" />}
    </div>
  )
}
