import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Link.module.css'

/** Link — Figma: кит, `Link` `10055:1344`. */
export type LinkType = 'primary' | 'secondary' | 'tertiary'
export type LinkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type LinkState = 'default' | 'hover' | 'disabled'

const TEXT_CLASS: Record<LinkSize, string> = {
  xs: 'ui-caption-1-medium',
  sm: 'ui-caption-2-medium',
  md: 'ui-para-medium',
  lg: 'ui-body-2-medium',
  xl: 'ui-title-2-medium',
}

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  /** ☘️ Type */
  type?: LinkType
  /** 📐 Size */
  size?: LinkSize
  /** 💡 State — принудительно для каталога; в работе hover нативный, disabled — проп. */
  state?: LinkState
  /** 🖍️ Text — текст ссылки. */
  children?: ReactNode
  /** ⬅️ Left / ↪ Left-icon + → Select-left-icon — имя иконки слева. */
  leftIcon?: string
  /** ➡️ Right / ↪ Right-icon + → Select-right-icon — имя иконки справа. */
  rightIcon?: string
  /** Недоступна: без href, aria-disabled. */
  disabled?: boolean
}

export function Link({
  type = 'primary',
  size = 'md',
  state,
  children,
  leftIcon,
  rightIcon,
  disabled,
  href,
  className,
  ...rest
}: LinkProps) {
  const isDisabled = disabled || state === 'disabled'
  return (
    <a
      {...rest}
      href={isDisabled ? undefined : href}
      aria-disabled={isDisabled || undefined}
      data-state={isDisabled ? 'disabled' : state}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {leftIcon && (
        <span className={styles.left}>
          <Icon name={leftIcon} />
        </span>
      )}
      {children != null && <span className={[styles.text, TEXT_CLASS[size]].join(' ')}>{children}</span>}
      {rightIcon && (
        <span className={styles.right}>
          <Icon name={rightIcon} />
        </span>
      )}
    </a>
  )
}
