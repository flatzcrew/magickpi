import type { InputHTMLAttributes } from 'react'
import styles from './Radio.module.css'

/** Radio — радиокнопка без подписи. Figma: кит, `Radio` `10053:1943` (5 состояний × 2 размера). */
export type RadioState = 'inactive' | 'hover' | 'active' | 'disabled' | 'active-pressed'
export type RadioSize = 'sm' | 'md'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * 💡 State — принудительно для каталога. Выставляет checked / disabled
   * (в Figma `disabled` — выбранная радиокнопка). В работе — нативные checked, :hover, :active.
   */
  state?: RadioState
  /** 📐 Size: sm 20 · md 24 (сам круг 18 · 20). */
  size?: RadioSize
}

const FORCED: Record<RadioState, { checked: boolean; disabled?: boolean }> = {
  inactive: { checked: false },
  hover: { checked: false },
  active: { checked: true },
  disabled: { checked: true, disabled: true },
  'active-pressed': { checked: true },
}

export function Radio({ state, size = 'sm', checked, disabled, className, style, onChange, ...rest }: RadioProps) {
  const forced = state ? FORCED[state] : undefined
  return (
    <span data-state={state} className={[styles.root, styles[size], className].filter(Boolean).join(' ')} style={style}>
      <input
        {...rest}
        type="radio"
        className={styles.input}
        checked={forced ? forced.checked : checked}
        disabled={disabled || forced?.disabled}
        onChange={onChange}
        readOnly={forced != null && !onChange}
      />
      <span className={styles.circle} aria-hidden="true">
        <span className={styles.dot} />
      </span>
    </span>
  )
}
