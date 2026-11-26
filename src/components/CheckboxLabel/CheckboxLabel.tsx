import type { ReactNode } from 'react'
import { Checkbox } from '../Checkbox'
import type { CheckboxProps } from '../Checkbox'
import styles from './CheckboxLabel.module.css'

/** CheckboxLabel — чекбокс с подписью и описанием. Figma: кит, `Checkbox-label` `10095:3846`. */
export type LabelDirection = 'left' | 'right'
export type LabelSize = 'sm' | 'md'

/** Типостиль по Size: [Label, Description]. Общий для CheckboxLabel / RadioLabel / ToggleLabel. */
export const LABEL_TEXT_CLASS: Record<LabelSize, [string, string]> = {
  sm: ['ui-para-medium', 'ui-caption-2-normal'],
  md: ['ui-body-2-normal', 'ui-para-normal'],
}

export interface CheckboxLabelProps extends Omit<CheckboxProps, 'size' | 'children'> {
  /** 🧭 Direction — сторона контрола: left — чекбокс слева от текста, right — справа. */
  direction?: LabelDirection
  /** 📐 Size: sm (чекбокс sm 20) · md (чекбокс md 24). */
  size?: LabelSize
  /** Label — основной текст. */
  children?: ReactNode
  /** Description — второй строкой (в Figma булево `Description`; не передан — строки нет). */
  description?: ReactNode
}

export function CheckboxLabel({
  direction = 'left',
  size = 'sm',
  children,
  description,
  className,
  style,
  ...control
}: CheckboxLabelProps) {
  return (
    <label
      className={[styles.root, styles[direction], styles[size], className].filter(Boolean).join(' ')}
      style={style}
    >
      <Checkbox {...control} size={size} />
      <LabelText size={size} label={children} description={description} />
    </label>
  )
}

/** Text-wrap: Label + Description. Используется тремя *Label-компонентами. */
export function LabelText({ size, label, description }: { size: LabelSize; label?: ReactNode; description?: ReactNode }) {
  const [labelClass, descriptionClass] = LABEL_TEXT_CLASS[size]
  if (label == null && description == null) return null
  return (
    <span className={styles.text}>
      {label != null && <span className={[styles.label, labelClass].join(' ')}>{label}</span>}
      {description != null && <span className={[styles.description, descriptionClass].join(' ')}>{description}</span>}
    </span>
  )
}
