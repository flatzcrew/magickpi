import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { IconButton } from '../IconButton'
import { Button } from '../Button'
import { InputField } from '../InputField'
import { DividerVertical } from '../DividerVertical'
import { Dropdown } from '../Dropdown'
import styles from './Pagination.module.css'

/**
 * Pagination — постраничная навигация. Figma: кит, `Pagination` `12124:22612`.
 * first · center · last — ряд номеров (Button sm: текущая secondary, остальные quaternary) между стрелками
 * (Icon-button tertiary sm) + слот Right (переход к странице и «строк на странице»).
 * less-pages — Prev / «1 / 10» / Next; mobile — номера и под ними «строк на странице»; load-more — счётчик и «Загрузить ещё».
 * Номера считаются из current / total; Page задаёт раскладку (first · center · last дают одинаковую).
 */
export type PaginationPage = 'first' | 'center' | 'last' | 'less-pages' | 'mobile' | 'load-more'

type Slot = number | 'gap'

/** Окно номеров: 7 ячеек (first / last), 9 ячеек (center), 6 — mobile. */
function pageSlots(current: number, total: number, mobile: boolean): Slot[] {
  const all = Array.from({ length: total }, (_, i) => i + 1)
  const max = mobile ? 6 : 9
  if (total <= max) return all
  const head = mobile ? 4 : 5
  if (current <= head - 1) return [...all.slice(0, head), 'gap', total]
  if (current >= total - head + 2) return [1, 'gap', ...all.slice(total - head)]
  if (mobile) return [1, 'gap', current, current + 1, 'gap', total]
  return [1, 'gap', current - 2, current - 1, current, current + 1, current + 2, 'gap', total]
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Page — раскладка (вариант Figma). */
  page?: PaginationPage
  /** Текущая страница (по умолчанию из Page: first — 1, center — середина, last — total). */
  current?: number
  /** Всего страниц. */
  total?: number
  onChange?: (page: number) => void
  /** ℹ️ Additional-info — слот Right (переход и «строк на странице»). */
  additionalInfo?: boolean
  /** ↪ Goto-page — «Перейти к странице» с полем ввода. */
  gotoPage?: boolean
  /** ↪ Results-count — «Строк на странице» с Dropdown. */
  resultsCount?: boolean
  /** Подпись перехода к странице. */
  gotoLabel?: ReactNode
  /** Подпись выбора количества строк. */
  resultsLabel?: ReactNode
  /** Строк на странице (значение Dropdown). */
  pageSize?: ReactNode
  /** Клик по Dropdown «строк на странице» — открыть внешний Dropmenu. */
  onPageSizeClick?: MouseEventHandler<HTMLButtonElement>
  /** Right — заменить содержимое слота Right своим. */
  right?: ReactNode
  /** load-more: сколько показано. */
  shown?: number
  /** load-more: всего результатов. */
  totalResults?: number
  /** load-more: подпись кнопки. */
  loadMoreLabel?: ReactNode
  onLoadMore?: MouseEventHandler<HTMLButtonElement>
}

export function Pagination({
  page = 'first',
  current,
  total = 10,
  onChange,
  additionalInfo = true,
  gotoPage = true,
  resultsCount = true,
  gotoLabel = 'Перейти к странице:',
  resultsLabel = 'Строк на странице:',
  pageSize = 10,
  onPageSizeClick,
  right,
  shown = 35,
  totalResults = 2979,
  loadMoreLabel = 'Загрузить ещё',
  onLoadMore,
  className,
  ...rest
}: PaginationProps) {
  const active = current ?? (page === 'last' ? total : page === 'center' ? Math.ceil(total / 2) : 1)
  const go = (p: number) => onChange?.(Math.min(total, Math.max(1, p)))
  const rootClass = [styles.root, styles[page], className].filter(Boolean).join(' ')

  if (page === 'load-more') {
    return (
      <nav aria-label="Пагинация" {...rest} className={rootClass}>
        <p className={[styles.info, 'ui-para-normal'].join(' ')}>
          Отображается <span className={styles.infoAccent}>{shown}</span> из {totalResults}
        </p>
        <Button type="secondary" size="sm" onClick={onLoadMore}>
          {loadMoreLabel}
        </Button>
      </nav>
    )
  }

  if (page === 'less-pages') {
    return (
      <nav aria-label="Пагинация" {...rest} className={rootClass}>
        <div className={styles.pages}>
          <Button type="secondary" size="sm" leftIcon="chevron-left" disabled={active <= 1} onClick={() => go(active - 1)}>
            Назад
          </Button>
          <span className={[styles.counter, 'ui-para-normal'].join(' ')} aria-current="page">
            <span className={styles.counterActive}>{active}</span>
            <span className={styles.counterTotal}>/ {total}</span>
          </span>
          <Button type="secondary" size="sm" rightIcon="chevron-right" disabled={active >= total} onClick={() => go(active + 1)}>
            Далее
          </Button>
        </div>
      </nav>
    )
  }

  const mobile = page === 'mobile'
  const slots = pageSlots(active, total, mobile)
  const showRight = additionalInfo && (right != null || gotoPage || resultsCount)

  return (
    <nav aria-label="Пагинация" {...rest} className={rootClass}>
      <div className={styles.pages}>
        <IconButton
          type="tertiary"
          size="sm"
          icon="chevron-left"
          aria-label="Предыдущая страница"
          disabled={active <= 1}
          onClick={() => go(active - 1)}
        />
        <div className={styles.numbers}>
          {slots.map((slot, i) =>
            slot === 'gap' ? (
              <Button key={`gap-${i}`} type="quaternary" size="sm" disabled aria-hidden="true" tabIndex={-1}>
                ...
              </Button>
            ) : (
              <Button
                key={slot}
                type={slot === active ? 'secondary' : 'quaternary'}
                size="sm"
                aria-current={slot === active ? 'page' : undefined}
                onClick={() => go(slot)}
              >
                {slot}
              </Button>
            ),
          )}
        </div>
        <IconButton
          type="tertiary"
          size="sm"
          icon="chevron-right"
          aria-label="Следующая страница"
          disabled={active >= total}
          onClick={() => go(active + 1)}
        />
      </div>

      {showRight && (
        <div className={styles.right}>
          {right ?? (
            <>
              {gotoPage && !mobile && (
                <label className={styles.results}>
                  <span className={[styles.label, 'ui-para-normal'].join(' ')}>{gotoLabel}</span>
                  <span className={styles.goto}>
                    <InputField
                      state="default-dark"
                      size="sm"
                      htmlType="number"
                      min={1}
                      max={total}
                      placeholder={String(active)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') go(Number((e.target as HTMLInputElement).value) || active)
                      }}
                    />
                  </span>
                </label>
              )}
              {gotoPage && resultsCount && !mobile && <DividerVertical className={styles.divider} />}
              {resultsCount && (
                <div className={styles.results}>
                  <span className={[styles.label, 'ui-para-normal'].join(' ')}>{resultsLabel}</span>
                  <span className={styles.pageSize}>
                    <Dropdown value={pageSize} onClick={onPageSizeClick} aria-label={typeof resultsLabel === 'string' ? resultsLabel : undefined} />
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  )
}
