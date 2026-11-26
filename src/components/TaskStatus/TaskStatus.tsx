import type { HTMLAttributes } from 'react'
import { Tag } from '../Tag'
import type { TagType } from '../Tag'
import styles from './TaskStatus.module.css'

/**
 * TaskStatus — статус SMART-задачи. Figma: kpi-bro · web, ext `TaskStatus` `164:707` (6 ячеек), сверено 2026-11-26.
 * Состав: Tag кита Size=sm, State=default + левая иконка + Primary-text. Своих цветов нет — всё от Tag.
 * Не интерактивен. Статус KPI-показателя — это KpiStatus.
 */
export type TaskStatusStatus = 'on-approval' | 'in-progress' | 'done' | 'closed-plan' | 'closed-fact' | 'rejected'

/** Подпись, Tag.Type и иконка по Status — из Figma. */
const STATUS: Record<TaskStatusStatus, { label: string; type: TagType; icon: string }> = {
  'on-approval': { label: 'На согласовании', type: 'warning', icon: 'history' },
  'in-progress': { label: 'В работе', type: 'info', icon: 'loader' },
  done: { label: 'Выполнена', type: 'success', icon: 'check' },
  'closed-plan': { label: 'Закрыта по плану', type: 'tertiary', icon: 'tick' },
  'closed-fact': { label: 'Закрыта по факту', type: 'tertiary', icon: 'flag' },
  rejected: { label: 'Отклонена', type: 'danger', icon: 'cross' },
}

export interface TaskStatusProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onClick'> {
  /** Status: on-approval · in-progress · done · closed-plan · closed-fact · rejected */
  status?: TaskStatusStatus
}

export function TaskStatus({ status = 'on-approval', className, ...rest }: TaskStatusProps) {
  const meta = STATUS[status]
  return (
    <Tag
      {...rest}
      role="status"
      type={meta.type}
      size="sm"
      leftIcon={meta.icon}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      {meta.label}
    </Tag>
  )
}
