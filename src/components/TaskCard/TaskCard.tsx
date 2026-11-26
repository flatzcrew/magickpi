import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Button } from '../Button'
import type { ButtonType } from '../Button'
import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'
import { MetaChip } from '../MetaChip'
import { TaskStatus } from '../TaskStatus'
import type { TaskStatusStatus } from '../TaskStatus'
import styles from './TaskCard.module.css'

/**
 * TaskCard — карточка SMART-задачи в узкой колонке (матрица сотрудника). Figma: kpi-bro · web, ext `TaskCard` `167:1582` (24 ячейки), сверено 2026-11-26.
 * Top [Checkbox sm · Content (Title, Description) · TaskStatus] · Bottom [Meta: MetaChip × 2–3 | Action по Status].
 * Таблица задач — TaskRow.
 */
export type TaskCardState = 'default' | 'hover' | 'focus' | 'selected'

/** Кнопка действия по Status (из Figma); у closed-* и rejected кнопок нет, ↗ — у трёх первых. */
const ACTION: Record<TaskStatusStatus, { label?: string; type?: ButtonType; open: boolean }> = {
  'on-approval': { label: 'Согласовать', type: 'primary-gradient', open: true },
  'in-progress': { open: true },
  done: { label: 'Закрыть', type: 'secondary', open: true },
  'closed-plan': { open: false },
  'closed-fact': { open: false },
  rejected: { open: false },
}

export interface TaskCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Status: on-approval · in-progress · done · closed-plan · closed-fact · rejected — статус и набор кнопок. */
  status?: TaskStatusStatus
  /** State: default · hover · focus · selected — принудительно для каталога; hover / focus — нативно. */
  state?: TaskCardState
  /** Выбрана (= State selected, Checkbox отмечен). */
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** title — до 2 строк. */
  title?: ReactNode
  /** description — до 2 строк (showDescription: null — скрыть). */
  description?: ReactNode
  /** MetaChip «План» (без иконки). */
  plan?: ReactNode
  /** MetaChip с иконкой calendar. */
  date?: ReactNode
  /** showAssignees — MetaChip с иконкой users (по умолчанию скрыт, как в Figma). */
  assignees?: ReactNode
  /** Нажатие кнопки действия («Согласовать» / «Закрыть»). */
  onAction?: MouseEventHandler<HTMLButtonElement>
  /** ↗ — открыть задачу. */
  onOpen?: MouseEventHandler<HTMLButtonElement>
}

export function TaskCard({
  status = 'on-approval',
  state,
  selected,
  onSelectedChange,
  title = 'Ввести 5 новых торговых точек в Заречном районе',
  description = 'Описание задания, которое вмещается только в две строки в данной карточке и всё больше нет',
  plan = 'План: 25',
  date = 'от 03.11.2026',
  assignees = null,
  onAction,
  onOpen,
  className,
  tabIndex = 0,
  ...rest
}: TaskCardProps) {
  const isSelected = selected ?? state === 'selected'
  const action = ACTION[status]
  return (
    <div
      {...rest}
      tabIndex={tabIndex}
      data-state={isSelected ? 'selected' : state}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <div className={styles.top}>
        <Checkbox
          size="sm"
          /* Figma: в State=selected Checkbox = checked-pressed (решение дизайнера 2026-11-21 — оставить как есть). */
          state={state === 'selected' ? 'checked-pressed' : undefined}
          checked={isSelected}
          onChange={onSelectedChange ? (e) => onSelectedChange(e.target.checked) : undefined}
          readOnly={!onSelectedChange}
          aria-label="Выбрать задачу"
        />
        <div className={styles.content}>
          <span className={[styles.title, 'ui-title-1-semibold'].join(' ')}>{title}</span>
          {description != null && (
            <span className={[styles.description, 'ui-caption-2-normal'].join(' ')}>{description}</span>
          )}
        </div>
        <TaskStatus status={status} />
      </div>
      <div className={styles.bottom}>
        <div className={styles.meta}>
          {plan != null && <MetaChip icon="none" label={plan} />}
          {date != null && <MetaChip icon="calendar" label={date} />}
          {assignees != null && <MetaChip icon="users" label={assignees} />}
        </div>
        {action.open && (
          <div className={styles.action}>
            {action.label && (
              <Button type={action.type} size="md" onClick={onAction}>
                {action.label}
              </Button>
            )}
            <IconButton type="tertiary" size="md" icon="arrow-right-up" aria-label="Открыть задачу" onClick={onOpen} />
          </div>
        )}
      </div>
    </div>
  )
}
