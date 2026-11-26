import type { HTMLAttributes, ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './InfoNote.module.css'

/** InfoNote — компактная поясняющая заметка. Figma: кит, `Info-note` `12126:4670` (6 состояний × 3 размера). */
export type InfoNoteState = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'brand'
export type InfoNoteSize = 'sm' | 'md' | 'lg'

const TEXT_CLASS: Record<InfoNoteSize, string> = {
  sm: 'ui-caption-2-normal',
  md: 'ui-para-medium',
  lg: 'ui-body-2-medium',
}

export interface InfoNoteProps extends HTMLAttributes<HTMLDivElement> {
  /** 💡 State — цвет заметки (не интерактивное состояние). */
  state?: InfoNoteState
  /** 📐 Size: sm · md · lg (иконка 16 · 20 · 24). */
  size?: InfoNoteSize
  /** Icon (в Figma boolean, по умолчанию показан) — имя иконки; `false` скрывает. */
  icon?: string | false
  /** ↪ Primary-text */
  children?: ReactNode
}

/** Дефолты — как дефолтный вариант Figma: State=default, Size=sm, иконка Info. Ширина — по родителю (Fill). */
export function InfoNote({ state = 'default', size = 'sm', icon = 'info', children, className, ...rest }: InfoNoteProps) {
  return (
    <div {...rest} data-state={state} className={[styles.root, styles[state], styles[size], className].filter(Boolean).join(' ')}>
      {icon && <Icon name={icon} className={styles.icon} />}
      <div className={styles.text}>
        <span className={TEXT_CLASS[size]}>{children}</span>
      </div>
    </div>
  )
}
