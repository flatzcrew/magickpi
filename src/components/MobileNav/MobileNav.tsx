import type { HTMLAttributes, ReactNode } from 'react'
import { MobileNavItem } from '../MobileNavItem'
import type { MobileNavItemSize, MobileNavItemType } from '../MobileNavItem'
import styles from './MobileNav.module.css'

/** MobileNav — нижняя навигация мобильного приложения. Figma: кит, `Mobile-nav` `14246:19645`. */
export type MobileNavType = 'default' | 'floating'
export type MobileNavSize = 'md' | 'lg'

/** Size панели → Size пунктов: md → lg (48), lg → xl (56). */
const ITEM_SIZE: Record<MobileNavSize, MobileNavItemSize> = { md: 'lg', lg: 'xl' }

export interface MobileNavOption {
  value: string
  /** Подпись пункта. */
  label?: ReactNode
  /** Имя иконки (по умолчанию placeholder). */
  icon?: string
  image?: string
  disabled?: boolean
  'aria-label'?: string
}

/** Демо-пункты — 5 × «Item», как в ките. */
const DEMO_ITEMS: MobileNavOption[] = ['1', '2', '3', '4', '5'].map((value) => ({ value, label: 'Item' }))

export interface MobileNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** ☘️ Type: floating — плавающая плашка; default — прибита к низу экрана, с Home-indicator. В ките default есть только в lg. */
  type?: MobileNavType
  /** 📐 Size: md (пункты 48) · lg (пункты 56) */
  size?: MobileNavSize
  /** Пункты (в ките — 5). */
  items?: MobileNavOption[]
  /** Текущий пункт (value). По умолчанию первый. */
  value?: string
  onChange?: (value: string) => void
  /** Тип текущего пункта (в ките active). */
  activeType?: MobileNavItemType
  /** Тип остальных пунктов (в ките inactive). */
  inactiveType?: MobileNavItemType
}

export function MobileNav({
  type = 'floating',
  size = 'md',
  items = DEMO_ITEMS,
  value,
  onChange,
  activeType = 'active',
  inactiveType = 'inactive',
  className,
  ...rest
}: MobileNavProps) {
  const current = value ?? items[0]?.value
  return (
    <nav {...rest} className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}>
      {items.map(({ value: itemValue, label, icon, ...item }) => (
        <MobileNavItem
          key={itemValue}
          {...item}
          icon={icon ?? 'placeholder'}
          size={ITEM_SIZE[size]}
          type={itemValue === current ? activeType : inactiveType}
          className={styles.item}
          onClick={() => onChange?.(itemValue)}
        >
          {label}
        </MobileNavItem>
      ))}
      {type === 'default' && (
        <span className={styles.homeIndicator} aria-hidden>
          <span className={styles.homeBar} />
        </span>
      )}
    </nav>
  )
}
