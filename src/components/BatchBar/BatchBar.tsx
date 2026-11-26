import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Button } from '../Button'
import styles from './BatchBar.module.css'

/**
 * BatchBar — плавающая панель режима выбора задач. Figma: kpi-bro · web, ext `BatchBar` `176:2623` (2 ячейки), сверено 2026-11-26.
 * Text-wrap [Count · Hint (State=hint)] · Actions [Clear «Снять выбор» (showClear) · Primary «Сменить статус»].
 * Обе кнопки второстепенные — так задумано (решение 2026-11-21).
 */
export type BatchBarState = 'default' | 'hint'

export interface BatchBarAction {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface BatchBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** State: default — только Count; hint — Count + Hint. */
  state?: BatchBarState
  /** count — 1 строка + «…». */
  count?: ReactNode
  /** hint — показывается при state="hint". */
  hint?: ReactNode
  /** showClear — Button quaternary md (null — скрыть). */
  clearAction?: BatchBarAction | null
  /** Primary — Button secondary md. */
  primaryAction?: BatchBarAction
}

export function BatchBar({
  state = 'default',
  count = 'Выбрано 2 у Петра Сидорова',
  hint = 'Можно выбрать задачи только одного сотрудника',
  clearAction = { label: 'Снять выбор' },
  primaryAction = { label: 'Сменить статус' },
  className,
  ...rest
}: BatchBarProps) {
  return (
    <div {...rest} role="toolbar" className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.text}>
        <span className={[styles.count, 'ui-body-2-medium'].join(' ')}>{count}</span>
        {state === 'hint' && hint != null && <span className={[styles.hint, 'ui-caption-2-normal'].join(' ')}>{hint}</span>}
      </div>
      <div className={styles.actions}>
        {clearAction && (
          <Button type="quaternary" size="md" onClick={clearAction.onClick}>
            {clearAction.label}
          </Button>
        )}
        <Button type="secondary" size="md" onClick={primaryAction.onClick}>
          {primaryAction.label}
        </Button>
      </div>
    </div>
  )
}
