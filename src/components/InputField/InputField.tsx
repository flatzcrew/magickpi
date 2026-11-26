import { useId, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'
import { InputLabel } from '../InputLabel'
import { HintLabel } from '../HintLabel'
import { InputCell } from '../InputCell'
import type { InputCellProps, InputCellState } from '../InputCell'
import { DigitInput } from '../DigitInput'
import styles from './InputField.module.css'

/**
 * InputField — Figma: кит, `Input-field` `12022:7132`.
 * Input-label md + Input-cell (default, md) + Hint-label md, вертикально, gap Space/xs.
 * digit / digit-lg — вместо ячейки ряд DigitInput (3 + разделитель + 3).
 */
export type InputFieldState =
  | 'default'
  | 'hover'
  | 'filled'
  | 'active'
  | 'danger'
  | 'disabled'
  | 'naked'
  | 'digit'
  | 'digit-lg'
  | 'default-dark'
  | 'default-dark-hover'
  | 'filled-dark'
  | 'naked-disabled'

export interface InputFieldProps extends Omit<InputCellProps, 'state'> {
  /**
   * 💡 State. default / hover / active / filled / disabled в работе нативные (hover, фокус, значение,
   * атрибут disabled); danger, naked, *-dark, digit — задаются пропом.
   */
  state?: InputFieldState
  /** Input-label — подпись над полем (нет — блок скрыт). */
  inputLabel?: ReactNode
  /** Input-hint — подсказка под полем (нет — блок скрыт); в danger — текст ошибки. */
  inputHint?: ReactNode
  /** Separator — «-» между группами в digit-режиме. */
  separator?: boolean
  /** digit: количество ячеек (в ките 6). */
  digits?: number
  /** digit: текущее значение кода. */
  digitValue?: string
  /** digit: изменение значения кода. */
  onDigitChange?: (value: string) => void
  /** Класс корня поля (className уходит в него же). */
  className?: string
}

export function InputField({
  state = 'default',
  inputLabel,
  inputHint,
  separator = true,
  digits = 6,
  digitValue = '',
  onDigitChange,
  disabled,
  className,
  id,
  ...cellProps
}: InputFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hintId = `${inputId}-hint`
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const isDigit = state === 'digit' || state === 'digit-lg'
  const isLg = state === 'digit-lg'
  const isDisabled = disabled || state === 'disabled' || state === 'naked-disabled'
  const hintTone = isDisabled ? 'disabled' : state === 'danger' ? 'danger' : 'default'

  const setDigit = (index: number, char: string) => {
    const chars = Array.from({ length: digits }, (_, i) => digitValue[i] ?? '')
    chars[index] = char
    onDigitChange?.(chars.join('').trimEnd())
  }
  const handleDigitChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1)
    setDigit(index, char)
    if (char && index < digits - 1) refs.current[index + 1]?.focus()
  }
  const handleDigitKey = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digitValue[index] && index > 0) refs.current[index - 1]?.focus()
  }

  const half = Math.ceil(digits / 2)

  return (
    <div
      data-state={state}
      className={[styles.root, isLg && styles.lg, className].filter(Boolean).join(' ')}
    >
      {inputLabel != null && (
        <InputLabel size={isLg ? 'lg' : 'md'} htmlFor={isDigit ? `${inputId}-0` : inputId} disabled={isDisabled}>
          {inputLabel}
        </InputLabel>
      )}

      {isDigit ? (
        <div className={styles.code} role="group" aria-describedby={inputHint != null ? hintId : undefined}>
          {Array.from({ length: digits }, (_, i) => (
            <DigitFragment key={i} showSeparator={separator && i === half} lg={isLg}>
              <DigitInput
                ref={(el) => {
                  refs.current[i] = el
                }}
                id={`${inputId}-${i}`}
                size={isLg ? 'lg' : 'md'}
                value={digitValue[i] ?? ''}
                disabled={isDisabled}
                onChange={handleDigitChange(i)}
                onKeyDown={handleDigitKey(i)}
                aria-label={`Цифра ${i + 1}`}
              />
            </DigitFragment>
          ))}
        </div>
      ) : (
        <InputCell
          {...cellProps}
          id={inputId}
          state={state as InputCellState}
          disabled={isDisabled}
          aria-invalid={state === 'danger' || undefined}
          aria-describedby={inputHint != null ? hintId : undefined}
        />
      )}

      {inputHint != null && (
        <HintLabel id={hintId} size="md" tone={hintTone}>
          {inputHint}
        </HintLabel>
      )}
    </div>
  )
}

function DigitFragment({ showSeparator, lg, children }: { showSeparator: boolean; lg: boolean; children: ReactNode }) {
  return (
    <>
      {showSeparator && (
        <span className={[styles.separator, lg ? 'ui-heading-4-medium' : 'ui-heading-2-normal'].join(' ')} aria-hidden>
          -
        </span>
      )}
      {children}
    </>
  )
}
