/*
 * Панель экрана — композиция по макетам kpi-bro · web (локальный TaskCreatePanel: 276:19771, 290:14897, 272:17842).
 * Не компонент ДС: собрана из ModalOverlay, IconButton, Button и т. д. базы. Используется в песочницах.
 */
import { useEffect } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { IconButton, ModalOverlay } from '../../components'
import s from './ScreenPanel.module.css'

export interface ScreenPanelProps {
  open: boolean
  onClose: () => void
  /** Заголовок в шапке (UI/heading-2 medium). */
  title: ReactNode
  /** Секции (PanelSection) — прокручиваются. */
  children: ReactNode
  /** Низ панели: кнопки, закреплены. */
  footer?: ReactNode
}

/** Панель справа поверх затемнённого экрана: закрытие — крестик, клик по подложке, Esc. */
export function ScreenPanel({ open, onClose, title, children, footer }: ScreenPanelProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className={s.layer}>
      <ModalOverlay onClick={onClose} />
      <aside className={s.panel} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <div className={`${s.section} ${s.header}`}>
          <h2 className={`${s.title} ui-heading-2-medium`}>{title}</h2>
          <IconButton type="tertiary" size="sm" icon="cross" aria-label="Закрыть" onClick={onClose} />
        </div>
        <div className={s.body}>{children}</div>
        {footer && <div className={`${s.section} ${s.footer}`}>{footer}</div>}
      </aside>
    </div>
  )
}

/** Секция панели: белая карточка; title — UI/title-2/semibold. */
export function PanelSection({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  return (
    <section className={s.section}>
      {title && <h3 className={`${s.sectionTitle} ui-title-2-semibold`}>{title}</h3>}
      {children}
    </section>
  )
}

/** Текст секции — UI/body-1/normal Text/med-em. */
export function PanelText({ children }: { children: ReactNode }) {
  return <p className={`${s.text} ui-body-1-normal`}>{children}</p>
}

/** Блок значений: пары «подпись — значение» в колонках (План · Факт · Вес…). */
export function PanelValues({ items, columns = 3 }: { items: [ReactNode, ReactNode][]; columns?: number }) {
  return (
    <div className={s.values} style={{ '--values-cols': columns } as CSSProperties}>
      {items.map(([label, value], i) => (
        <div key={i} className={s.pair}>
          <span className={`${s.pairLabel} ui-caption-2-normal`}>{label}</span>
          <span className={`${s.pairValue} ui-body-2-medium`}>{value}</span>
        </div>
      ))}
    </div>
  )
}

/** Человек: аватар + имя (UI/body-2/medium) + роль (UI/caption-2/normal). */
export function PanelPerson({ avatar, name, role }: { avatar: ReactNode; name: ReactNode; role?: ReactNode }) {
  return (
    <div className={s.person}>
      {avatar}
      <div className={s.personText}>
        <span className="ui-body-2-medium">{name}</span>
        {role && <span className={`${s.personRole} ui-caption-2-normal`}>{role}</span>}
      </div>
    </div>
  )
}

/** Вертикальный стек / ряд внутри секции (Space/md). */
export function PanelStack({ children }: { children: ReactNode }) {
  return <div className={s.stack}>{children}</div>
}
export function PanelRow({ children }: { children: ReactNode }) {
  return <div className={s.row}>{children}</div>
}

/** Значения списком сверху вниз: «подпись — значение» в строку, строки друг под другом. */
export function PanelList({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className={s.list}>
      {items.map(([label, value], i) => (
        <div key={i} className={s.listRow}>
          <dt className={`${s.listLabel} ui-body-1-normal`}>{label}</dt>
          <dd className={`${s.listValue} ui-body-2-medium`}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
