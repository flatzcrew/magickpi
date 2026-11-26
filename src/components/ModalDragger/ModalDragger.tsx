import type { HTMLAttributes } from 'react'
import styles from './ModalDragger.module.css'

/** ModalDragger — «ручка» шторки модалки. Figma: кит, `Modal-dragger` `16161:28428` (одиночный, 48×6). */
export type ModalDraggerProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

export function ModalDragger({ className, ...rest }: ModalDraggerProps) {
  return <span aria-hidden="true" {...rest} className={[styles.root, className].filter(Boolean).join(' ')} />
}
