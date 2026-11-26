import type { HTMLAttributes } from 'react'
import { Button } from '../Button'
import type { ButtonProps, ButtonSize, ButtonType } from '../Button'
import styles from './ButtonGroup.module.css'

/** ButtonGroup — группа кнопок, слитная или с промежутками. Figma: кит, `Button-group` `12147:7059`. */
export type ButtonGroupType = 'combined' | 'spaced-out'
export type ButtonGroupSize = ButtonSize

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** ☘️ Type: combined — слитно, spaced-out — с промежутками. */
  type?: ButtonGroupType
  /** 📐 Size — Size всех кнопок: xs 24 · sm 32 · md 40 · lg 48 · xl 56. */
  size?: ButtonGroupSize
  /** Кнопки (в ките 2–6). Size задаёт группа; type кнопки по умолчанию — buttonType. */
  items: Omit<ButtonProps, 'size'>[]
  /** Type кнопок, если у кнопки не задан свой (в ките — tertiary). */
  buttonType?: ButtonType
}

export function ButtonGroup({
  type = 'combined',
  size = 'xs',
  items,
  buttonType = 'tertiary',
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div {...rest} role="group" className={[styles.root, styles[type], styles[size], className].filter(Boolean).join(' ')}>
      {items.map(({ className: itemClass, type: itemType, ...item }, index) => (
        <Button
          key={index}
          {...item}
          type={itemType ?? buttonType}
          size={size}
          className={[styles.item, itemClass].filter(Boolean).join(' ')}
        />
      ))}
    </div>
  )
}
