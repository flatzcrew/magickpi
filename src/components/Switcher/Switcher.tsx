import type { HTMLAttributes, ReactNode } from 'react'
import { SwitcherItem } from '../SwitcherItem'
import type { SwitcherItemSize, SwitcherItemType } from '../SwitcherItem'
import styles from './Switcher.module.css'

/** Switcher — сегментный переключатель (период, режим отображения). Figma: кит, `Switcher` `10004:1441`. */
export type SwitcherType = 'default' | 'secondary'
export type SwitcherSize = SwitcherItemSize

/** Тип выбранного сегмента по Type переключателя (как в ките). */
const ACTIVE_ITEM: Record<SwitcherType, SwitcherItemType> = {
  default: 'active',
  secondary: 'active-primary-light',
}

export interface SwitcherOption {
  value: string
  /** Primary-text сегмента. */
  label?: ReactNode
  secondaryText?: ReactNode
  leftIcon?: string
  rightIcon?: string
  image?: string
  disabled?: boolean
  'aria-label'?: string
}

export interface SwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** ☘️ Type: default — подложка secondary-alpha, выбранный сегмент active; secondary — белая подложка, active-primary-light. */
  type?: SwitcherType
  /** 📐 Size: высота сегмента xs 24 · sm 32 · md 36 · lg 44 · xl 52 (сам Switcher 32 · 40 · 48 · 56 · 64). */
  size?: SwitcherSize
  /** Сегменты (в ките — 6 × «Nav item»). */
  items: SwitcherOption[]
  /** Выбранный сегмент (value). */
  value?: string
  onChange?: (value: string) => void
  /** Переопределить тип выбранного сегмента (например, active-primary или active-neutral). */
  activeType?: SwitcherItemType
}

export function Switcher({
  type = 'default',
  size = 'xs',
  items,
  value,
  onChange,
  activeType,
  className,
  ...rest
}: SwitcherProps) {
  const selectedType = activeType ?? ACTIVE_ITEM[type]
  return (
    <div {...rest} role="group" className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}>
      {items.map(({ value: itemValue, label, ...item }) => (
        <SwitcherItem
          key={itemValue}
          {...item}
          size={size}
          type={itemValue === value ? selectedType : 'inactive'}
          onClick={() => onChange?.(itemValue)}
        >
          {label}
        </SwitcherItem>
      ))}
    </div>
  )
}
