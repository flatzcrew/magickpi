import { Button } from '../Button'
import type { ButtonProps } from '../Button'
import styles from './ButtonSuccess.module.css'

/**
 * ButtonSuccess — кнопка подтверждающего действия (одобрить, принять). Figma: кит, `Button-success` `10078:1874` (6 типов × 5 размеров × 4 состояния).
 * Тот же набор, что Button, разведённый по цвету: размеры, слоты и состояния берутся из Button,
 * этот модуль перекрывает только цветовые переменные Type.
 */
export type ButtonSuccessType = 'primary' | 'primary-gradient' | 'primary-light' | 'secondary' | 'tertiary' | 'quaternary'

export interface ButtonSuccessProps extends Omit<ButtonProps, 'type'> {
  /** ☘️ Type (у Button-success нет neutral · flat · primary-flat) */
  type?: ButtonSuccessType
}

/** Дефолты — как дефолтный вариант Figma: Type=primary, Size=xs, State=default. */
export function ButtonSuccess({ type = 'primary', size = 'xs', className, ...rest }: ButtonSuccessProps) {
  return (
    <Button
      {...rest}
      type={type}
      size={size}
      className={[styles.root, styles[type], className].filter(Boolean).join(' ')}
    />
  )
}
