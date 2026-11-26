import type { HTMLAttributes } from 'react'
import styles from './ModalOverlay.module.css'

/**
 * ModalOverlay — затемняющая подложка под модалку. Figma: кит, `Modal-overlay` `12048:20` (одиночный).
 * Закрывает весь вьюпорт (`position: fixed`). Клик по подложке = «назад» — обработчик onClick у потребителя.
 * Модалку кладут соседом поверх подложки, не внутрь.
 */
export type ModalOverlayProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export function ModalOverlay({ className, ...rest }: ModalOverlayProps) {
  return <div aria-hidden="true" {...rest} className={[styles.root, className].filter(Boolean).join(' ')} />
}
