import type { HTMLAttributes } from 'react'
import styles from './DividerVertical.module.css'

/** DividerVertical — Figma: кит, `Divider-vertical` `12124:22532`. */
export type DividerVerticalAlign = 'right' | 'center' | 'left' | 'center-double'
export type DividerVerticalEnds = 'pointed' | 'rounded'

export interface DividerVerticalProps extends HTMLAttributes<HTMLDivElement> {
  /** Align — где линия 1px внутри полосы 8px; center-double — две линии, полоса 2px. */
  align?: DividerVerticalAlign
  /** Ends — pointed (прямые концы) · rounded (скруглённые). */
  ends?: DividerVerticalEnds
}

/** Высота — по родителю (в Figma Fill). */
export function DividerVertical({ align = 'center', ends = 'pointed', className, ...rest }: DividerVerticalProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      {...rest}
      data-align={align}
      data-ends={ends}
      className={[styles.root, styles[align], ends === 'rounded' && styles.rounded, className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
