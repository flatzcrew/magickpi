import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import { TOP_NAV_TEXT_CLASS } from '../TopNavItem'
import styles from './TabNavItem.module.css'

/** TabNavItem — вкладка. Figma: кит, `Tab-nav-item` `10048:1068`. */
export type TabNavItemType = 'inactive' | 'active-primary'
export type TabNavItemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TabNavItemState = 'default' | 'hover'

export interface TabNavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type — active-primary для выбранной вкладки (подчёркивание), inactive для остальных. */
  type?: TabNavItemType
  /** 📐 Size: высота xs 24 · sm 32 · md 40 · lg 48 · xl 56 (с нижним отступом Space/md под подчёркивание) */
  size?: TabNavItemSize
  /** 💡 State — принудительно для каталога; в работе hover нативный (в ките hover есть только у inactive). */
  state?: TabNavItemState
  /** 🖍️ Text / ↪ Primary-text */
  children?: ReactNode
  /** ↪ Secondary-text */
  secondaryText?: ReactNode
  /** ↪ Left-icon + → Select-left-icon */
  leftIcon?: string
  /** ↪ Right-icon + → Select-right-icon */
  rightIcon?: string
  /** ↪ 🏞️ Image — src круглой картинки слева. */
  image?: string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function TabNavItem({
  type = 'active-primary',
  size = 'xs',
  state,
  children,
  secondaryText,
  leftIcon,
  rightIcon,
  image,
  htmlType = 'button',
  className,
  ...rest
}: TabNavItemProps) {
  const [primaryClass, secondaryClass] = TOP_NAV_TEXT_CLASS[size]
  return (
    <button
      role="tab"
      aria-selected={type === 'active-primary'}
      {...rest}
      type={htmlType}
      data-state={state}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {(image || leftIcon) && (
        <span className={styles.left}>
          {image && <img className={styles.image} src={image} alt="" />}
          {leftIcon && <Icon name={leftIcon} />}
        </span>
      )}
      {(children != null || secondaryText != null) && (
        <span className={styles.text}>
          {children != null && <span className={[styles.primaryText, primaryClass].join(' ')}>{children}</span>}
          {secondaryText != null && (
            <span className={[styles.secondaryText, secondaryClass].join(' ')}>{secondaryText}</span>
          )}
        </span>
      )}
      {rightIcon && (
        <span className={styles.right}>
          <Icon name={rightIcon} />
        </span>
      )}
    </button>
  )
}
