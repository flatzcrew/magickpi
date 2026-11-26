import type { InputHTMLAttributes, Ref } from 'react'
import styles from './DigitInput.module.css'

/** DigitInput — Figma: кит, `Digit-input` `12045:686`. Одна ячейка кода. */
export type DigitInputState =
  | 'default'
  | 'hover'
  | 'default-dark'
  | 'filled'
  | 'active'
  | 'danger'
  | 'disabled'
  | 'filled-dark'
  | 'hover-dark'

/**
 * Размер ячейки. В Figma это не вариант, а оверрайд инстанса в InputField `#️⃣-digit-lg`
 * (padding Space/xl × Space/5xl, UI/heading-4). md — вид мастер-компонента.
 */
export type DigitInputSize = 'md' | 'lg'

export interface DigitInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 💡 State — принудительно для каталога. В работе: hover — :hover, active — :focus,
   * filled — есть значение, disabled — атрибут; danger и *-dark задаются пропом.
   */
  state?: DigitInputState
  size?: DigitInputSize
  ref?: Ref<HTMLInputElement>
}

export function DigitInput({
  state,
  size = 'md',
  disabled,
  placeholder = '-',
  maxLength = 1,
  inputMode = 'numeric',
  className,
  ...rest
}: DigitInputProps) {
  const isDisabled = disabled || state === 'disabled'
  return (
    <input
      {...rest}
      disabled={isDisabled}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      aria-invalid={state === 'danger' || undefined}
      data-state={state}
      className={[
        styles.root,
        styles[size],
        size === 'lg' ? 'ui-heading-4-medium' : 'ui-heading-2-medium',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
