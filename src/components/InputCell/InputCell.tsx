import type { InputHTMLAttributes, MouseEventHandler, ReactNode, TextareaHTMLAttributes } from 'react'
import { Icon } from '../Icon'
import { Button } from '../Button'
import type { ButtonSize } from '../Button'
import styles from './InputCell.module.css'

/** InputCell — Figma: кит, `Input-cell` `8016:286`. Сама ячейка поля; рамку состояний задаёт InputField. */
export type InputCellType = 'default' | 'default-with-button' | 'textarea'
export type InputCellSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Состояние ячейки. В Figma у Input-cell нет State: это оверрайды инстанса в Input-field
 * (значения совпадают с Input-field.State без digit-вариантов). Нативно: hover — :hover,
 * active — :focus-within, disabled — атрибут, filled — по наличию значения.
 */
export type InputCellState =
  | 'default'
  | 'hover'
  | 'filled'
  | 'active'
  | 'danger'
  | 'disabled'
  | 'naked'
  | 'default-dark'
  | 'default-dark-hover'
  | 'filled-dark'
  | 'naked-disabled'

const TEXT_CLASS: Record<InputCellSize, [string, string]> = {
  xs: ['ui-caption-1-medium', 'ui-caption-1-normal'],
  sm: ['ui-caption-2-medium', 'ui-caption-2-normal'],
  md: ['ui-body-1-medium', 'ui-body-1-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
  xl: ['ui-title-2-medium', 'ui-title-2-normal'],
}

/** Кнопка в default-with-button: Button tertiary на размер меньше (xs -> xs). */
const BUTTON_SIZE: Record<InputCellSize, ButtonSize> = { xs: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' }

export interface InputCellProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** ☘️ Type */
  type?: InputCellType
  /** 📐 Size: высота xs 24 · sm 32 · md 40 · lg 48 · xl 56 (textarea — от 56 до 128) */
  size?: InputCellSize
  /** Оверрайд состояния (из InputField / для каталога). */
  state?: InputCellState
  /** ↪ Secondary-text — суффикс после значения, Text/low-em. */
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
  /** HTML type поля ввода (text, email, number…). */
  htmlType?: InputHTMLAttributes<HTMLInputElement>['type']
  /** textarea: число строк. */
  rows?: number
  /** Класс корня ячейки. */
  className?: string
}

export function InputCell({
  type = 'default',
  size = 'md',
  state,
  secondaryText,
  leftIcon,
  rightIcon,
  image,
  buttonText = 'Отправить',
  onButtonClick,
  htmlType = 'text',
  rows,
  disabled,
  className,
  ...rest
}: InputCellProps) {
  const isDisabled = disabled || state === 'disabled' || state === 'naked-disabled'
  const [primaryClass, secondaryClass] = TEXT_CLASS[size]
  const rootClass = [styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')

  if (type === 'textarea') {
    return (
      <div className={rootClass} data-state={state} data-disabled={isDisabled || undefined}>
        <span className={styles.text}>
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows}
            disabled={isDisabled}
            className={[styles.control, primaryClass].join(' ')}
          />
        </span>
        <Icon name="resize" className={styles.resize} />
      </div>
    )
  }

  return (
    <div className={rootClass} data-state={state} data-disabled={isDisabled || undefined}>
      {(image || leftIcon) && (
        <span className={styles.left}>
          {image && <img className={styles.image} src={image} alt="" />}
          {leftIcon && <Icon name={leftIcon} />}
        </span>
      )}
      <span className={styles.text}>
        <input {...rest} type={htmlType} disabled={isDisabled} className={[styles.control, primaryClass].join(' ')} />
        {secondaryText != null && (
          <span className={[styles.secondaryText, secondaryClass].join(' ')}>{secondaryText}</span>
        )}
      </span>
      {rightIcon && (
        <span className={styles.right}>
          <Icon name={rightIcon} />
        </span>
      )}
      {type === 'default-with-button' && (
        <span className={styles.buttonGroup}>
          <Button type="tertiary" size={BUTTON_SIZE[size]} disabled={isDisabled} onClick={onButtonClick}>
            {buttonText}
          </Button>
        </span>
      )}
    </div>
  )
}
