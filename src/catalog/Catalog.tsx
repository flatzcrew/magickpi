/*
 * Каркас stories каталога: матрица вариантов, ряд, подпись, рамка под оверлеи, ширина, локальное состояние.
 * Только раскладка — сами компоненты в stories всегда импортируются из src/components (реальные инстансы базы).
 */
import { Fragment, useState } from 'react'
import type { ReactNode } from 'react'
import s from './Catalog.module.css'

/** Несколько блоков с подписями одним холстом (AllVariants). */
export function Stack({ children }: { children: ReactNode }) {
  return <div className={s.stack}>{children}</div>
}

/** Блок с подписью оси / группы — «Type × Size», «State». */
export function Block({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={s.block}>
      {title && <h3 className={`${s.title} ui-body-1-semibold`}>{title}</h3>}
      <div className={s.scroll}>{children}</div>
    </section>
  )
}

/** Матрица: строки × столбцы, ячейка — render(r, c). */
export function Matrix<R extends string | number, C extends string | number>({
  rows,
  cols,
  render,
}: {
  rows: readonly R[]
  cols: readonly C[]
  render: (r: R, c: C) => ReactNode
}) {
  return (
    <div className={s.matrix} style={{ gridTemplateColumns: `max-content repeat(${cols.length}, max-content)` }}>
      <span />
      {cols.map((c) => (
        <span key={String(c)} className={`${s.axis} ui-caption-1-medium`}>
          {String(c)}
        </span>
      ))}
      {rows.map((r) => (
        <Fragment key={String(r)}>
          <span className={`${s.axis} ui-caption-1-medium`}>{String(r)}</span>
          {cols.map((c) => (
            <div key={String(c)} className={s.cell}>
              {render(r, c)}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

/** Ряд инстансов с переносом. */
export function Row({ children }: { children: ReactNode }) {
  return <div className={s.row}>{children}</div>
}

/** Инстанс с подписью значения под ним. */
export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.labeled}>
      {children}
      <span className={`${s.axis} ui-caption-1-normal`}>{label}</span>
    </div>
  )
}

/** Рамка для компонентов с position: fixed / absolute (Modal, Toast, Sidebar, MobileNav): держит их внутри. */
export function Frame({ children, tall, wide, flush, screen }: { children: ReactNode; tall?: boolean; wide?: boolean; flush?: boolean; screen?: boolean }) {
  return <div className={[s.frame, tall && s.tall, wide && s.wide, flush && s.flush, screen && s.screen].filter(Boolean).join(' ')}>{children}</div>
}

/** Ширина под содержимое (полосы, карточки, строки таблиц): sm 1× · md 2× · lg 3× Space/26xl · xl до 6× · nav — сайдбар экранов (240) · rail — свёрнутый сайдбар (64). */
export function Width({ size, children }: { size: 'sm' | 'md' | 'lg' | 'xl' | 'nav' | 'rail'; children: ReactNode }) {
  return <div className={s[`w-${size}`]}>{children}</div>
}

/** Локальное состояние для живых stories (value / onChange). */
export function Stateful<T>({ initial, children }: { initial: T; children: (v: T, set: (v: T) => void) => ReactNode }) {
  const [v, set] = useState(initial)
  return <>{children(v, set)}</>
}
