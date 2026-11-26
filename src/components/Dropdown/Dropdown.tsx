import { useId } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import { InputLabel } from '../InputLabel'
import { HintLabel } from '../HintLabel'
import styles from './Dropdown.module.css'

/**
 * Dropdown — поле выбора (триггер select). Figma: кит, `Dropdown` `12041:1595`.
 * Input-label md + ячейка (Input-cell default md) + Hint-label md, вертикально, gap Space/xs.
 * Ячейка — <button>: сам список открывает внешний Dropmenu (пачка 5).
 * Вариант Auto-layout (FALSE · TRUE) — технический, в React не переносится.
 */
export type DropdownState =
  | 'default'
  | 'hover'
  | 'pressed'
  | 'active'
  | 'danger'
  | 'disabled'
  | 'naked'
  | 'default-dark'
  | 'naked-disabled'
  | 'primary-light'

export interface DropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'value'> {
  /**
   * 💡 State. hover — :hover, pressed — открытый список (`open`) или :active, active — :focus-visible,
   * disabled — атрибут; danger, naked, default-dark, primary-light задаются пропом.
   */
  state?: DropdownState
  /** Список открыт (aria-expanded) — вид pressed. */
  open?: boolean
  /** Input-label — подпись над полем (нет — блок скрыт). */
  inputLabel?: ReactNode
  /** Input-hint — подсказка под полем (нет — блок скрыт); в danger — текст ошибки. */
  inputHint?: ReactNode
  /** Primary-text — выбранное значение. */
  value?: ReactNode
  /** Текст, пока значение не выбрано (в ките «Select option»). */
  placeholder?: ReactNode
  /** Secondary-text — пояснение после значения. */
  secondaryText?: ReactNode
  /** ↪ Left-icon — имя иконки слева. */
  leftIcon?: string
  /** ↪ Right-icon — имя иконки справа (стрелка списка). */
  rightIcon?: string
  /** ↪ 🏞️ Image — src круглой картинки слева. */
  image?: string
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Dropdown({
  state = 'default',
  open = false,
  inputLabel,
  inputHint,
  value,
  placeholder = 'Выберите вариант',
  secondaryText,
  leftIcon,
  rightIcon = 'chevron-down',
  image,
  htmlType = 'button',
  disabled,
  className,
  id,
  ...rest
}: DropdownProps) {
  const autoId = useId()
  const buttonId = id ?? autoId
  const hintId = `${buttonId}-hint`
  const isDisabled = disabled || state === 'disabled' || state === 'naked-disabled'
  const hintTone = isDisabled ? 'disabled' : state === 'danger' ? 'danger' : 'default'
  const cellState = open && state === 'default' ? 'pressed' : state

  return (
    <div data-state={state} className={[styles.root, className].filter(Boolean).join(' ')}>
      {inputLabel != null && (
        <InputLabel size="md" htmlFor={buttonId} disabled={isDisabled}>
          {inputLabel}
        </InputLabel>
      )}

      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={state === 'danger' || undefined}
        aria-describedby={inputHint != null ? hintId : undefined}
        {...rest}
        id={buttonId}
        type={htmlType}
        disabled={isDisabled}
        data-state={cellState}
        className={styles.cell}
      >
        {(image || leftIcon) && (
          <span className={styles.left}>
            {image && <img className={styles.image} src={image} alt="" />}
            {leftIcon && <Icon name={leftIcon} />}
          </span>
        )}
        <span className={styles.text}>
          <span className={[styles.primaryText, 'ui-body-1-medium'].join(' ')}>{value ?? placeholder}</span>
          {secondaryText != null && (
            <span className={[styles.secondaryText, 'ui-body-1-normal'].join(' ')}>{secondaryText}</span>
          )}
        </span>
        {rightIcon && (
          <span className={styles.right}>
            <Icon name={rightIcon} />
          </span>
        )}
      </button>

      {inputHint != null && (
        <HintLabel id={hintId} size="md" tone={hintTone}>
          {inputHint}
        </HintLabel>
      )}
    </div>
  )
}
