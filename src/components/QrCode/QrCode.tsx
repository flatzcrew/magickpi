import type { ReactElement, SVGAttributes } from 'react'
import { DEMO_QR_MATRIX } from './demoMatrix'
import styles from './QrCode.module.css'

/**
 * QrCode — QR-код. Figma: кит, `QR-code` `16158:27561`.
 * Статичная разметка без графических библиотек: рисует готовую матрицу модулей, сам QR не кодирует.
 */
export type QrCodeType = 'round' | 'square'

export interface QrCodeProps extends Omit<SVGAttributes<SVGSVGElement>, 'type' | 'children'> {
  /** Type: round · square */
  type?: QrCodeType
  /** Матрица модулей: строки из '0' / '1' одинаковой длины. По умолчанию — демо-матрица 29×29 из кита. */
  matrix?: readonly string[]
  /** Доступное имя (что закодировано). */
  label?: string
}

/** Холст 128 и поле 8 — как у вектора в ките (единицы viewBox, не CSS). */
const CANVAS = 128
const QUIET = 8
const FINDER = 7

function isFinder(r: number, c: number, n: number) {
  const inBand = (v: number, start: number) => v >= start && v < start + FINDER
  return (inBand(r, 0) && inBand(c, 0)) || (inBand(r, 0) && inBand(c, n - FINDER)) || (inBand(r, n - FINDER) && inBand(c, 0))
}

export function QrCode({ type = 'square', matrix = DEMO_QR_MATRIX, label = 'QR-код', className, ...rest }: QrCodeProps) {
  const n = matrix.length
  const s = (CANVAS - QUIET * 2) / n
  const at = (i: number) => QUIET + i * s
  const round = type === 'round'
  const cells: ReactElement[] = []

  matrix.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== '1') continue
      if (round && isFinder(r, c, n)) continue
      cells.push(
        round ? (
          <circle key={`${r}-${c}`} cx={at(c) + s / 2} cy={at(r) + s / 2} r={s / 2} />
        ) : (
          <rect key={`${r}-${c}`} x={at(c)} y={at(r)} width={s} height={s} />
        ),
      )
    }
  })

  const finders = round
    ? [
        [0, 0],
        [0, n - FINDER],
        [n - FINDER, 0],
      ].map(([r, c]) => (
        <g key={`f-${r}-${c}`}>
          <rect
            className={styles.finderRing}
            x={at(c) + s / 2}
            y={at(r) + s / 2}
            width={s * (FINDER - 1)}
            height={s * (FINDER - 1)}
            rx={s * 2}
            strokeWidth={s}
          />
          <rect x={at(c + 2)} y={at(r + 2)} width={s * 3} height={s * 3} rx={s} />
        </g>
      ))
    : null

  return (
    <svg
      {...rest}
      viewBox={`0 0 ${CANVAS} ${CANVAS}`}
      role="img"
      aria-label={label}
      data-type={type}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      {cells}
      {finders}
    </svg>
  )
}
