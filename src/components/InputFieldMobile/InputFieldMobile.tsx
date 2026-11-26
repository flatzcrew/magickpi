import { useId } from 'react'
import type { ReactNode } from 'react'
import { InputCellMobile } from '../InputCellMobile'
import type { InputCellMobileProps } from '../InputCellMobile'
import { HintLabel } from '../HintLabel'
import styles from './InputFieldMobile.module.css'

/**
 * InputFieldMobile — Figma: кит, `Input-field-mobile` `53469:2117`.
 * Input-cell-mobile (default, md) + Hint-label md, вертикально, gap Space/xs.
 */
export type InputFieldMobileState = 'default' | 'filled' | 'active' | 'danger' | 'disabled'

export interface InputFieldMobileProps extends Omit<InputCellMobileProps, 'tone'> {
  /** 💡 State. filled / active / disabled в работе нативные (значение, фокус, атрибут disabled); danger — пропом. */
  state?: InputFieldMobileState
  /** Input-hint — подсказка под полем (нет — блок скрыт); в danger — текст ошибки. */
  inputHint?: ReactNode
  className?: string
}

export function InputFieldMobile({
  state = 'default',
  inputHint,
  disabled,
  className,
  id,
  ...cellProps
}: InputFieldMobileProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hintId = `${inputId}-hint`
  const isDisabled = disabled || state === 'disabled'
  const hintTone = isDisabled ? 'disabled' : state === 'danger' ? 'danger' : 'default'

  return (
    <div data-state={state} className={[styles.root, className].filter(Boolean).join(' ')}>
      <InputCellMobile
        {...cellProps}
        id={inputId}
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
