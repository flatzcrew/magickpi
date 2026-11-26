import type { CSSProperties, HTMLAttributes } from 'react'
import styles from './Icon.module.css'

/**
 * Icon — 198 иконок кита «Icons / *» (страница 🪩 Icons `10003:179`).
 * Имя = имя иконки в Figma в kebab-case: `Icons / Pie-chart` → `name="pie-chart"`; у пар контур / заливка залитая —
 * с суффиксом `-filled` (`user` / `user-filled`). SVG — `src/assets/icons/<name>.svg` (выгружены из кита 2026-11-26),
 * встраиваются в разметку, поэтому монохромные иконки берут цвет текста (`currentColor`).
 * Многоцветные по замыслу кита: add, icons-placeholder, verification-tick, google, figma.
 * Имени нет в ките — рисуется рамка-заглушка нужного размера и в режиме разработки пишется предупреждение.
 */

const SVG_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }),
  ).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)

/** Все имена иконок кита (для каталога и контролов). */
export const ICON_NAMES = Object.keys(SVG_BY_NAME).sort()

/** Размеры иконок, встречающиеся в ките (px) → токен `--space-*`. */
export type IconSize = 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32

const SIZE_TOKEN: Record<IconSize, string> = {
  12: 'var(--space-xl)',
  14: 'var(--space-2xl)',
  16: 'var(--space-3xl)',
  18: 'var(--space-4xl)',
  20: 'var(--space-5xl)',
  24: 'var(--space-7xl)',
  28: 'var(--space-9xl)',
  32: 'var(--space-10xl)',
}

const warned = new Set<string>()

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Имя иконки кита в kebab-case (`placeholder`, `user`, `pie-chart`, `list`…), список — `ICON_NAMES`. */
  name: string
  /**
   * Размер. Не задан — берётся из CSS-переменной `--icon-size` родителя
   * (так компоненты задают размер иконки по своему Size), по умолчанию 24.
   */
  size?: IconSize
  /** Доступное имя. Без него иконка декоративная (aria-hidden). */
  label?: string
}

export function Icon({ name, size, label, className, style, ...rest }: IconProps) {
  const svg = SVG_BY_NAME[name]
  if (!svg && import.meta.env.DEV && !warned.has(name)) {
    warned.add(name)
    console.warn(`[Icon] иконки «${name}» нет в ките — показана заглушка`)
  }
  const sizeStyle: CSSProperties | undefined = size
    ? ({ '--icon-size': SIZE_TOKEN[size] } as CSSProperties)
    : undefined
  return (
    <span
      {...rest}
      data-icon={name}
      data-missing={svg ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ ...sizeStyle, ...style }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
