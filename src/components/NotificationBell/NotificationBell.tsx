import type { HTMLAttributes, MouseEventHandler } from 'react'
import { Icon } from '../Icon'
import { Status } from '../Status'
import styles from './NotificationBell.module.css'

/** NotificationBell — колокольчик уведомлений со счётчиком или точкой. Figma: кит, `Notification-bell` `37569:3495`. */
export type NotificationBellType = 'numeric' | 'status' | 'numeric-sm' | 'status-sm'

export interface NotificationBellProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** ☘️ Type: numeric — счётчик, status — красная точка; *-sm — компактный (36 вместо 40). */
  type?: NotificationBellType
  /** Значение счётчика для numeric (в ките «02»). Пусто / 0 — счётчик скрыт. */
  count?: number | string
  /** Доступное имя (иконка без текста). */
  label?: string
  /** Кликабельный колокольчик рендерится как <button>. */
  onClick?: MouseEventHandler<HTMLElement>
}

export function NotificationBell({
  type = 'numeric',
  count = '02',
  label = 'Уведомления',
  onClick,
  className,
  ...rest
}: NotificationBellProps) {
  const isSm = type === 'numeric-sm' || type === 'status-sm'
  const isNumeric = type === 'numeric' || type === 'numeric-sm'
  const showCount = isNumeric && count !== '' && count !== 0
  const cls = [styles.root, isSm ? styles.sm : styles.md, className].filter(Boolean).join(' ')
  const content = (
    <>
      <Icon name="notification" />
      {showCount && (
        <span className={styles.badge}>
          <span className={[styles.count, 'ui-caption-1-medium'].join(' ')}>{count}</span>
        </span>
      )}
      {!isNumeric && <Status type="danger" outline className={styles.dot} />}
    </>
  )
  if (onClick) {
    return (
      <button {...rest} type="button" aria-label={label} onClick={onClick} className={cls}>
        {content}
      </button>
    )
  }
  return (
    <span {...rest} role="img" aria-label={label} className={cls}>
      {content}
    </span>
  )
}
