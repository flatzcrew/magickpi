import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Button.module.css'

/** Button — Figma: кит, `Button` `8003:300` (9 типов × 5 размеров × 4 состояния). */
export type ButtonType =
  | 'primary'
  | 'primary-gradient'
  | 'primary-light'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'neutral'
  | 'flat'
  | 'primary-flat'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonState = 'default' | 'hover' | 'pressed' | 'disabled'

/** Типостиль текста по Size: [Primary-text (medium), Secondary-text (normal)]. */
export const BUTTON_TEXT_CLASS: Record<ButtonSize, [string, string]> = {
  xs: ['ui-caption-1-medium', 'ui-caption-1-normal'],
  sm: ['ui-para-medium', 'ui-para-normal'],
  md: ['ui-body-1-medium', 'ui-body-1-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
  xl: ['ui-title-2-medium', 'ui-title-2-normal'],
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type */
  type?: ButtonType
  /** 📐 Size */
  size?: ButtonSize
  /** 💡 State — принудительно для каталога; в работе hover/pressed/disabled нативные. */
  state?: ButtonState
  /** 🖍️ Text / ↪ Primary-text — основной текст. */
  children?: ReactNode
  /** ↪ Secondary-text — дополнительный текст справа от основного. */
  secondaryText?: ReactNode
  /** ↪ Left-icon + → Select-left-icon — имя иконки слева. */
  leftIcon?: string
  /** ↪ Right-icon + → Select-right-icon — имя иконки справа. */
  rightIcon?: string
  /** ↪ 🏞️ Image — src круглой картинки слева. */
  image?: string
  /** HTML-атрибут type (в Figma `type` — это Type варианта). */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function Button({
  type = 'primary',
  size = 'md',
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
}: ButtonProps) {
  const isDisabled = disabled || state === 'disabled'
  const [primaryClass, secondaryClass] = BUTTON_TEXT_CLASS[size]
  const hasLeft = Boolean(image || leftIcon)
  const hasText = children != null || secondaryText != null
  return (
    <button
      {...rest}
      type={htmlType}
      disabled={isDisabled}
      data-state={state}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {hasLeft && (
        <span className={styles.left}>
          {image && <img className={styles.image} src={image} alt="" />}
          {leftIcon && <Icon name={leftIcon} />}
        </span>
      )}
      {hasText && (
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
