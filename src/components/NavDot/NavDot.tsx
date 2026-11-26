import type { HTMLAttributes } from 'react'
import styles from './NavDot.module.css'

/** NavDot — точка непрочитанного на иконке навигации. Figma: kpi-bro · web, ext `NavDot` `165:840`. */
export interface NavDotProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Доступное имя («Есть непрочитанные»). Без него точка декоративная. */
  label?: string
}

export function NavDot({ label, className, ...rest }: NavDotProps) {
  return (
    <span
      {...rest}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={[styles.root, className].filter(Boolean).join(' ')}
    />
  )
}
