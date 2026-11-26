import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import type { SidebarItemState, SidebarItemType } from '../SidebarItem'
import base from '../SidebarItem/SidebarItem.module.css'
import styles from './SidebarItemCompact.module.css'

/**
 * SidebarItemCompact — пункт свёрнутой боковой навигации (иконка над короткой подписью).
 * Figma: кит, `Sidebar-item-compact` `42927:1227`. Двойник SidebarItem: фон, обводка и эффекты типов — из его CSS-модуля.
 */
export type SidebarItemCompactType = SidebarItemType
export type SidebarItemCompactSize = 'md' | 'lg'
export type SidebarItemCompactState = SidebarItemState

const TEXT_CLASS: Record<SidebarItemCompactSize, string> = {
  md: 'ui-caption-1-medium',
  lg: 'ui-caption-2-medium',
}

export interface SidebarItemCompactProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type — как у SidebarItem. */
  type?: SidebarItemCompactType
  /** 📐 Size: md — иконка 18, UI/caption-1; lg — иконка 20, UI/caption-2. Оба 48 × 56. */
  size?: SidebarItemCompactSize
  /** 💡 State — принудительно для каталога; в работе hover нативный. */
  state?: SidebarItemCompactState
  /** 🖍️ Text — короткая подпись (нет — только иконка). */
  children?: ReactNode
  /** Icon + → Select-icon — имя иконки (нет — только подпись). */
  icon?: string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function SidebarItemCompact({
  type = 'active-primary',
  size = 'md',
  state,
  children,
  icon = 'placeholder',
  htmlType = 'button',
  className,
  ...rest
}: SidebarItemCompactProps) {
  return (
    <button
      aria-current={type !== 'inactive' ? 'page' : undefined}
      {...rest}
      type={htmlType}
      data-state={state}
      className={[base.root, base[type], styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {icon && <Icon name={icon} className={styles.icon} />}
      {children != null && <span className={[styles.label, TEXT_CLASS[size]].join(' ')}>{children}</span>}
    </button>
  )
}
