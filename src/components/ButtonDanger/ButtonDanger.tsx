import { Button } from '../Button'
import type { ButtonProps } from '../Button'
import styles from './ButtonDanger.module.css'

/**
 * ButtonDanger — кнопка деструктивного действия (удалить, отклонить). Figma: кит, `Button-danger` `10076:1687` (6 типов × 5 размеров × 4 состояния).
 * Тот же набор, что Button, разведённый по цвету: размеры, слоты и состояния берутся из Button,
 * этот модуль перекрывает только цветовые переменные Type.
 */
export type ButtonDangerType = 'primary' | 'primary-gradient' | 'primary-light' | 'secondary' | 'tertiary' | 'quaternary'

export interface ButtonDangerProps extends Omit<ButtonProps, 'type'> {
  /** ☘️ Type (у Button-danger нет neutral · flat · primary-flat) */
  type?: ButtonDangerType
}

/** Дефолты — как дефолтный вариант Figma: Type=primary, Size=xs, State=default. */
export function ButtonDanger({ type = 'primary', size = 'xs', className, ...rest }: ButtonDangerProps) {
  return (
    <Button
      {...rest}
      type={type}
      size={size}
      className={[styles.root, styles[type], className].filter(Boolean).join(' ')}
    />
  )
}
