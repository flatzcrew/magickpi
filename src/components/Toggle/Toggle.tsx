import type { InputHTMLAttributes } from 'react'
import styles from './Toggle.module.css'

/** Toggle — переключатель вкл/выкл. Figma: кит, `Toggle` `10023:1125` (5 состояний × 4 размера). */
export type ToggleState =
  | 'switch-off'
  | 'switch-off-disabled'
  | 'switch-on'
  | 'switch-on-disabled'
  | 'switch-on-pressed'
export type ToggleSize = 'sm' | 'md' | 'lg' | 'mobile'

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 💡 State — принудительно для каталога (выставляет checked / disabled). В работе — нативные checked, :active, :disabled. */
  state?: ToggleState
  /** 📐 Size: sm 40×28 · md 48×28 · lg 56×32 · mobile 64×40. */
  size?: ToggleSize
}

const FORCED: Record<ToggleState, { checked: boolean; disabled?: boolean }> = {
  'switch-off': { checked: false },
  'switch-off-disabled': { checked: false, disabled: true },
  'switch-on': { checked: true },
  'switch-on-disabled': { checked: true, disabled: true },
  'switch-on-pressed': { checked: true },
}

export function Toggle({ state, size = 'sm', checked, disabled, className, style, onChange, ...rest }: ToggleProps) {
  const forced = state ? FORCED[state] : undefined
  return (
    <span data-state={state} className={[styles.root, styles[size], className].filter(Boolean).join(' ')} style={style}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={forced ? forced.checked : checked}
        disabled={disabled || forced?.disabled}
        onChange={onChange}
        readOnly={forced != null && !onChange}
      />
      <span className={styles.base} aria-hidden="true">
        <span className={styles.track}>
          <span className={styles.pointer}>
            <svg className={styles.check} viewBox="0 0 10 8" fill="none">
              <path d="M1 4.2 3.7 7 9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={styles.dash} viewBox="0 0 10 2" fill="none" preserveAspectRatio="none">
              <rect width="10" height="2" rx="1" fill="currentColor" />
            </svg>
          </span>
        </span>
      </span>
    </span>
  )
}
