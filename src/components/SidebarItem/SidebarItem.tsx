import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import { Tag } from '../Tag'
import type { TagSize } from '../Tag'
import styles from './SidebarItem.module.css'

/** SidebarItem — пункт боковой навигации. Figma: кит, `Sidebar-item` `12018:6386`. */
export type SidebarItemType =
  | 'active-neutral'
  | 'inactive'
  | 'active'
  | 'active-primary'
  | 'active-primary-light'
  | 'active-secondary'
  | 'active-tertiary'
export type SidebarItemSize = 'sm' | 'md' | 'lg' | 'xl'
export type SidebarItemState = 'default' | 'hover'

/** Типостиль по Size: [Primary-text (medium), Secondary-text (normal)]. */
const TEXT_CLASS: Record<SidebarItemSize, [string, string]> = {
  sm: ['ui-para-medium', 'ui-para-normal'],
  md: ['ui-body-1-medium', 'ui-body-1-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
  xl: ['ui-title-2-medium', 'ui-title-2-normal'],
}

/** Tag в пункте: Tag tertiary xs (sm) · sm (md, lg) · md (xl). */
const TAG_SIZE: Record<SidebarItemSize, TagSize> = { sm: 'xs', md: 'sm', lg: 'sm', xl: 'md' }

export interface SidebarItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type — inactive для обычного пункта, active-* для текущего раздела. */
  type?: SidebarItemType
  /** 📐 Size: высота sm 32 · md 40 · lg 40 · xl 48 */
  size?: SidebarItemSize
  /** 💡 State — принудительно для каталога; в работе hover нативный. */
  state?: SidebarItemState
  /** 🖍️ Text / ↪ Primary-text */
  children?: ReactNode
  /** ↪ Secondary-text */
  secondaryText?: ReactNode
  /** ⬅️ Left / ↪ Left-icon + → Select-left-icon — имя иконки слева. */
  leftIcon?: string
  /** ➡️ Right + → Select-right-icon — имя иконки справа. */
  rightIcon?: string
  /** Tag — текст счётчика / метки справа (Tag tertiary). */
  tag?: ReactNode
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function SidebarItem({
  type = 'active-primary',
  size = 'sm',
  state,
  children,
  secondaryText,
  leftIcon,
  rightIcon,
  tag,
  htmlType = 'button',
  className,
  ...rest
}: SidebarItemProps) {
  const [primaryClass, secondaryClass] = TEXT_CLASS[size]
  return (
    <button
      aria-current={type !== 'inactive' ? 'page' : undefined}
      {...rest}
      type={htmlType}
      data-state={state}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {leftIcon && (
        <span className={styles.left}>
          <Icon name={leftIcon} />
        </span>
      )}
      <span className={styles.text}>
        {children != null && <span className={[styles.primaryText, primaryClass].join(' ')}>{children}</span>}
        {secondaryText != null && (
          <span className={[styles.secondaryText, secondaryClass].join(' ')}>{secondaryText}</span>
        )}
      </span>
      {rightIcon && (
        <span className={styles.right}>
          <Icon name={rightIcon} />
        </span>
      )}
      {tag != null && (
        <Tag type="tertiary" size={TAG_SIZE[size]} className={styles.tag}>
          {tag}
        </Tag>
      )}
    </button>
  )
}
