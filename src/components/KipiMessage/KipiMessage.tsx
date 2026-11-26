import type { HTMLAttributes, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import { KipiAvatar } from '../KipiAvatar'
import styles from './KipiMessage.module.css'

/**
 * KipiMessage — реплика в чате Кипи. Figma: kpi-bro · web, ext `KipiMessage` `174:1350` (4 ячейки), сверено 2026-11-26.
 * Author=kipi — KipiAvatar 36 (idle · thinking · error) + пузырь; Author=user — пузырь справа + Avatar кита image sm.
 * Error не передаётся только персонажем: текст обязателен. Подсказки-чипы и результаты поиска — вне компонента.
 */
export type KipiMessageAuthor = 'kipi' | 'user'
/** State: у Author=user только default. */
export type KipiMessageState = 'default' | 'thinking' | 'error'

const KIPI_STATE = { default: 'idle', thinking: 'thinking', error: 'error' } as const

export interface KipiMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Author: kipi · user */
  author?: KipiMessageAuthor
  /** State: default · thinking · error (у user игнорируется) */
  state?: KipiMessageState
  /** text — текст реплики. */
  text?: ReactNode
  /** Author=user: картинка Avatar (Type=image). */
  avatarSrc?: string
}

export function KipiMessage({
  author = 'kipi',
  state = 'default',
  text = 'Добрый день, Андрей! За ноябрь у команды 8 задач ждут вашего решения. С чего начнём?',
  avatarSrc,
  className,
  ...rest
}: KipiMessageProps) {
  const isKipi = author === 'kipi'
  const cellState = isKipi ? state : 'default'
  return (
    <div
      {...rest}
      data-state={cellState}
      aria-busy={cellState === 'thinking' || undefined}
      className={[styles.root, styles[author], className].filter(Boolean).join(' ')}
    >
      {isKipi && <KipiAvatar state={KIPI_STATE[cellState]} size={36} />}
      <div className={styles.bubble}>
        <p className={[styles.text, 'ui-body-2-normal'].join(' ')}>
          {text}
          {cellState === 'thinking' && (
            <span className={styles.typing} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          )}
        </p>
      </div>
      {!isKipi && <Avatar type="image" size="sm" src={avatarSrc} className={styles.avatar} />}
    </div>
  )
}
