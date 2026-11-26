import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './MetaChip.module.css'

/** MetaChip — метаданные карточки (план, срок, исполнители). Figma: kpi-bro · web, ext `MetaChip` `164:732`. */
export type MetaChipIcon = 'none' | 'calendar' | 'users'

/** Иконки кита: Icons / Calender (опечатка Figma сохранена в имени) · Icons / Users. */
const ICON_NAME: Record<Exclude<MetaChipIcon, 'none'>, string> = {
  calendar: 'calender',
  users: 'users',
}

export interface MetaChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Icon: none · calendar · users */
  icon?: MetaChipIcon
  /** label — одна строка. */
  label?: ReactNode
}

export function MetaChip({ icon = 'none', label = 'План: 25', className, ...rest }: MetaChipProps) {
  return (
    <span {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      {icon !== 'none' && <Icon name={ICON_NAME[icon]} className={styles.icon} />}
      <span className={[styles.label, 'ui-caption-2-normal'].join(' ')}>{label}</span>
    </span>
  )
}
