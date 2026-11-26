import type { HTMLAttributes, ReactNode } from 'react'
import { TopNavItem } from '../TopNavItem'
import type { TopNavItemSize, TopNavItemType } from '../TopNavItem'
import styles from './TopNav.module.css'

/** TopNav — верхняя навигационная панель. Figma: кит, `Top-nav` `10004:2719`. */
export type TopNavSize = TopNavItemSize

export interface TopNavOption {
  value: string
  /** Primary-text пункта. */
  label?: ReactNode
  secondaryText?: ReactNode
  leftIcon?: string
  rightIcon?: string
  image?: string
  disabled?: boolean
  'aria-label'?: string
}

export interface TopNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 📐 Size: высота пунктов xs 24 · sm 32 · md 40 · lg 48 · xl 56 */
  size?: TopNavSize
  /** Пункты (в ките — 7 × Top-nav-item с левой иконкой). */
  items: TopNavOption[]
  /** Текущий пункт (value). */
  value?: string
  onChange?: (value: string) => void
  /** Тип текущего пункта (в ките active-primary-light). */
  activeType?: TopNavItemType
  /** Тип остальных пунктов (в ките inactive). */
  inactiveType?: Extract<TopNavItemType, 'inactive' | 'inactive-outlined'>
}

export function TopNav({
  size = 'xs',
  items,
  value,
  onChange,
  activeType = 'active-primary-light',
  inactiveType = 'inactive',
  className,
  ...rest
}: TopNavProps) {
  return (
    <nav {...rest} className={[styles.root, styles[size], className].filter(Boolean).join(' ')}>
      {items.map(({ value: itemValue, label, ...item }) => (
        <TopNavItem
          key={itemValue}
          {...item}
          size={size}
          type={itemValue === value ? activeType : inactiveType}
          onClick={() => onChange?.(itemValue)}
        >
          {label}
        </TopNavItem>
      ))}
    </nav>
  )
}
