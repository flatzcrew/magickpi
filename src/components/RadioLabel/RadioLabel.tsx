import type { ReactNode } from 'react'
import { Radio } from '../Radio'
import type { RadioProps } from '../Radio'
import { LabelText } from '../CheckboxLabel'
import type { LabelDirection, LabelSize } from '../CheckboxLabel'
import labelStyles from '../CheckboxLabel/CheckboxLabel.module.css'

/**
 * RadioLabel — радиокнопка с подписью и описанием. Figma: кит, `Radio-label` `10100:3931`.
 * Раскладка и типографика — общий модуль CheckboxLabel (наборы совпадают один в один).
 */
export interface RadioLabelProps extends Omit<RadioProps, 'size' | 'children'> {
  /** 🧭 Direction — left: радио слева от текста, right — справа. */
  direction?: LabelDirection
  /** 📐 Size: sm (радио sm 20) · md (радио md 24). */
  size?: LabelSize
  /** Label — основной текст. */
  children?: ReactNode
  /** Description — вторая строка (булево `Description` в Figma). */
  description?: ReactNode
}

export function RadioLabel({
  direction = 'left',
  size = 'sm',
  children,
  description,
  className,
  style,
  ...control
}: RadioLabelProps) {
  return (
    <label
      className={[labelStyles.root, labelStyles[direction], labelStyles[size], className].filter(Boolean).join(' ')}
      style={style}
    >
      <Radio {...control} size={size} />
      <LabelText size={size} label={children} description={description} />
    </label>
  )
}
