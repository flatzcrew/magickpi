import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import { IconButton } from '../IconButton'
import { KpiStatus } from '../KpiStatus'
import type { KpiStatusStatus } from '../KpiStatus'
import { initialsOf } from '../EmployeeHeader'
import styles from './EmployeeCard.module.css'

/**
 * EmployeeCard — строка сотрудника в списках «Сотрудники» / «Подчинённые».
 * Figma: kpi-bro · web, ext `EmployeeCard` `171:1455` (Footer 2 × State 4 = 8 ячеек), сверено 2026-11-26.
 * Card [KpiStatus 1+1 · Avatar text md · Name / Role · Icon-button tertiary md ›]; Footer=true — подложка Surface/s2 с подвалом.
 */
export type EmployeeCardState = 'default' | 'hover' | 'focus' | 'selected'

/** Демо-подвал из Figma (Footer=true). */
export const DEMO_EMPLOYEE_CARD_FOOTER = '16 подчинённых · 19 открытых заданий'

export interface EmployeeCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** State: default · hover · focus · selected — принудительно для каталога; hover / focus — нативно. */
  state?: EmployeeCardState
  /** Выбранная карточка (= State selected). */
  selected?: boolean
  /** name */
  name?: ReactNode
  /** role — должность (Figma TEXT; ARIA-атрибут role у корня не пробрасывается). */
  role?: ReactNode
  /** footer — текст подвала; передан → Footer=true (в Figma по умолчанию Footer=false). */
  footer?: ReactNode
  /** showStatus — KpiStatus Type=1+1 (в Figma не привязан, статус виден всегда). */
  showStatus?: boolean
  /** Статус и значение вложенного KpiStatus. */
  status?: KpiStatusStatus
  statusValue?: ReactNode
  /** showExpand — кнопка › справа. */
  showExpand?: boolean
  onExpand?: MouseEventHandler<HTMLButtonElement>
  /** Инициалы Avatar (по умолчанию — из name). */
  initials?: string
  /** Avatar Type=image вместо инициалов. */
  avatarSrc?: string
}

export function EmployeeCard({
  state,
  selected,
  name = 'Пётр Сидоров',
  role = 'торговый представитель',
  footer,
  showStatus = true,
  status = 'progress',
  statusValue,
  showExpand = true,
  onExpand,
  initials,
  avatarSrc,
  className,
  tabIndex = 0,
  ...rest
}: EmployeeCardProps) {
  const isSelected = selected ?? state === 'selected'
  const hasFooter = footer != null && footer !== false
  return (
    <div
      {...rest}
      tabIndex={tabIndex}
      data-state={isSelected ? 'selected' : state}
      aria-current={isSelected || undefined}
      className={[styles.root, hasFooter && styles.withFooter, className].filter(Boolean).join(' ')}
    >
      <div className={styles.card}>
        {showStatus && <KpiStatus status={status} type="1+1" value={statusValue} />}
        <div className={styles.row}>
          <Avatar
            type={avatarSrc ? 'image' : 'text'}
            size="md"
            src={avatarSrc}
            initials={initials ?? initialsOf(name)}
          />
          <div className={styles.content}>
            <span className={[styles.name, 'ui-body-2-medium'].join(' ')}>{name}</span>
            <span className={[styles.role, 'ui-caption-2-normal'].join(' ')}>{role}</span>
          </div>
          {showExpand && (
            <IconButton type="tertiary" size="md" icon="chevron-right" aria-label="Открыть" onClick={onExpand} />
          )}
        </div>
      </div>
      {hasFooter && (
        <div className={styles.footer}>
          <span className={[styles.footerText, 'ui-caption-2-normal'].join(' ')}>{footer}</span>
        </div>
      )}
    </div>
  )
}
