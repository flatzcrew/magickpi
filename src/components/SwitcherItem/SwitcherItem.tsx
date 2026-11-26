import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './SwitcherItem.module.css'

/** SwitcherItem — сегмент сегментного переключателя. Figma: кит, `Switcher-item` `10004:1260`. */
export type SwitcherItemType =
  | 'active-primary'
  | 'active-primary-light'
  | 'active-secondary'
  | 'active'
  | 'active-neutral'
  | 'inactive'
export type SwitcherItemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SwitcherItemState = 'default' | 'hover'

/** Типостиль по Size: [Primary-text (medium), Secondary-text (normal)]. */
export const SWITCHER_TEXT_CLASS: Record<SwitcherItemSize, [string, string]> = {
  xs: ['ui-caption-1-medium', 'ui-caption-1-normal'],
  sm: ['ui-para-medium', 'ui-para-normal'],
  md: ['ui-body-1-medium', 'ui-body-1-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
  xl: ['ui-title-2-medium', 'ui-title-2-normal'],
}

export interface SwitcherItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type — inactive для невыбранного сегмента, active-* для выбранного. */
  type?: SwitcherItemType
  /** 📐 Size: xs 24 · sm 32 · md 36 · lg 44 · xl 52 */
  size?: SwitcherItemSize
  /** 💡 State — принудительно для каталога; в работе hover нативный. */
  state?: SwitcherItemState
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

export function SwitcherItem({
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
}: SwitcherItemProps) {
  const [primaryClass, secondaryClass] = SWITCHER_TEXT_CLASS[size]
  return (
    <button
      aria-pressed={type !== 'inactive'}
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
