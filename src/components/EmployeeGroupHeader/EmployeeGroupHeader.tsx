import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { CheckboxLabel } from '../CheckboxLabel'
import { Link } from '../Link'
import styles from './EmployeeGroupHeader.module.css'

/**
 * EmployeeGroupHeader — шапка группы задач сотрудника (SCR-14). Figma: kpi-bro · web, ext `EmployeeGroupHeader` `176:2694` (2 ячейки), сверено 2026-11-26.
 * Row [SelectAll · Avatar sm · Content (Name, Role) · Count · MatrixLink] · Offer (Offer=true) [OfferText · «Оценить» · «Позже»].
 * Offer — только во вкладке «Ждут закрытия» после закрытия всех задач сотрудника.
 */
export interface EmployeeGroupHeaderAction {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface EmployeeGroupHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** Offer: false · true — строка с предложением поставить оценку. */
  offer?: boolean
  /** name — 1 строка + «…». */
  name?: ReactNode
  /** role (Figma TEXT) — должность, 1 строка + «…». */
  role?: ReactNode
  /** count */
  count?: ReactNode
  /** Avatar sm, Type=text — инициалы. */
  initials?: string
  /** SelectAll — текст Checkbox-label (в Figma override в слоте). */
  selectAllLabel?: ReactNode
  /** SelectAll — состояние чекбокса: checked / indeterminate. */
  selectAllChecked?: boolean
  selectAllIndeterminate?: boolean
  onSelectAllChange?: (checked: boolean) => void
  /** MatrixLink — текст, href, обработчик. */
  matrixLabel?: ReactNode
  matrixHref?: string
  onMatrixClick?: MouseEventHandler<HTMLAnchorElement>
  /** Стрелка Arrow-right-up у ссылки на матрицу: в мастере выключена, на части экранов включена override (решение 2026-11-25). */
  matrixArrow?: boolean
  /** OfferText (в Figma override, не свойство). */
  offerText?: ReactNode
  /** Assess — Button primary-gradient sm. */
  assessAction?: EmployeeGroupHeaderAction
  /** Later — Button tertiary sm. */
  laterAction?: EmployeeGroupHeaderAction
}

export function EmployeeGroupHeader({
  offer = false,
  name = 'Пётр Сидоров',
  role = 'торговый представитель',
  count = '2 задачи',
  initials = 'ПС',
  selectAllLabel = 'Выбрать все у Петра',
  selectAllChecked = false,
  selectAllIndeterminate,
  onSelectAllChange,
  matrixLabel = 'Матрица',
  matrixHref,
  onMatrixClick,
  matrixArrow = false,
  offerText = 'Задачи Петра закрыты. Поставить оценку за ноябрь?',
  assessAction = { label: 'Оценить' },
  laterAction = { label: 'Позже' },
  className,
  ...rest
}: EmployeeGroupHeaderProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.row}>
        <CheckboxLabel
          direction="left"
          size="sm"
          checked={selectAllChecked}
          indeterminate={selectAllIndeterminate}
          onChange={onSelectAllChange ? (e) => onSelectAllChange(e.target.checked) : undefined}
          readOnly={!onSelectAllChange}
        >
          {selectAllLabel}
        </CheckboxLabel>
        <Avatar type="text" size="sm" initials={initials} />
        <div className={styles.content}>
          <span className={[styles.name, 'ui-body-2-semibold'].join(' ')}>{name}</span>
          <span className={[styles.role, 'ui-caption-2-normal'].join(' ')}>{role}</span>
        </div>
        <span className={[styles.count, 'ui-caption-2-normal'].join(' ')}>{count}</span>
        <Link
          type="primary"
          size="sm"
          href={matrixHref}
          onClick={onMatrixClick}
          rightIcon={matrixArrow ? 'arrow-right-up' : undefined}
        >
          {matrixLabel}
        </Link>
      </div>
      {offer && (
        <div className={styles.offer}>
          <span className={[styles.offerText, 'ui-body-2-normal'].join(' ')}>{offerText}</span>
          <Button type="primary-gradient" size="sm" onClick={assessAction.onClick}>
            {assessAction.label}
          </Button>
          <Button type="tertiary" size="sm" onClick={laterAction.onClick}>
            {laterAction.label}
          </Button>
        </div>
      )}
    </div>
  )
}
