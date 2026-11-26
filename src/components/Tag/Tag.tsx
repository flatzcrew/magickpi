import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Tag.module.css'

/** Tag — Figma: кит, `Tag` `10106:4651`. */
export type TagType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'primary-light'
export type TagSize = 'xs' | 'sm' | 'md'
export type TagState = 'default' | 'hover' | 'disabled'

const TEXT_CLASS: Record<TagSize, [string, string]> = {
  xs: ['ui-caption-1-medium', 'ui-caption-1-normal'],
  sm: ['ui-caption-2-medium', 'ui-caption-2-normal'],
  md: ['ui-caption-2-medium', 'ui-caption-2-normal'],
}

export interface TagProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** ☘️ Type */
  type?: TagType
  /** 📐 Size: xs 20 · sm 24 · md 28 */
  size?: TagSize
  /** 💡 State — принудительно для каталога. Нативный hover — только у кликабельного тега (onClick). */
  state?: TagState
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
  /** Кликабельный тег рендерится как <button>. */
  onClick?: MouseEventHandler<HTMLElement>
  disabled?: boolean
}

export function Tag({
  type = 'primary',
  size = 'md',
  state,
  children,
  secondaryText,
  leftIcon,
  rightIcon,
  image,
  onClick,
  disabled,
  className,
  ...rest
}: TagProps) {
  const isDisabled = disabled || state === 'disabled'
  const [primaryClass, secondaryClass] = TEXT_CLASS[size]
  const cls = [styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')
  const content = (
    <>
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
