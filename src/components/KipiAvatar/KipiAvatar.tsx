import { useEffect, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'
import kipiWelcome from '../../assets/kipi/kipi-welcome.svg'
import kipiIdle from '../../assets/kipi/kipi-idle.svg'
import kipiThinking from '../../assets/kipi/kipi-thinking.svg'
import kipiError from '../../assets/kipi/kipi-error.svg'
import kipiSuccess from '../../assets/kipi/kipi-success.svg'
import styles from './KipiAvatar.module.css'

/**
 * KipiAvatar — персонаж-ассистент Кипи. Figma: kpi-bro · web, ext · illustration `KipiAvatar` `165:719`.
 * Не аватар пользователя. Состояние нельзя передавать только персонажем — рядом нужен текст.
 */
export type KipiAvatarState = 'welcome' | 'idle' | 'thinking' | 'error' | 'success'
export type KipiAvatarSize = 36 | 96

/** Art — SVG дизайнера (prototype/assets/kipi, копия в src/assets/kipi), исключение «иллюстрация» CONTRACT ext п.6. */
const ART: Record<KipiAvatarState, string> = {
  welcome: kipiWelcome,
  idle: kipiIdle,
  thinking: kipiThinking,
  error: kipiError,
  success: kipiSuccess,
}

export interface KipiAvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** State: welcome · idle · thinking · error · success */
  state?: KipiAvatarState
  /** Size: 36 (Space/11xl) · 96 (Space/22xl, пустые экраны) */
  size?: KipiAvatarSize
  /** Доступное имя. Без него иллюстрация декоративная. */
  label?: string
  /**
   * Повод подпрыгнуть: любое новое значение (счётчик кликов и т. п.) — Кипи слегка подпрыгивает.
   * Смена `state` подбрасывает его и без этого пропа; первый показ — без прыжка.
   */
  bounceKey?: string | number
}

export function KipiAvatar({ state = 'welcome', size = 36, label, bounceKey, className, ...rest }: KipiAvatarProps) {
  // Прыжок перезапускается сменой класса bounce-a ↔ bounce-b (одна и та же анимация под двумя именами)
  const trigger = `${state}|${bounceKey ?? ''}`
  const prev = useRef(trigger)
  const [phase, setPhase] = useState<'' | 'a' | 'b'>('')
  useEffect(() => {
    if (prev.current === trigger) return // первый показ (и повторный эффект StrictMode) — без прыжка
    prev.current = trigger
    setPhase((p) => (p === 'a' ? 'b' : 'a'))
  }, [trigger])
  return (
    <span
      {...rest}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-state={state}
      className={[styles.root, styles[`size-${size}`], phase && styles[`bounce-${phase}`], className].filter(Boolean).join(' ')}
    >
      <img className={styles.art} src={ART[state]} alt="" draggable={false} />
    </span>
  )
}
