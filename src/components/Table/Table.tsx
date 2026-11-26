import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { TableCell } from '../TableCell'
import type { TableCellProps } from '../TableCell'
import { Pagination } from '../Pagination'
import type { PaginationProps } from '../Pagination'
import { Scroller } from '../Scroller'
import styles from './Table.module.css'

/**
 * Table — таблица целиком. Figma: кит, `Table` `12123:12697` (одиночный; +3: Pagination, Scroller, Sheet).
 * Sheet в ките — колонки (Col) из Table-cell: первая — header md, дальше — default lg.
 * В React Sheet собран сеткой по строкам (role table / row), ширины колонок — `width` в колонке.
 */
export interface TableColumn {
  key: string
  /** Заголовок колонки — Primary-text у Table-cell header. */
  title?: ReactNode
  /** Ширина колонки (CSS: `var(--space-…)`, `1fr`, `minmax(…)`). По умолчанию 1fr. */
  width?: string
  /** Оверрайды ячейки-заголовка (checkbox, иконки и т. п.). */
  header?: Omit<TableCellProps, 'type'>
}

export interface TableRow {
  id: string
  /** Ячейки по key колонки: содержимое (Primary-text) или пропсы Table-cell. */
  cells: Record<string, ReactNode | Omit<TableCellProps, 'type'>>
}

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn[]
  rows?: TableRow[]
  /** Size ячеек тела (в ките lg). */
  cellSize?: TableCellProps['size']
  /** Pagination под таблицей; false — скрыть. */
  pagination?: PaginationProps | false
  /** Scroller — полоса прокрутки справа. */
  scroller?: boolean
  /** Sheet — заменить сетку своим содержимым. */
  sheet?: ReactNode
  /**
   * Открыть строку (матрицу сотрудника, задачу…): клик по свободному месту строки или по названию, Enter / Space с клавиатуры.
   * Клики по вложенным контролам (чекбокс, кнопки, ссылки, поля, dropdown) строку не открывают.
   * Передан — строки фокусируемые, с наведением. В ките не заведено — добавлено 2026-11-26 (сценарий дизайнера).
   */
  onRowClick?: (row: TableRow) => void
}

const INTERACTIVE = 'button, a, input, select, textarea, label, [role="button"], [role="checkbox"]'

function isCellProps(v: unknown): v is Omit<TableCellProps, 'type'> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && !('$$typeof' in v)
}

export function Table({
  columns,
  rows = [],
  cellSize = 'lg',
  pagination = {},
  scroller = true,
  sheet,
  onRowClick,
  className,
  style,
  ...rest
}: TableProps) {
  const template = columns.map((c) => c.width ?? 'minmax(0, 1fr)').join(' ')
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')} style={style}>
      <div className={styles.sheetWrap}>
        {sheet ?? (
          <div role="table" className={styles.sheet} style={{ '--table-columns': template } as CSSProperties}>
            <div role="row" className={styles.row}>
              {columns.map((c) => (
                <TableCell key={c.key} {...c.header} type="header" size="md">
                  {c.header?.children ?? c.title}
                </TableCell>
              ))}
            </div>
            {rows.map((row) => (
              <div
                role="row"
                key={row.id}
                className={[styles.row, onRowClick && styles.clickable].filter(Boolean).join(' ')}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={
                  onRowClick
                    ? (e) => {
                        const hit = (e.target as HTMLElement).closest(INTERACTIVE)
                        if (hit && e.currentTarget.contains(hit)) return
                        onRowClick(row)
                      }
                    : undefined
                }
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.target !== e.currentTarget) return
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
              >
                {columns.map((c) => {
                  const cell = row.cells[c.key]
                  return isCellProps(cell) ? (
                    <TableCell key={c.key} size={cellSize} {...cell} type="default" />
                  ) : (
                    <TableCell key={c.key} size={cellSize} type="default">
                      {cell}
                    </TableCell>
                  )
                })}
              </div>
            ))}
          </div>
        )}
        {scroller && <Scroller type="vertical" className={styles.scroller} />}
      </div>
      {pagination !== false && <Pagination {...pagination} />}
    </div>
  )
}
