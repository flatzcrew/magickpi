import type { ChangeEvent, HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'
import { KpiStatus } from '../KpiStatus'
import type { KpiStatusStatus } from '../KpiStatus'
import kpiStyles from '../KpiStatus/KpiStatus.module.css'
import { Link } from '../Link'
import styles from './MatrixRow.module.css'

/**
 * MatrixRow — строка матрицы KPI сотрудника (desktop). Figma: kpi-bro · web, ext `MatrixRow` `176:1831` (9 ячеек), сверено 2026-11-26.
 * StatusCell [Checkbox sm · KpiStatus] · NameCell [Name · TasksLink] · Weight · Plan · Fact · Completion · Score · Weighted · ExpandCell.
 * Карточка KPI в колонке (mobile) — KpiCard.
 */
export type MatrixRowLevel = 'group' | 'item'
export type MatrixRowState = 'default' | 'hover' | 'focus'
/** Выравнивание числовых ячеек: center — мастер; end — ручная правка рядов «Оценка руководителя» на экранах (не вариант Figma). */
export type MatrixRowAlign = 'center' | 'end'
/** Статус строки: в Figma у инстанса KpiStatus exposed done · progress · fail; nodata — через noData. */
export type MatrixRowStatus = Exclude<KpiStatusStatus, 'nodata'>

export interface MatrixRowValues {
  weight?: ReactNode
  plan?: ReactNode
  fact?: ReactNode
  completion?: ReactNode
  score?: ReactNode
  weighted?: ReactNode
}

/** Демо-значения ячеек из мастера Figma. */
export const DEMO_MATRIX_ROW_VALUES: Record<MatrixRowLevel, Required<MatrixRowValues>> = {
  group: { weight: '70%', plan: '—', fact: '—', completion: '—', score: '86%', weighted: '61%' },
  item: { weight: '20%', plan: '150', fact: '162', completion: '108%', score: '110%', weighted: '22%' },
}

const STATUS_LABEL: Record<MatrixRowStatus, string> = {
  done: 'выполнен',
  progress: 'в процессе',
  fail: 'не выполнен',
}

const COLUMNS: Array<keyof MatrixRowValues> = ['weight', 'plan', 'fact', 'completion', 'score', 'weighted']

export interface MatrixRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Level: group — группа KPI (Surface/s1, шеврон); item — показатель внутри группы. */
  level?: MatrixRowLevel
  /** State: default · hover · focus — принудительно для каталога; в работе нативно. */
  state?: MatrixRowState
  /** Expanded (только group): шеврон Chevron-down → Chevron-up. */
  expanded?: boolean
  /** Нажатие на шеврон (group). */
  onExpandedChange?: (expanded: boolean) => void
  /** name — до 2 строк + «…». */
  name?: ReactNode
  /** Статус вложенного KpiStatus. */
  status?: MatrixRowStatus
  /** Текст бейджа статуса: group — подпись статуса, item — значение (в мастере «100%»). */
  statusLabel?: ReactNode
  /** data / noData: true — «нет данных» (KpiStatus nodata, ячейки «—»). */
  noData?: boolean
  /** Значения числовых ячеек. */
  values?: MatrixRowValues
  /** showCompletion — значение в ячейке Completion. */
  showCompletion?: boolean
  /** showAction — Button secondary xs «Оценить» в ячейке Completion (ряд «Оценка руководителя»). */
  showAction?: boolean
  actionLabel?: ReactNode
  onAction?: MouseEventHandler<HTMLButtonElement>
  /** showTasksLink (только group) — Link «N задачи ↓»; null — скрыт (как в Figma). */
  tasksLink?: ReactNode
  onTasksLinkClick?: MouseEventHandler<HTMLAnchorElement>
  /** Модификатор кода: выравнивание числовых ячеек (по умолчанию center, как в мастере). */
  align?: MatrixRowAlign
  /** Чекбокс в StatusCell. */
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function MatrixRow({
  level = 'group',
  state,
  expanded = false,
  onExpandedChange,
  name,
  status,
  statusLabel,
  noData = false,
  values,
  showCompletion = true,
  showAction = false,
  actionLabel = 'Оценить',
  onAction,
  tasksLink = null,
  onTasksLinkClick,
  align = 'center',
  checked = false,
  onCheckedChange,
  className,
  tabIndex = 0,
  ...rest
}: MatrixRowProps) {
  const isGroup = level === 'group'
  const rowStatus = status ?? (isGroup ? 'progress' : 'done')
  const label = statusLabel ?? (isGroup ? STATUS_LABEL[rowStatus] : '100%')
  const cells = { ...DEMO_MATRIX_ROW_VALUES[level], ...values }
  const valueClass = isGroup ? 'ui-body-1-semibold' : 'ui-body-1-normal'

  const renderValue = (key: keyof MatrixRowValues) =>
    noData ? (
      <span className={[styles.empty, 'ui-body-1-normal'].join(' ')}>—</span>
    ) : (
      <span className={[styles.value, key === 'weight' && styles.weightValue, valueClass].filter(Boolean).join(' ')}>
        {cells[key]}
      </span>
    )

  return (
    <div
      {...rest}
      tabIndex={tabIndex}
      data-state={state}
      data-align={align === 'end' ? 'end' : undefined}
      aria-expanded={isGroup ? expanded : undefined}
      className={[styles.root, styles[level], className].filter(Boolean).join(' ')}
    >
      <div className={styles.statusCell}>
        <Checkbox
          size="sm"
          checked={checked}
          onChange={onCheckedChange ? (e: ChangeEvent<HTMLInputElement>) => onCheckedChange(e.target.checked) : undefined}
          readOnly={!onCheckedChange}
          aria-label="Выбрать показатель"
        />
        {noData ? (
          <KpiStatus status="nodata" />
        ) : (
          /* KpiStatus без круга-иконки (решение дизайнера 2026-11-21): разметка и цвета — из KpiStatus.module.css. */
          <span role="status" className={[kpiStyles.root, kpiStyles[rowStatus]].filter(Boolean).join(' ')}>
            <span
              className={[kpiStyles.badge, isGroup ? kpiStyles.statusBadge : styles.itemBadge].join(' ')}
            >
              <span className={[kpiStyles.label, 'ui-caption-2-medium'].join(' ')}>{label}</span>
            </span>
          </span>
        )}
      </div>

      <div className={styles.nameCell}>
        <span className={[styles.name, valueClass].join(' ')}>
          {name ?? (isGroup ? 'Продажи' : 'Активная клиентская база')}
        </span>
        {isGroup && tasksLink != null && (
          <Link type="primary" size="sm" rightIcon="arrow-down-small" className={styles.tasksLink} onClick={onTasksLinkClick}>
            {tasksLink}
          </Link>
        )}
      </div>

      {COLUMNS.map((key) => (
        <div key={key} className={styles.cell}>
          {key === 'completion' ? (
            <>
              {showCompletion && renderValue(key)}
              {showAction && !isGroup && (
                <Button type="secondary" size="xs" onClick={onAction}>
                  {actionLabel}
                </Button>
              )}
            </>
          ) : (
            renderValue(key)
          )}
        </div>
      ))}

      <div className={styles.expandCell}>
        {isGroup && (
          <IconButton
            type="secondary"
            size="xs"
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            aria-label={expanded ? 'Свернуть' : 'Развернуть'}
            onClick={onExpandedChange ? () => onExpandedChange(!expanded) : undefined}
          />
        )}
      </div>
    </div>
  )
}
