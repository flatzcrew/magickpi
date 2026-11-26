import type { HTMLAttributes } from 'react'
import { IconButton } from '../IconButton'
import type { IconButtonProps, IconButtonSize, IconButtonType } from '../IconButton'
import groupStyles from '../ButtonGroup/ButtonGroup.module.css'

/**
 * IconButtonGroup — слитная группа icon-кнопок. Figma: кит, `Icon-button-group` `12147:7934`.
 * Раскладка — модуль ButtonGroup (Type combined); в ките отдельного Type нет.
 */
export type IconButtonGroupSize = IconButtonSize

export interface IconButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** 📐 Size — Size всех кнопок: xs 24 · sm 32 · md 40 · lg 48 · xl 56. */
  size?: IconButtonGroupSize
  /** Icon-кнопки (в ките 2–6); у каждой обязателен aria-label. */
  items: Omit<IconButtonProps, 'size'>[]
  /** Type кнопок, если у кнопки не задан свой (в ките — tertiary). */
  buttonType?: IconButtonType
}

export function IconButtonGroup({ size = 'xs', items, buttonType = 'tertiary', className, ...rest }: IconButtonGroupProps) {
  return (
    <div
      {...rest}
      role="group"
      className={[groupStyles.root, groupStyles.combined, className].filter(Boolean).join(' ')}
    >
      {items.map(({ className: itemClass, type: itemType, ...item }, index) => (
        <IconButton
          key={index}
          {...item}
          type={itemType ?? buttonType}
          size={size}
          className={[groupStyles.item, itemClass].filter(Boolean).join(' ')}
        />
      ))}
    </div>
  )
}
