import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { TaskStatus } from '../TaskStatus'
import type { TaskStatusStatus } from '../TaskStatus'
import styles from './TaskRow.module.css'

/**
 * TaskRow — строка SMART-задачи в таблице задач. Figma: kpi-bro · web, ext `TaskRow` `176:2263` (7 ячеек), сверено 2026-11-26.
 * [Checkbox sm при Selectable=true] · Content [Title, Meta] · TaskStatus · Actions [0–2 Button sm].
 * Карточка задачи в узкой колонке — TaskCard; строка показателя KPI — MatrixRow.
 */
export type TaskRowState = 'default' | 'hover' | 'focus' | 'selected'

/** Действие-кнопка строки. */
export interface TaskRowAction {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface TaskRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Selectable: false · true — чекбокс в начале строки. */
  selectable?: boolean
  /** State: default · hover · focus · selected (selected — только при selectable) — принудительно для каталога. */
  state?: TaskRowState
  /** Выбрана (= State selected, Checkbox checked). Только при selectable. */
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
  /** title — до 2 строк + «…». */
  title?: ReactNode
  /** meta */
  meta?: ReactNode
  /** Статус — вариант вложенного TaskStatus. */
  status?: TaskStatusStatus
  /** showAction1 — Button primary-gradient sm (null — скрыть). */
  primaryAction?: TaskRowAction | null
  /** showAction2 — Button quaternary sm (null — скрыть). */
  secondaryAction?: TaskRowAction | null
}

export function TaskRow({
  selectable = false,
  state,
  selected,
  onSelectedChange,
  title = 'Ввести 5 новых торговых точек в Заречном районе',
  meta = 'план 25 · отправлена 3 ноября',
  status = 'on-approval',
  primaryAction = { label: 'Согласовать' },
  secondaryAction = { label: 'Отклонить' },
  className,
  tabIndex = 0,
  ...rest
}: TaskRowProps) {
  const isSelected = selectable && (selected ?? state === 'selected')
  const dataState = isSelected ? 'selected' : state === 'selected' ? undefined : state
  return (
    <div
      {...rest}
      tabIndex={tabIndex}
      data-state={dataState}
      className={[styles.root, selectable && styles.selectable, className].filter(Boolean).join(' ')}
    >
      <div className={styles.lead}>
        {selectable && (
          <Checkbox
            size="sm"
            checked={isSelected}
            onChange={onSelectedChange ? (e) => onSelectedChange(e.target.checked) : undefined}
            readOnly={!onSelectedChange}
            aria-label="Выбрать задачу"
          />
        )}
        <div className={styles.content}>
          <span className={[styles.title, 'ui-body-2-medium'].join(' ')}>{title}</span>
          <span className={[styles.meta, 'ui-caption-2-normal'].join(' ')}>{meta}</span>
        </div>
        <TaskStatus status={status} />
      </div>
      {(primaryAction || secondaryAction) && (
        <div className={styles.actions}>
          {primaryAction && (
            <Button type="primary-gradient" size="sm" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button type="quaternary" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
