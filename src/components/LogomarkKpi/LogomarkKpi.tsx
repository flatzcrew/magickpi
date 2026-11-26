import type { HTMLAttributes } from 'react'
import logomarkUrl from '../../assets/logomark-kpi/logomark.svg'
import styles from './LogomarkKpi.module.css'

/**
 * LogomarkKpi — логомарк продукта KPI (шапка Sidebar, экран входа).
 * Figma: кит, набор `Logomark-KPI` (componentSetKey 012e8b44f8c07a479db2cf18c162b0b3916fa5e9); копия в kpi-bro · web `46:1418`.
 *
 * Знак — `src/assets/logomark-kpi/logomark.svg`, снят из сайдбара экранов (Sidebar `91:969`) 2026-11-26.
 * Свой знак можно передать `children` (svg / img) — он заменит файл.
 */
export type LogomarkKpiType = 'default'
/** Размеры: 36 (Sidebar expanded) · 32 (свёрнутый Sidebar на экранах, 83:730) · 28 (collapsed-compact в ките). */
export type LogomarkKpiSize = 28 | 32 | 36

export interface LogomarkKpiProps extends HTMLAttributes<HTMLSpanElement> {
  /** Type: default (на экранах только default) */
  type?: LogomarkKpiType
  size?: LogomarkKpiSize
  /** Доступное имя. */
  label?: string
}

export function LogomarkKpi({ type = 'default', size = 36, label = 'KPI', children, className, ...rest }: LogomarkKpiProps) {
  return (
    <span
      {...rest}
      role="img"
      aria-label={label}
      data-type={type}
      className={[styles.root, styles[`size-${size}`], className].filter(Boolean).join(' ')}
    >
      {children ?? <img src={logomarkUrl} alt="" />}
    </span>
  )
}
