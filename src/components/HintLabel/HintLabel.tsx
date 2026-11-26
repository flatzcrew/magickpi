import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './HintLabel.module.css'

/** HintLabel — Figma: кит, `Hint-label` `12021:6331`. Подсказка / ошибка под полем. */
export type HintLabelSize = 'sm' | 'md' | 'lg'

const TEXT_CLASS: Record<HintLabelSize, [string, string]> = {
  sm: ['ui-caption-2-medium', 'ui-caption-2-normal'],
  md: ['ui-para-medium', 'ui-para-normal'],
  lg: ['ui-body-2-medium', 'ui-body-2-normal'],
}

/** Оверрайды из InputField: danger — Text/danger-med-em, disabled — Text/base-em. */
export type HintLabelTone = 'default' | 'danger' | 'disabled'

export interface HintLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** 📐 Size */
  size?: HintLabelSize
  /** Primary-text — текст подсказки. */
  children?: ReactNode
  /** 🖍️ Support-text — пояснение, Text/low-em. */
  supportText?: ReactNode
  /** Icon + → Select-icon — имя иконки слева (16). */
  icon?: string
  /** Тон текста (оверрайд инстанса в InputField, в Figma не вариант). */
  tone?: HintLabelTone
}

export function HintLabel({
  size = 'md',
  children,
  supportText,
  icon,
  tone = 'default',
  className,
  ...rest
}: HintLabelProps) {
  const [primaryClass, secondaryClass] = TEXT_CLASS[size]
  return (
    <div {...rest} data-tone={tone} className={[styles.root, styles[tone], className].filter(Boolean).join(' ')}>
      {icon && <Icon name={icon} size={16} className={styles.icon} />}
      {children != null && <span className={[styles.primaryText, primaryClass].join(' ')}>{children}</span>}
      {supportText != null && (
        <span className={[styles.secondaryText, secondaryClass].join(' ')}>{supportText}</span>
      )}
    </div>
  )
}
