import type { InputHTMLAttributes, MouseEventHandler, ReactNode, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { Icon } from '../Icon'
import { Button } from '../Button'
import styles from './InputCellMobile.module.css'

/**
 * InputCellMobile — Figma: кит, `Input-cell-mobile` `53469:2145`. Ячейка мобильного поля:
 * стеклянная подложка (фон alpha + размытие Blur/48), подпись слева в строке со значением.
 * Рамку состояний задаёт InputFieldMobile.
 */
export type InputCellMobileType = 'default' | 'default-with-action' | 'textarea'
export type InputCellMobileSize = 'md' | 'lg'

/** Оверрайд оформления из InputFieldMobile (в Figma у ячейки это не вариант). Значения = InputFieldMobile.State. */
export type InputCellMobileTone = 'default' | 'filled' | 'active' | 'danger' | 'disabled'

/** [подпись и значение, подпись textarea, значение textarea] по Size. */
const TEXT_CLASS: Record<InputCellMobileSize, [string, string, string]> = {
  md: ['ui-body-2-medium', 'ui-caption-2-medium', 'ui-body-2-medium'],
  lg: ['ui-title-2-medium', 'ui-body-1-medium', 'ui-title-2-medium'],
}

/** Кнопка в default-with-action: Button secondary sm (md) / md (lg). */
const ACTION_SIZE = { md: 'sm', lg: 'md' } as const

export interface InputCellMobileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** ☘️ Type */
  type?: InputCellMobileType
  /** 📐 Size: высота md 56 · lg 64 (textarea 96 · 104) */
  size?: InputCellMobileSize
  /** Оверрайд оформления из InputFieldMobile (не задан — цвета самой ячейки). */
  tone?: InputCellMobileTone
  /** Label / Primary-text — подпись слева от значения (в textarea — над ним). В default-with-action не выводится. */
  label?: ReactNode
  /** Primary-support-text — пояснение под подписью. */
  labelSupportText?: ReactNode
  /** Secondary-support-text — пояснение под значением. */
  supportText?: ReactNode
  /** ↪ Left-icon + → Select-left-icon */
  leftIcon?: string
  /** ↪ 🏞️ Image — src круглой картинки слева. */
  image?: string
  /** default-with-action: текст кнопки действия (Button secondary). */
  actionText?: ReactNode
  onActionClick?: MouseEventHandler<HTMLButtonElement>
  /** HTML type поля ввода. */
  htmlType?: InputHTMLAttributes<HTMLInputElement>['type']
  /** textarea: число строк. */
  rows?: number
  className?: string
}

export function InputCellMobile({
  type = 'default',
  size = 'md',
  tone,
  label,
  labelSupportText,
  supportText,
  leftIcon,
  image,
  actionText = 'Изменить',
  onActionClick,
  htmlType = 'text',
  rows = 2,
  disabled,
  className,
  id,
  ...rest
}: InputCellMobileProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const isDisabled = disabled || tone === 'disabled'
  const [rowClass, taLabelClass, taValueClass] = TEXT_CLASS[size]
  const rootClass = [styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')

  if (type === 'textarea') {
    return (
      <div className={rootClass} data-tone={tone} data-disabled={isDisabled || undefined}>
        <span className={styles.text}>
          {label != null && (
            <label htmlFor={inputId} className={[styles.label, taLabelClass].join(' ')}>
              {label}
            </label>
          )}
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            id={inputId}
            rows={rows}
            disabled={isDisabled}
            className={[styles.control, taValueClass].join(' ')}
          />
        </span>
        <Icon name="resize" className={styles.resize} />
      </div>
    )
  }

  return (
    <div className={rootClass} data-tone={tone} data-disabled={isDisabled || undefined}>
      {(image || leftIcon) && (
        <span className={styles.left}>
          {image && <img className={styles.image} src={image} alt="" />}
          {leftIcon && <Icon name={leftIcon} />}
        </span>
      )}
      <span className={styles.text}>
        {type === 'default' && label != null && (
          <span className={styles.labelWrap}>
            <label htmlFor={inputId} className={[styles.label, rowClass].join(' ')}>
              {label}
            </label>
            {labelSupportText != null && (
              <span className={[styles.support, 'ui-caption-2-medium'].join(' ')}>{labelSupportText}</span>
            )}
          </span>
        )}
        <span className={styles.valueWrap}>
          <input {...rest} id={inputId} type={htmlType} disabled={isDisabled} className={[styles.control, rowClass].join(' ')} />
          {supportText != null && <span className={[styles.support, 'ui-caption-2-medium'].join(' ')}>{supportText}</span>}
        </span>
      </span>
      {type === 'default-with-action' && (
        <span className={styles.action}>
          <Button type="secondary" size={ACTION_SIZE[size]} disabled={isDisabled} onClick={onActionClick}>
            {actionText}
          </Button>
        </span>
      )}
    </div>
  )
}
