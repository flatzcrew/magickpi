import type { HTMLAttributes, ReactNode } from 'react'
import { InputField } from '../InputField'
import type { InputFieldProps } from '../InputField'
import styles from './Dropmenu.module.css'

/**
 * Dropmenu — выпадающее меню. Figma: кит, `Dropmenu` `12127:30113` (одиночный; +1 слот Body).
 * Body в ките: поле поиска (Input-field без label и hint) + строки List md, разделённые Divider-horizontal (center, rounded).
 * Строки передаются детьми: <List size="md" … /> и <DividerHorizontal ends="rounded" />.
 */
export interface DropmenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Поле поиска в начале Body (передано — показано). Label и hint у него скрыты, как в ките. */
  search?: Omit<InputFieldProps, 'inputLabel' | 'inputHint'>
  /** Body — строки меню. */
  children?: ReactNode
}

export function Dropmenu({ search, children, className, ...rest }: DropmenuProps) {
  return (
    <div role="menu" {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.body}>
        {search && (
          <div className={styles.search}>
            <InputField size="sm" leftIcon="search" placeholder="Поиск" {...search} />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
