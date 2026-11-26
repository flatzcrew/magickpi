import type { LabelHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './InputLabel.module.css'

/** InputLabel — Figma: кит, `Input-label` `12021:6068`. Подпись над полем. */
export type InputLabelSize = 'sm' | 'md' | 'lg'

const TEXT_CLASS: Record<InputLabelSize, [string, string]> = {
  sm: ['ui-caption-2-medium', 'ui-caption-2-normal'],
  md: ['ui-para-medium', 'ui-para-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
}

export interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** 📐 Size */
  size?: InputLabelSize
  /** Primary-text — текст подписи. */
  children?: ReactNode
  /** 🖍️ Support-text — пояснение в скобках, Text/low-em. */
  supportText?: ReactNode
  /** Icon + → Select-icon — имя иконки справа (16). */
  icon?: string
  /** Недоступно: тексты Text/base-em (оверрайд из InputField disabled). */
  disabled?: boolean
}

export function InputLabel({
  size = 'md',
  children,
  supportText,
  icon,
  disabled,
  className,
  ...rest
}: InputLabelProps) {
  const [primaryClass, secondaryClass] = TEXT_CLASS[size]
  return (
    <label
      {...rest}
      data-disabled={disabled || undefined}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      {children != null && <span className={[styles.primaryText, primaryClass].join(' ')}>{children}</span>}
      {supportText != null && (
        <span className={[styles.secondaryText, secondaryClass].join(' ')}>{supportText}</span>
      )}
      {icon && <Icon name={icon} size={16} className={styles.icon} />}
    </label>
  )
}
