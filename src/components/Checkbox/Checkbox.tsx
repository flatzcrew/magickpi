import { useEffect, useRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import styles from './Checkbox.module.css'

/** Checkbox — чекбокс без подписи. Figma: кит, `Checkbox` `10030:982` (7 состояний × 3 размера). */
export type CheckboxState =
  | 'unchecked'
  | 'hover'
  | 'checked'
  | 'disabled'
  | 'indeterminate'
  | 'indeterminate-disabled'
  | 'checked-pressed'
export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * 💡 State — принудительно для каталога. Выставляет checked / indeterminate / disabled
   * (в Figma `disabled` — отмеченный чекбокс). В работе — нативные checked, indeterminate, :hover, :active.
   */
  state?: CheckboxState
  /** 📐 Size: sm 20 · md 24 · lg 28 (сам квадрат 18 · 20 · 24). */
  size?: CheckboxSize
  /** Частично выбран (минус вместо галочки). */
  indeterminate?: boolean
}

const FORCED: Record<CheckboxState, { checked?: boolean; indeterminate?: boolean; disabled?: boolean }> = {
  unchecked: { checked: false },
  hover: { checked: false },
  checked: { checked: true },
  disabled: { checked: true, disabled: true },
  indeterminate: { indeterminate: true },
  'indeterminate-disabled': { indeterminate: true, disabled: true },
  'checked-pressed': { checked: true },
}

export function Checkbox({
  state,
  size = 'sm',
  indeterminate,
  checked,
  disabled,
  className,
  style,
  onChange,
  ...rest
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  const forced = state ? FORCED[state] : undefined
  const isIndeterminate = forced?.indeterminate ?? indeterminate ?? false
  const isChecked = forced ? Boolean(forced.checked) : checked
  const isDisabled = disabled || forced?.disabled

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = isIndeterminate
  }, [isIndeterminate])

  return (
    <span
      data-state={state}
      className={[styles.root, styles[size], className].filter(Boolean).join(' ')}
      style={style}
    >
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        className={styles.input}
        checked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        readOnly={rest.readOnly ?? (!onChange && (forced != null || checked != null))}
        aria-checked={isIndeterminate ? 'mixed' : undefined}
      />
      <span className={styles.box} aria-hidden="true">
        <svg className={styles.check} viewBox="0 0 10 8" fill="none">
          <path d="M1 4.2 3.7 7 9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className={styles.dash} viewBox="0 0 10 2" fill="none" preserveAspectRatio="none">
          <rect width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      </span>
    </span>
  )
}
