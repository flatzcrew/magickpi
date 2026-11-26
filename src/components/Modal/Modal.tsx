import { useEffect, useId } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { ModalOverlay } from '../ModalOverlay'
import { ModalHeader } from '../ModalHeader'
import type { ModalHeaderProps } from '../ModalHeader'
import { ModalActions } from '../ModalActions'
import type { ModalActionsProps } from '../ModalActions'
import { Scroller } from '../Scroller'
import styles from './Modal.module.css'

/**
 * Modal — модальное окно. Figma: кит, `Modal` `16414:19664` (Size compact · large; +3: Modal-actions, Scroller, Body).
 * Состав: Modal-header (Spacing = Size) · Body (слот) · Modal-actions/CTAs. Подложка — Modal-overlay (соседом, не внутрь);
 * клик по подложке и Esc вызывают onClose. Ручку шторки (Modal-dragger) включает header.dragger.
 */
export type ModalSize = 'compact' | 'large'

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 📐 Size: compact · large (радиус, тень и Spacing шапки). */
  size?: ModalSize
  /** Показана ли модалка. */
  open?: boolean
  /** Закрытие: крестик в шапке, клик по подложке, Esc. */
  onClose?: () => void
  /** Modal-overlay под окном; false — окно в потоке (каталог, Showcase). */
  overlay?: boolean
  /** Пропсы Modal-header (spacing берётся из Size; шапка есть всегда, как в ките). */
  header?: Omit<ModalHeaderProps, 'spacing'>
  /** Body — содержимое. */
  children?: ReactNode
  /** Modal-actions — пропсы блока кнопок; false — скрыть. */
  actions?: ModalActionsProps | false
  /** Scroller — полоса прокрутки у Body. */
  scroller?: boolean
}

export function Modal({
  size = 'compact',
  open = true,
  onClose,
  overlay = true,
  header = {},
  children,
  actions = {},
  scroller = true,
  className,
  ...rest
}: ModalProps) {
  const headingId = useId()

  useEffect(() => {
    if (!open || !onClose) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const dialog = (
    <div
      role="dialog"
      aria-modal={overlay || undefined}
      aria-labelledby={header?.heading != null ? headingId : undefined}
      {...rest}
      className={[styles.root, styles[size], className].filter(Boolean).join(' ')}
    >
      <div className={styles.wrap}>
        <ModalHeader
          headingId={headingId}
          onClose={onClose ? () => onClose() : undefined}
          {...header}
          spacing={size}
        />
        <div className={styles.body}>
          <div className={styles.content}>{children}</div>
          {scroller && <Scroller type="vertical" className={styles.scroller} />}
        </div>
        {actions !== false && <ModalActions {...actions} />}
      </div>
    </div>
  )

  if (!overlay) return dialog

  return (
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.layer}>{dialog}</div>
    </>
  )
}
