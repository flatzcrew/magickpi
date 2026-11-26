import { useState } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { KipiAvatar } from '../KipiAvatar'
import styles from './KipiLauncher.module.css'

/**
 * KipiLauncher — плавающая кнопка вызова Кипи. Figma: kpi-bro · web, ext `KipiLauncher` `165:897` (State 4 ячейки), сверено 2026-11-26.
 * Круг 56 + KipiAvatar 36 того же State. На экране — absolute в правом нижнем углу (позиция у родителя).
 */
export type KipiLauncherState = 'idle' | 'thinking' | 'error' | 'success'

const LABEL: Record<KipiLauncherState, string> = {
  idle: 'Открыть Кипи',
  thinking: 'Кипи думает',
  error: 'Кипи: ошибка',
  success: 'Кипи: готово',
}

export interface KipiLauncherProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** State: idle · thinking · error · success — передаётся во вложенный KipiAvatar. */
  state?: KipiLauncherState
  /** HTML-атрибут type. */
  htmlType?: 'button' | 'submit' | 'reset'
}

export function KipiLauncher({ state = 'idle', htmlType = 'button', className, onClick, ...rest }: KipiLauncherProps) {
  // Клик — Кипи подпрыгивает (смена state подбрасывает его сама, внутри KipiAvatar)
  const [clicks, setClicks] = useState(0)
  return (
    <button
      {...rest}
      type={htmlType}
      aria-label={rest['aria-label'] ?? LABEL[state]}
      data-state={state}
      className={[styles.root, className].filter(Boolean).join(' ')}
      onClick={(e) => {
        setClicks((n) => n + 1)
        onClick?.(e)
      }}
    >
      <KipiAvatar state={state} size={36} bounceKey={clicks} />
    </button>
  )
}
