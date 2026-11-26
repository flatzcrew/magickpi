import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import { CHIP_TEXT_CLASS } from '../Chip'
import type { ChipSize, ChipState } from '../Chip'
import chipStyles from '../Chip/Chip.module.css'
import styles from './ChipSpecial.module.css'

/**
 * ChipSpecial — чип-пилюля с аватаром-инициалами слева. Figma: кит, `Chip-special` `10112:2912`.
 * Type и State — те же, что у Chip (цвета берутся из модуля Chip); своё — форма, размеры и аватар.
 */
export type ChipSpecialType = 'unselected' | 'selected'
export type ChipSpecialSize = ChipSize
export type ChipSpecialState = ChipState

/** Типостиль инициалов в аватаре по Size. */
const AVATAR_TEXT_CLASS: Record<ChipSpecialSize, string> = {
  xs: 'ui-caption-1-medium',
  sm: 'ui-caption-1-medium',
  md: 'ui-caption-2-medium',
}

export interface ChipSpecialProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type */
  type?: ChipSpecialType
  /** 📐 Size: xs 24 · sm 32 · md 40 */
  size?: ChipSpecialSize
  /** 💡 State — принудительно для каталога. */
  state?: ChipSpecialState
  /** 🖍️ Text / ↪ Primary-text */
  children?: ReactNode
  /** ↪ Secondary-text */
  secondaryText?: ReactNode
  /** Инициалы в аватаре (в xs показывается одна буква). */
  initials?: string
  /** ↪ Right-icon + → Select-right-icon */
  rightIcon?: string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function ChipSpecial({
  type = 'unselected',
  size = 'xs',
  state,
  children,
  secondaryText,
  initials = 'АТ',
  rightIcon,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: ChipSpecialProps) {
  const [primaryClass, secondaryClass] = CHIP_TEXT_CLASS[size]
  const text = size === 'xs' ? initials.slice(0, 1) : initials.slice(0, 2)
  return (
    <button
      aria-pressed={type !== 'unselected'}
      {...rest}
      type={htmlType}
      disabled={disabled || state === 'disabled'}
      data-state={state}
      className={[chipStyles.root, chipStyles[type], styles.root, styles[type], styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={[styles.avatar, AVATAR_TEXT_CLASS[size]].join(' ')} aria-hidden="true">
        {text}
      </span>
      {(children != null || secondaryText != null) && (
        <span className={chipStyles.text}>
          {children != null && <span className={[chipStyles.primaryText, primaryClass].join(' ')}>{children}</span>}
          {secondaryText != null && (
            <span className={[chipStyles.secondaryText, secondaryClass].join(' ')}>{secondaryText}</span>
          )}
        </span>
      )}
      {rightIcon && (
        <span className={chipStyles.right}>
          <Icon name={rightIcon} />
        </span>
      )}
    </button>
  )
}
