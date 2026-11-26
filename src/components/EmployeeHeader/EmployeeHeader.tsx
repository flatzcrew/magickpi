import type { HTMLAttributes, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'
import { KpiStatus } from '../KpiStatus'
import type { KpiStatusStatus } from '../KpiStatus'
import styles from './EmployeeHeader.module.css'

/**
 * EmployeeHeader — шапка выбранного сотрудника над его матрицей.
 * Figma: kpi-bro · web, ext `EmployeeHeader` `171:1491` (одна ячейка), сверено 2026-11-26.
 * Content [KpiStatus 1+1 (скрыт по умолчанию) · Row: Avatar text md, Name, Role] · Icons / Info.
 */
export interface EmployeeHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** name */
  name?: ReactNode
  /** role — должность (Figma TEXT; ARIA-атрибут role у корня не пробрасывается). */
  role?: ReactNode
  /** showStatus — KpiStatus Type=1+1 над строкой (в Figma false). */
  showStatus?: boolean
  /** Статус и значение вложенного KpiStatus. */
  status?: KpiStatusStatus
  statusValue?: ReactNode
  /** showInfo — иконка Info справа (в Figma true). */
  showInfo?: boolean
  /** Инициалы Avatar (по умолчанию — первые буквы двух слов name). */
  initials?: string
  /** Avatar Type=image вместо инициалов. */
  avatarSrc?: string
}

/** Первые буквы двух первых слов: «Пётр Сидоров» → «ПС». */
export function initialsOf(name: ReactNode) {
  if (typeof name !== 'string') return ''
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export function EmployeeHeader({
  name = 'Пётр Сидоров',
  role = 'руководитель фондового рынка',
  showStatus = false,
  status = 'progress',
  statusValue,
  showInfo = true,
  initials,
  avatarSrc,
  className,
  ...rest
}: EmployeeHeaderProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.content}>
        {showStatus && <KpiStatus status={status} type="1+1" value={statusValue} />}
        <div className={styles.row}>
          <Avatar
            type={avatarSrc ? 'image' : 'text'}
            size="md"
            src={avatarSrc}
            initials={initials ?? initialsOf(name)}
          />
          <div className={styles.texts}>
            <span className={[styles.name, 'ui-body-2-medium'].join(' ')}>{name}</span>
            <span className={[styles.role, 'ui-caption-2-normal'].join(' ')}>{role}</span>
          </div>
        </div>
      </div>
      {showInfo && <Icon name="info" size={20} className={styles.info} />}
    </div>
  )
}
