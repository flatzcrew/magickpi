import { useId } from 'react'
import type { ReactNode } from 'react'
import { InputCellSpecial } from '../InputCellSpecial'
import type { InputCellSpecialProps } from '../InputCellSpecial'
import { HintLabel } from '../HintLabel'
import styles from './InputFieldSpecial.module.css'

/**
 * InputFieldSpecial — Figma: кит, `Input-field-special` `12041:1143`.
 * Input-cell-special (default, md) + Hint-label md, вертикально, gap Space/xs. Подписи над полем нет:
 * она плавающая, внутри ячейки (`label`).
 */
export type InputFieldSpecialState =
  | 'default'
  | 'hover'
  | 'default-dark'
  | 'filled'
  | 'active'
  | 'danger'
  | 'disabled'
  | 'filled-dark'
  | 'hover-dark'

export interface InputFieldSpecialProps extends Omit<InputCellSpecialProps, 'state' | 'tone'> {
  /**
   * 💡 State. hover / active / filled / disabled в работе нативные (hover, фокус, значение, атрибут disabled);
   * danger и *-dark задаются пропом.
   */
  state?: InputFieldSpecialState
  /** Input-hint — подсказка под полем (нет — блок скрыт); в danger — текст ошибки. */
  inputHint?: ReactNode
  className?: string
}

export function InputFieldSpecial({
  state = 'default',
  inputHint,
  disabled,
  className,
  id,
  ...cellProps
}: InputFieldSpecialProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hintId = `${inputId}-hint`
  const isDisabled = disabled || state === 'disabled'
  const hintTone = isDisabled ? 'disabled' : state === 'danger' ? 'danger' : 'default'
  const forced = state === 'filled' || state === 'filled-dark' || state === 'active' ? 'pressed' : undefined

  return (
    <div data-state={state} className={[styles.root, className].filter(Boolean).join(' ')}>
      <InputCellSpecial
        {...cellProps}
        id={inputId}
        state={forced}
        tone={state}
        disabled={isDisabled}
        aria-invalid={state === 'danger' || undefined}
        aria-describedby={inputHint != null ? hintId : undefined}
      />
      {inputHint != null && (
        <HintLabel id={hintId} size="md" tone={hintTone} className={styles.hint}>
          {inputHint}
        </HintLabel>
      )}
    </div>
  )
}
