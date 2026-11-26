import type { ReactNode } from 'react'
import { Toggle } from '../Toggle'
import type { ToggleProps } from '../Toggle'
import { LabelText } from '../CheckboxLabel'
import type { LabelDirection, LabelSize } from '../CheckboxLabel'
import labelStyles from '../CheckboxLabel/CheckboxLabel.module.css'

/**
 * ToggleLabel — переключатель с подписью и описанием. Figma: кит, `Toggle-label` `10101:3995`.
 * Раскладка и типографика — общий модуль CheckboxLabel. Toggle: sm → 40×28, md → 48×28.
 */
export interface ToggleLabelProps extends Omit<ToggleProps, 'size' | 'children'> {
  /** 🧭 Direction — left: переключатель слева от текста, right — справа. */
  direction?: LabelDirection
  /** 📐 Size: sm (Toggle sm) · md (Toggle md). */
  size?: LabelSize
  /** Label — основной текст. */
  children?: ReactNode
  /** Description — вторая строка (булево `Description` в Figma). */
  description?: ReactNode
}

export function ToggleLabel({
  direction = 'left',
  size = 'sm',
  children,
  description,
  className,
  style,
  ...control
}: ToggleLabelProps) {
  return (
    <label
      className={[labelStyles.root, labelStyles[direction], labelStyles[size], className].filter(Boolean).join(' ')}
      style={style}
    >
      <Toggle {...control} size={size} />
      <LabelText size={size} label={children} description={description} />
    </label>
  )
}
