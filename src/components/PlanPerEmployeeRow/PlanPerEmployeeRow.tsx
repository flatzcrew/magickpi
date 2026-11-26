import { useId } from 'react'
import type { ChangeEvent, HTMLAttributes, ReactNode } from 'react'
import { HintLabel } from '../HintLabel'
import { InputField } from '../InputField'
import styles from './PlanPerEmployeeRow.module.css'

/**
 * PlanPerEmployeeRow — строка «План для каждого» в создании задачи (SCR-06). Figma: kpi-bro · web, ext `PlanPerEmployeeRow` `176:2659` (2 ячейки), сверено 2026-11-26.
 * Row [Name · Plan (Input-field 96)] · Hint (Hint-label sm). Своих состояний нет: hover / focus — у поля кита.
 * Компонент только показывает ошибку; можно ли сохранить при несовпадении плана — решение заказчика.
 */
export type PlanPerEmployeeRowState = 'default' | 'error'

export interface PlanPerEmployeeRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  /** State: default · error — поле danger, подсказка Text/danger-high-em. */
  state?: PlanPerEmployeeRowState
  /** name — 1 строка + «…». */
  name?: ReactNode
  /** Plan — значение поля (exposed Input-field). */
  value?: string
  onValueChange?: (value: string) => void
  /** Hint — текст подсказки (exposed Hint-label; null — скрыть). По умолчанию — текст из Figma по State. */
  hint?: ReactNode
}

const DEFAULT_HINT: Record<PlanPerEmployeeRowState, string> = {
  default: 'в группе SMART осталось 0 из 100',
  error: 'не хватает 10 до плана группы',
}

export function PlanPerEmployeeRow({
  state = 'default',
  name = 'Пётр Сидоров',
  value = '20',
  onValueChange,
  hint,
  className,
  ...rest
}: PlanPerEmployeeRowProps) {
  const id = useId()
  const hintText = hint === undefined ? DEFAULT_HINT[state] : hint
  const isError = state === 'error'
  return (
    <div {...rest} data-state={state} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.row}>
        <label htmlFor={id} className={[styles.name, 'ui-body-2-normal'].join(' ')}>
          {name}
        </label>
        <div className={styles.plan}>
          <InputField
            id={id}
            state={isError ? 'danger' : 'default'}
            size="md"
            inputMode="numeric"
            value={value}
            onChange={onValueChange ? (e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value) : undefined}
            readOnly={!onValueChange}
          />
        </div>
      </div>
      {hintText != null && (
        <HintLabel size="sm" tone={isError ? 'danger' : 'default'}>
          {hintText}
        </HintLabel>
      )}
    </div>
  )
}
