import type { HTMLAttributes } from 'react'
import styles from './DividerHorizontal.module.css'

/** DividerHorizontal — Figma: кит, `Divider-horizontal` `12124:22493`. */
export type DividerHorizontalAlign = 'bottom' | 'center' | 'top' | 'center-double'
export type DividerHorizontalEnds = 'pointed' | 'rounded'

export interface DividerHorizontalProps extends HTMLAttributes<HTMLDivElement> {
  /** Align — где линия 1px внутри полосы 8px; center-double — две линии, полоса 2px. */
  align?: DividerHorizontalAlign
  /** Ends — pointed (прямые концы) · rounded (скруглённые). */
  ends?: DividerHorizontalEnds
}

export function DividerHorizontal({ align = 'center', ends = 'pointed', className, ...rest }: DividerHorizontalProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      {...rest}
      data-align={align}
      data-ends={ends}
      className={[styles.root, styles[align], ends === 'rounded' && styles.rounded, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
