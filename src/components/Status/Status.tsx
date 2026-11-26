import type { HTMLAttributes } from 'react'
import styles from './Status.module.css'

/** Status — точка статуса. Figma: кит, `Status` `10009:933`. */
export type StatusType = 'success' | 'warning' | 'danger' | 'disabled'

export interface StatusProps extends HTMLAttributes<HTMLSpanElement> {
  /** ☘️ Type */
  type?: StatusType
  /** ⭕️ Outline — обводка 2px `--inverse-black-alpha-64` (для точки поверх аватара/иконки). */
  outline?: boolean
}

/** Размер по умолчанию 4×4 (`--space-xs`); родитель меняет его через `--status-size`. */
export function Status({ type = 'success', outline = false, className, ...rest }: StatusProps) {
  return (
    <span
      {...rest}
      data-type={type}
      data-outline={outline || undefined}
      className={[styles.root, styles[type], outline && styles.outline, className].filter(Boolean).join(' ')}
    />
  )
}
