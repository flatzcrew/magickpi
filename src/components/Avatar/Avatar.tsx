import type { HTMLAttributes } from 'react'
import { Icon } from '../Icon'
import { Status } from '../Status'
import type { StatusType } from '../Status'
import styles from './Avatar.module.css'

/** Avatar — Figma: кит, `Avatar` `10010:1415`. */
export type AvatarType = 'image' | 'text' | 'icon'
export type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const TEXT_CLASS: Record<AvatarSize, string> = {
  xxs: 'ui-caption-1-medium',
  xs: 'ui-caption-1-medium',
  sm: 'ui-caption-2-medium',
  md: 'ui-para-medium',
  lg: 'ui-body-2-medium',
  xl: 'ui-title-2-medium',
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** ☘️ Type */
  type?: AvatarType
  /** 📐 Size: xxs 20 · xs 24 · sm 32 · md 40 · lg 48 · xl 56 */
  size?: AvatarSize
  /** Icon — значок «Verification-tick» в правом верхнем углу (в xxs его нет). */
  icon?: boolean
  /** Status — точка Status (Outline=true) в правом нижнем углу. */
  status?: boolean
  /** Тип точки статуса (в ките — success). */
  statusType?: StatusType
  /** → Select-icon — иконка для type="icon" (в ките — user). */
  selectIcon?: string
  /** type="image": src картинки. */
  src?: string
  /** type="image": alt. */
  alt?: string
  /** type="text": инициалы (в xxs показывается одна буква). */
  initials?: string
}

export function Avatar({
  type = 'image',
  size = 'md',
  icon = false,
  status = false,
  statusType = 'success',
  selectIcon = 'user',
  src,
  alt = '',
  initials = 'АТ',
  className,
  ...rest
}: AvatarProps) {
  const text = size === 'xxs' ? initials.slice(0, 1) : initials.slice(0, 2)
  return (
    <span {...rest} className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}>
      {type === 'image' && src && <img className={styles.img} src={src} alt={alt} />}
      {type === 'text' && <span className={[styles.initials, TEXT_CLASS[size]].join(' ')}>{text}</span>}
      {type === 'icon' && <Icon name={selectIcon} className={styles.mainIcon} />}
      {icon && size !== 'xxs' && <Icon name="verification-tick" className={styles.tick} />}
      {status && <Status type={statusType} outline className={styles.status} />}
    </span>
  )
}
