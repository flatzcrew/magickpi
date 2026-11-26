import type { HTMLAttributes, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import { IconButton } from '../IconButton'
import styles from './ProfileDropdown.module.css'

/**
 * ProfileDropdown — триггер меню профиля. Figma: кит, `Profile-dropdown` `16451:77325` (одиночный; +6).
 * ⬅️ Left (Avatar image xs) · Primary_text + Secondary_text · ➡️ Right (Icon-button flat xs со стрелкой).
 * Фокус и клавиатура — на Icon-button (вложенная кнопка в кнопке недопустима); клик по всей плашке всплывает в onClick корня.
 */
export interface ProfileDropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** ↪ 🏞️ Image — src аватара (без src — инициалы). */
  avatarSrc?: string
  /** Инициалы, если нет картинки. */
  initials?: string
  /** ⬅️ Left — показать аватар. */
  avatar?: boolean
  /** Primary_text — имя. */
  name?: ReactNode
  /** Secondary_text — вторая строка (роль, логин). */
  secondaryText?: ReactNode
  /** ↪ Icon_button — стрелка меню (➡️ Right). */
  iconButton?: boolean
  /** Меню открыто (aria-expanded у кнопки). */
  open?: boolean
  /** Подпись кнопки для скринридера. */
  menuLabel?: string
}

export function ProfileDropdown({
  avatarSrc,
  initials,
  avatar = true,
  name,
  secondaryText,
  iconButton = true,
  open = false,
  menuLabel = 'Меню профиля',
  className,
  ...rest
}: ProfileDropdownProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      {avatar && (
        <span className={styles.left}>
          <Avatar
            type={avatarSrc ? 'image' : 'text'}
            size="xs"
            src={avatarSrc}
            initials={initials}
            alt={typeof name === 'string' ? name : undefined}
          />
        </span>
      )}
      {(name != null || secondaryText != null) && (
        <span className={styles.textWrap}>
          {name != null && <span className={[styles.primary, 'ui-body-1-medium'].join(' ')}>{name}</span>}
          {secondaryText != null && <span className={[styles.secondary, 'ui-body-1-normal'].join(' ')}>{secondaryText}</span>}
        </span>
      )}
      {iconButton && (
        <span className={styles.right}>
          <IconButton type="flat" size="xs" icon="chevron-down" aria-label={menuLabel} aria-haspopup="menu" aria-expanded={open} />
        </span>
      )}
    </div>
  )
}
