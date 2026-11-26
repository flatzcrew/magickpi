import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Chip.module.css'

/** Chip — чип-фильтр с выбором. Figma: кит, `Chip` `10005:4414`. */
export type ChipType = 'unselected' | 'selected' | 'selected-solid'
export type ChipSize = 'xs' | 'sm' | 'md'
export type ChipState = 'default' | 'hover' | 'pressed' | 'drag' | 'disabled'

/** Типостиль по Size: [Primary-text (medium), Secondary-text (normal)]. Общий с ChipSpecial. */
export const CHIP_TEXT_CLASS: Record<ChipSize, [string, string]> = {
  xs: ['ui-caption-1-medium', 'ui-caption-1-normal'],
  sm: ['ui-caption-2-medium', 'ui-caption-2-normal'],
  md: ['ui-body-1-medium', 'ui-body-1-normal'],
}

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type */
  type?: ChipType
  /** 📐 Size: xs 24 · sm 32 · md 40 */
  size?: ChipSize
  /** 💡 State — принудительно для каталога; drag есть только принудительно. */
  state?: ChipState
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

export function Chip({
  type = 'unselected',
  size = 'xs',
  state,
  children,
  secondaryText,
  leftIcon,
  rightIcon,
  image,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: ChipProps) {
  const [primaryClass, secondaryClass] = CHIP_TEXT_CLASS[size]
  return (
    <button
      aria-pressed={type !== 'unselected'}
      {...rest}
      type={htmlType}
      disabled={disabled || state === 'disabled'}
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
