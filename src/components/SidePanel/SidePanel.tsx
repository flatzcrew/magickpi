import { useId } from 'react'
import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { ModalActions } from '../ModalActions'
import type { ModalActionsProps } from '../ModalActions'
import { ModalHeader } from '../ModalHeader'
import styles from './SidePanel.module.css'

/**
 * SidePanel — боковая панель поверх экрана. Figma: kpi-bro · web, ext `SidePanel` `209:997` (без вариантов), сверено 2026-11-26.
 * Header (Modal-header compact, Heading-sm, Close) · Body (слот с прокруткой) · Actions (Modal-actions/CTAs, showActions).
 * Статус (KpiStatus / TaskStatus) кладётся первой строкой Body. Подтверждение и выбор — Modal кита.
 * На экранах не используется (решение дизайнера 2026-11-25), в ДС остаётся.
 */
export interface SidePanelProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Заголовок Header (Heading-sm). */
  heading?: ReactNode
  /** Close-icon в Header (в мастере показан). */
  showClose?: boolean
  onClose?: MouseEventHandler<HTMLButtonElement>
  /** Body — слот. */
  children?: ReactNode
  /** showActions — блок Modal-actions/CTAs. */
  showActions?: boolean
  /** Пропсы вложенного ModalActions (кнопки, CTAs-слот). Description в SidePanel выключен. */
  actionsProps?: Omit<ModalActionsProps, 'description' | 'link'>
}

export function SidePanel({
  heading = 'Заголовок панели',
  showClose = true,
  onClose,
  children,
  showActions = true,
  actionsProps,
  className,
  ...rest
}: SidePanelProps) {
  const headingId = useId()
  return (
    <aside {...rest} aria-labelledby={headingId} className={[styles.root, className].filter(Boolean).join(' ')}>
      <ModalHeader
        className={styles.header}
        spacing="compact"
        heading={heading}
        headingSize="sm"
        headingId={headingId}
        onClose={showClose ? (onClose ?? (() => undefined)) : undefined}
      />
      <div className={styles.body}>
        {children ?? <p className={[styles.placeholder, 'ui-body-1-normal'].join(' ')}>Содержимое панели</p>}
      </div>
      {showActions && <ModalActions {...actionsProps} className={[styles.actions, actionsProps?.className].filter(Boolean).join(' ')} />}
    </aside>
  )
}
