import { useId, useState } from 'react'
import type {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'
import { Icon } from '../Icon'
import { Button } from '../Button'
import styles from './InputCellSpecial.module.css'

/**
 * InputCellSpecial — Figma: кит, `Input-cell-special` `12041:566`.
 * Ячейка с «плавающей» подписью: resting — подпись на месте значения, pressed — подпись
 * уменьшается и уходит наверх, под ней значение. Рамку состояний поля задаёт InputFieldSpecial.
 */
export type InputCellSpecialType = 'default' | 'default-with-button' | 'textarea'
export type InputCellSpecialSize = 'md' | 'lg'
export type InputCellSpecialState = 'resting' | 'pressed'

/**
 * Оверрайд оформления из InputFieldSpecial (в Figma у ячейки это не вариант, а оверрайды инстанса).
 * Значения = InputFieldSpecial.State.
 */
export type InputCellSpecialTone =
  | 'default'
  | 'hover'
  | 'default-dark'
  | 'filled'
  | 'active'
  | 'danger'
  | 'disabled'
  | 'filled-dark'
  | 'hover-dark'

/** [подпись resting, подпись pressed, значение, Secondary-text] по Size. */
const TEXT_CLASS: Record<InputCellSpecialSize, [string, string, string, string]> = {
  md: ['ui-para-medium', 'ui-caption-1-normal', 'ui-para-medium', 'ui-para-normal'],
  lg: ['ui-body-2-medium', 'ui-caption-2-normal', 'ui-body-2-medium', 'ui-body-2-normal'],
}
/** Подпись resting: Primary — medium, Support-text — normal того же размера. */
const LABEL_SUPPORT_CLASS: Record<InputCellSpecialSize, string> = {
  md: 'ui-para-normal',
  lg: 'ui-body-2-normal',
}

export interface InputCellSpecialProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'placeholder'> {
  /** ☘️ Type */
  type?: InputCellSpecialType
  /** 📐 Size: высота md 56 · lg 64 (textarea 96 · 104) */
  size?: InputCellSpecialSize
  /**
   * 💡 State — принудительно для каталога. В работе pressed включается сам: фокус или непустое значение.
   */
  state?: InputCellSpecialState
  /** Оверрайд оформления из InputFieldSpecial (не задан — цвета самой ячейки, как в наборе Input-cell-special). */
  tone?: InputCellSpecialTone
  /** Label / Primary-text — плавающая подпись. */
  label?: ReactNode
  /** 🖍️ Label-support-text — пояснение к подписи. */
  labelSupportText?: ReactNode
  /** Secondary-text — суффикс после значения. */
  secondaryText?: ReactNode
  /** ↪ Left-icon + → Select-left-icon */
  leftIcon?: string
  /** ↪ Right-icon + → Select-right-icon */
  rightIcon?: string
  /** ↪ 🏞️ Image — src круглой картинки слева. */
  image?: string
  /** default-with-button: текст кнопки (Button tertiary). */
  buttonText?: ReactNode
  onButtonClick?: MouseEventHandler<HTMLButtonElement>
  /** HTML type поля ввода. */
  htmlType?: InputHTMLAttributes<HTMLInputElement>['type']
  /** textarea: число строк. */
  rows?: number
  className?: string
}

export function InputCellSpecial({
  type = 'default',
  size = 'md',
  state,
  tone,
  label,
  labelSupportText,
  secondaryText,
  leftIcon,
  rightIcon,
  image,
  buttonText = 'Отправить',
  onButtonClick,
  htmlType = 'text',
  rows = 2,
  disabled,
  className,
  id,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: InputCellSpecialProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [focused, setFocused] = useState(false)
  const [innerValue, setInnerValue] = useState(String(defaultValue ?? ''))
  const currentValue = value !== undefined ? String(value ?? '') : innerValue
  const isDisabled = disabled || tone === 'disabled'
  const pressed = state ? state === 'pressed' : focused || currentValue.length > 0
  const [labelRest, labelPressed, valueClass, secondaryClass] = TEXT_CLASS[size]

  const handleChange = (e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    if (value === undefined) setInnerValue(e.target.value)
    onChange?.(e)
  }
  const handleFocus = (e: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    setFocused(true)
    onFocus?.(e)
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    setFocused(false)
    onBlur?.(e)
  }

  const controlProps = {
    id: inputId,
    disabled: isDisabled,
    value,
    defaultValue: value === undefined ? defaultValue : undefined,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    className: [styles.control, valueClass].join(' '),
  }

  const labelNode = label != null && (
    <label htmlFor={inputId} className={styles.label}>
      <span className={[styles.labelText, pressed ? labelPressed : labelRest].join(' ')}>{label}</span>
      {labelSupportText != null && type !== 'textarea' && (
        <span className={[styles.labelSupport, pressed ? labelPressed : LABEL_SUPPORT_CLASS[size]].join(' ')}>
          {labelSupportText}
        </span>
      )}
    </label>
  )

  return (
    <div
      data-state={pressed ? 'pressed' : 'resting'}
      data-tone={tone}
      data-disabled={isDisabled || undefined}
      className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}
    >
      {type !== 'textarea' && (image || leftIcon) && (
        <span className={styles.left}>
          {image && <img className={styles.image} src={image} alt="" />}
          {leftIcon && <Icon name={leftIcon} className={styles.leftIcon} />}
        </span>
      )}

      <span className={styles.text}>
        {labelNode}
        <span className={styles.wrap}>
          {type === 'textarea' ? (
            <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...controlProps} rows={rows} />
          ) : (
            <input {...rest} {...controlProps} type={htmlType} />
          )}
          {secondaryText != null && type !== 'textarea' && (
            <span className={[styles.secondaryText, secondaryClass].join(' ')}>{secondaryText}</span>
          )}
        </span>
      </span>

      {type === 'textarea' ? (
        <Icon name="resize" className={styles.resize} />
      ) : (
        rightIcon && (
          <span className={styles.right}>
            <Icon name={rightIcon} />
          </span>
        )
      )}

      {type === 'default-with-button' && (
        <span className={styles.buttonGroup}>
          <Button type="tertiary" size={size} disabled={isDisabled} onClick={onButtonClick}>
            {buttonText}
          </Button>
        </span>
      )}
    </div>
  )
}
