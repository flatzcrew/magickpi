import type { HTMLAttributes } from 'react'
import styles from './Indicator.module.css'

/** Indicator — точка-индикатор слайда / шага. Figma: кит, `Indicator` `14225:4055`. */
export type IndicatorState = 'active-1' | 'active-2' | 'inactive'

export interface IndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * 💡 State — вид точки (не интерактивное состояние): active-1 — вытянутая брендовая,
   * active-2 — светлая точка, inactive — приглушённая.
   */
  state?: IndicatorState
}

/** Дефолт — как дефолтный вариант Figma: State=active-1. */
export function Indicator({ state = 'active-1', className, ...rest }: IndicatorProps) {
  return (
    <span {...rest} data-state={state} className={[styles.root, styles[state], className].filter(Boolean).join(' ')}>
      <span className={styles.shape} />
    </span>
  )
}
