import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './MobileNavItem.module.css'

/** MobileNavItem — пункт нижней мобильной навигации. Figma: кит, `Mobile-nav-item` `14246:19681`. */
export type MobileNavItemType =
  | 'active-neutral'
  | 'inactive'
  | 'active'
  | 'active-naked'
  | 'active-primary'
  | 'active-primary-light'
  | 'active-primary-naked'
export type MobileNavItemSize = 'lg' | 'xl'
export type MobileNavItemState = 'default' | 'pressed'

export interface MobileNavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** ☘️ Type — inactive для обычного пункта, active-* для текущего раздела. */
  type?: MobileNavItemType
  /** 📐 Size: высота lg 48 · xl 56; иконка 20 · 24 */
  size?: MobileNavItemSize
  /** 💡 State — принудительно для каталога; в работе pressed нативный (:active). */
  state?: MobileNavItemState
  /** ↪ Text — подпись под иконкой. */
  children?: ReactNode
  /** ⬆️ Top / ↪ Icon + → Select-left-icon — имя иконки; `false` скрывает слой. */
  icon?: string | false
  /** ↪ 🏞️ Image — src круглой картинки 20 (рядом с иконкой). */
  image?: string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function MobileNavItem({
  type = 'active-primary',
  size = 'lg',
  state,
  children,
  icon = 'placeholder',
  image,
  htmlType = 'button',
  className,
  ...rest
}: MobileNavItemProps) {
  const hasTop = Boolean(icon || image)
  return (
    <button
      aria-current={type !== 'inactive' ? 'page' : undefined}
      {...rest}
      type={htmlType}
      data-state={state}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {hasTop && (
        <span className={styles.top}>
          {image && <img className={styles.image} src={image} alt="" />}
          {icon && <Icon name={icon} />}
        </span>
      )}
      {children != null && (
        <span className={styles.text}>
          <span className="ui-caption-1-normal">{children}</span>
        </span>
      )}
    </button>
  )
}
