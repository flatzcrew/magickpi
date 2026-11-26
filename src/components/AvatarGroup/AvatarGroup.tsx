import type { HTMLAttributes, MouseEventHandler } from 'react'
import { Avatar } from '../Avatar'
import type { AvatarProps, AvatarSize } from '../Avatar'
import { Button } from '../Button'
import type { ButtonSize } from '../Button'
import styles from './AvatarGroup.module.css'

/** AvatarGroup — стопка аватаров с кнопкой «+N». Figma: кит, `Avatar-group` `10087:2600`. */
export type AvatarGroupSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Size группы → Size аватара (в xs — Avatar xxs 20). */
const AVATAR_SIZE: Record<AvatarGroupSize, AvatarSize> = { xs: 'xxs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** 📐 Size: xs 20 · sm 32 · md 40 · lg 48 · xl 56 */
  size?: AvatarGroupSize
  /** Аватары (в ките 6). Size задаёт группа. */
  avatars: Omit<AvatarProps, 'size'>[]
  /** Скрытых участников — кнопка «+N» (в ките «+5»). В xs кнопки нет. */
  more?: number
  /** Клик по «+N». */
  onMoreClick?: MouseEventHandler<HTMLButtonElement>
}

export function AvatarGroup({ size = 'xs', avatars, more, onMoreClick, className, ...rest }: AvatarGroupProps) {
  const showMore = more != null && more > 0 && size !== 'xs'
  return (
    <div {...rest} className={[styles.root, styles[size], className].filter(Boolean).join(' ')}>
      {avatars.map((avatar, index) => (
        <Avatar key={index} {...avatar} size={AVATAR_SIZE[size]} />
      ))}
      {showMore && (
        <Button type="secondary" size={size as ButtonSize} className={styles.more} onClick={onMoreClick}>
          {`+${more}`}
        </Button>
      )}
    </div>
  )
}
