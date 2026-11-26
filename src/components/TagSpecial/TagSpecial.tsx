import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Icon } from '../Icon'
import type { TagState, TagType } from '../Tag'
import tagStyles from '../Tag/Tag.module.css'
import styles from './TagSpecial.module.css'

/**
 * TagSpecial — тег-пилюля с аватаром-инициалами слева. Figma: кит, `Tag-special` `10108:4237`.
 * Type и State — те же, что у Tag (цвета, обводка, тени из модуля Tag); своё — форма, размеры и аватар.
 */
export type TagSpecialType = TagType
export type TagSpecialSize = 'sm' | 'md'
export type TagSpecialState = TagState

export interface TagSpecialProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** ☘️ Type */
  type?: TagSpecialType
  /** 📐 Size: sm 24 · md 28 */
  size?: TagSpecialSize
  /** 💡 State — принудительно для каталога. Нативный hover — только у кликабельного тега (onClick). */
  state?: TagSpecialState
  /** 🖍️ Text / ↪ Primary-text */
  children?: ReactNode
  /** ↪ Secondary-text */
  secondaryText?: ReactNode
  /** Инициалы в аватаре (в sm показывается одна буква). */
  initials?: string
  /** ↪ Right-icon + → Select-right-icon */
  rightIcon?: string
  /** Кликабельный тег рендерится как <button>. */
  onClick?: MouseEventHandler<HTMLElement>
  disabled?: boolean
}

export function TagSpecial({
  type = 'primary',
  size = 'sm',
  state,
  children,
  secondaryText,
  initials = 'АТ',
  rightIcon,
  onClick,
  disabled,
  className,
  ...rest
}: TagSpecialProps) {
  const isDisabled = disabled || state === 'disabled'
  const text = size === 'sm' ? initials.slice(0, 1) : initials.slice(0, 2)
  const cls = [tagStyles.root, tagStyles[type], styles.root, styles[type], styles[size], className]
    .filter(Boolean)
    .join(' ')
  const content = (
    <>
      <span className={[styles.avatar, 'ui-caption-1-medium'].join(' ')} aria-hidden="true">
        {text}
      </span>
      {(children != null || secondaryText != null) && (
        <span className={[tagStyles.text, styles.text].join(' ')}>
          {children != null && <span className={[tagStyles.primaryText, 'ui-caption-2-medium'].join(' ')}>{children}</span>}
          {secondaryText != null && (
            <span className={[tagStyles.secondaryText, 'ui-caption-2-normal'].join(' ')}>{secondaryText}</span>
          )}
        </span>
      )}
      {rightIcon && (
        <span className={tagStyles.right}>
          <Icon name={rightIcon} />
        </span>
      )}
    </>
  )
  const stateAttr = isDisabled ? 'disabled' : state
  if (onClick) {
    return (
      <button {...rest} type="button" onClick={onClick} disabled={isDisabled} data-state={stateAttr} className={cls}>
        {content}
      </button>
    )
  }
  return (
    <span {...rest} aria-disabled={isDisabled || undefined} data-state={stateAttr} className={cls}>
      {content}
    </span>
  )
}
