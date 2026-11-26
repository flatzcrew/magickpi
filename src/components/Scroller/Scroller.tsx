import type { HTMLAttributes } from 'react'
import styles from './Scroller.module.css'

/**
 * Scroller — полоса прокрутки. Figma: кит, `Scroller` `12124:22602`.
 * Визуальная полоса: длина по родителю (Fill), ползунок 64. Положение и длину ползунка задаёт
 * потребитель через CSS-переменные `--scroller-offset` (отступ от начала) и `--scroller-thumb` (длина).
 */
export type ScrollerType = 'vertical' | 'horizontal'

export interface ScrollerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** ☘️ Type */
  type?: ScrollerType
}

export function Scroller({ type = 'vertical', className, ...rest }: ScrollerProps) {
  return (
    <div {...rest} aria-hidden="true" className={[styles.root, styles[type], className].filter(Boolean).join(' ')}>
      <span className={styles.thumb} />
    </div>
  )
}
