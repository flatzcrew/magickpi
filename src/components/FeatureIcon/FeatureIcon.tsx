import type { HTMLAttributes } from 'react'
import { Icon } from '../Icon'
import styles from './FeatureIcon.module.css'

/** FeatureIcon — иконка в цветной плашке. Figma: кит, `Feature-icon` `12051:4447` (7 типов × 5 размеров). */
export type FeatureIconType =
  | 'primary'
  | 'primary-light'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'neutral'
  | 'primary-flat'
export type FeatureIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface FeatureIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** ☘️ Type */
  type?: FeatureIconType
  /** 📐 Size: xs 32 · sm 40 · md 48 · lg 56 · xl 64 (иконка 20 · 22 · 28 · 32 · 36). */
  size?: FeatureIconSize
  /** Select-icon — имя иконки. */
  icon?: string
  /** Доступное имя; без него плашка декоративная. */
  label?: string
}

/** Дефолты — как дефолтный вариант Figma: Type=primary, Size=xs. */
export function FeatureIcon({ type = 'primary', size = 'xs', icon = 'placeholder', label, className, ...rest }: FeatureIconProps) {
  return (
    <span
      {...rest}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      <Icon name={icon} />
    </span>
  )
}
