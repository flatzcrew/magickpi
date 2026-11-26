import type { HTMLAttributes } from 'react'
import { Indicator } from '../Indicator'
import styles from './PageIndicator.module.css'

/**
 * PageIndicator — набор точек-индикаторов страниц (слайдер, онбординг). Figma: кит, `Page-indicator` `14195:5866`.
 * Ряд Indicator, gap Space/sm: текущая — active-1, остальные — inactive.
 * Булевы Dot_3 / Dot_4 кита (видимость 3-й и 4-й точки) → `count` (2…4 в ките; больше — тоже рисуется).
 */
export interface PageIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Число точек (в ките 4: Dot_3 и Dot_4 включены). */
  count?: number
  /** Индекс текущей страницы, с 0. */
  active?: number
}

export function PageIndicator({ count = 4, active = 0, className, ...rest }: PageIndicatorProps) {
  return (
    <div
      role="group"
      aria-label={`Страница ${active + 1} из ${count}`}
      {...rest}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      {Array.from({ length: count }, (_, i) => (
        <Indicator key={i} state={i === active ? 'active-1' : 'inactive'} />
      ))}
    </div>
  )
}
