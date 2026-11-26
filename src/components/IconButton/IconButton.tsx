import type { ButtonHTMLAttributes } from 'react'
import { Icon } from '../Icon'
import type { ButtonSize, ButtonState, ButtonType } from '../Button'
import buttonStyles from '../Button/Button.module.css'
import styles from './IconButton.module.css'

/**
 * IconButton — Figma: кит, `Icon-button` `10078:2975`.
 * Type и State — те же, что у Button (цвета, обводка, тени берутся из модуля Button);
 * отличаются только квадратный размер и размер иконки.
 */
export type IconButtonType = ButtonType
export type IconButtonSize = ButtonSize
export type IconButtonState = ButtonState

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** ☘️ Type */
  type?: IconButtonType
  /** 📐 Size: xs 24 · sm 32 · md 40 · lg 48 · xl 56 */
  size?: IconButtonSize
  /** 💡 State — принудительно для каталога; в работе нативно. */
  state?: IconButtonState
  /** → Select-icon — имя иконки. */
  icon?: string
  /** Доступное имя кнопки (обязательно по смыслу: текста нет). */
  'aria-label': string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function IconButton({
  type = 'primary',
  size = 'md',
  state,
  icon = 'placeholder',
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={htmlType}
      disabled={disabled || state === 'disabled'}
      data-state={state}
      className={[buttonStyles.root, buttonStyles[type], styles.root, styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon name={icon} />
    </button>
  )
}
