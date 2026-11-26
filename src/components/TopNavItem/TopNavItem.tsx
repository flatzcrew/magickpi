import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './TopNavItem.module.css'

/** TopNavItem — пункт верхней навигации. Figma: кит, `Top-nav-item` `10092:4521`. */
export type TopNavItemType =
  | 'active-neutral'
  | 'inactive'
  | 'inactive-outlined'
  | 'active'
  | 'active-naked'
  | 'active-primary'
  | 'active-primary-light'
  | 'active-secondary'
export type TopNavItemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TopNavItemState = 'default' | 'hover'

/** Типостиль по Size: [Primary-text (medium), Secondary-text (normal)]. */
export const TOP_NAV_TEXT_CLASS: Record<TopNavItemSize, [string, string]> = {
  xs: ['ui-caption-1-medium', 'ui-caption-1-normal'],
  sm: ['ui-para-medium', 'ui-para-normal'],
  md: ['ui-body-1-medium', 'ui-body-1-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
  xl: ['ui-title-2-medium', 'ui-title-2-normal'],
}

export interface TopNavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type — inactive* для обычного пункта, active-* для текущего. */
  type?: TopNavItemType
  /** 📐 Size: высота xs 24 · sm 32 · md 40 · lg 48 · xl 56 */
  size?: TopNavItemSize
  /** 💡 State — принудительно для каталога; в работе hover нативный. */
  state?: TopNavItemState
  /** 🖍️ Text / ↪ Primary-text */
  children?: ReactNode
  /** ↪ Secondary-text */
  secondaryText?: ReactNode
  /** ↪ Left-icon + → Select-left-icon — имя иконки слева. */
  leftIcon?: string
  /** ↪ Right-icon + → Select-right-icon — имя иконки справа. */
  rightIcon?: string
  /** ↪ 🏞️ Image — src круглой картинки слева. */
  image?: string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function TopNavItem({
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
}: TopNavItemProps) {
  const [primaryClass, secondaryClass] = TOP_NAV_TEXT_CLASS[size]
  const isActive = type.startsWith('active')
  return (
    <button
      aria-current={isActive ? 'page' : undefined}
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
