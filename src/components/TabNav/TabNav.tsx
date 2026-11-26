import type { HTMLAttributes, ReactNode } from 'react'
import { TabNavItem } from '../TabNavItem'
import type { TabNavItemSize } from '../TabNavItem'
import styles from './TabNav.module.css'

/** TabNav — панель вкладок. Figma: кит, `Tab-nav` `10048:1249`. */
export type TabNavType = 'default'
export type TabNavSize = TabNavItemSize
export type TabNavState = 'default'

export interface TabNavOption {
  value: string
  /** Primary-text вкладки. */
  label?: ReactNode
  secondaryText?: ReactNode
  leftIcon?: string
  rightIcon?: string
  image?: string
  disabled?: boolean
  'aria-label'?: string
}

export interface TabNavProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** ☘️ Type — в ките единственное значение default. */
  type?: TabNavType
  /** 📐 Size: высота вкладок xs 24 · sm 32 · md 40 · lg 48 · xl 56 */
  size?: TabNavSize
  /** 💡 State — в ките единственное значение default. */
  state?: TabNavState
  /** Вкладки (в ките — 7 × Tab-nav-item, только Primary-text). */
  items: TabNavOption[]
  /** Выбранная вкладка (value). */
  value?: string
  onChange?: (value: string) => void
}

export function TabNav({
  type = 'default',
  size = 'xs',
  state = 'default',
  items,
  value,
  onChange,
  className,
  ...rest
}: TabNavProps) {
  return (
    <div
      role="tablist"
      {...rest}
      data-type={type}
      data-state={state}
      className={[styles.root, styles[size], className].filter(Boolean).join(' ')}
    >
      {items.map(({ value: itemValue, label, ...item }) => (
        <TabNavItem
          key={itemValue}
          {...item}
          size={size}
          type={itemValue === value ? 'active-primary' : 'inactive'}
          onClick={() => onChange?.(itemValue)}
        >
          {label}
        </TabNavItem>
      ))}
    </div>
  )
}
