/*
 * Разбор файлов токенов для раздела Foundation в Storybook.
 * Источник — сами src/tokens/*.css (?raw): каталог показывает ровно то, что объявлено, без копий значений.
 */
import primitivesCss from '../tokens/primitives.css?raw'
import semanticsCss from '../tokens/semantics.css?raw'
import typographyCss from '../tokens/typography.css?raw'

export interface Token {
  name: string
  value: string
  /** Заголовок-комментарий, под которым объявлена переменная (раздел Figma). */
  section: string
}

/** Тело первого блока `<selector> {` … `}` (без вложенности — в файлах токенов её нет вне @media). */
function blockBody(css: string, selectorStart: string): string {
  const at = css.indexOf(selectorStart)
  if (at < 0) return ''
  const open = css.indexOf('{', at)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') {
      depth--
      if (depth === 0) return css.slice(open + 1, i)
    }
  }
  return ''
}

/** Переменные блока по порядку объявления; однострочные комментарии `/* … *\/` задают раздел. */
function parseDeclarations(body: string, fallbackSection: string): Token[] {
  const out: Token[] = []
  let section = fallbackSection
  const re = /\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]+);/g
  for (const m of body.matchAll(re)) {
    if (m[1] != null) {
      const text = m[1].trim()
      // Разделом считаем только короткий заголовок; пояснения «не переносится» и т. п. пропускаем
      if (!text.includes('\n') && !/не переносится/i.test(text)) section = text
      continue
    }
    out.push({ name: m[2], value: m[3].replace(/\s+/g, ' ').trim(), section })
  }
  return out
}

/** Раздел без хвоста-пояснения в скобках: «📐 Space · режим Default (…)» -> «📐 Space · режим Default». */
export const shortSection = (s: string) => s.replace(/\s*\(.*\)\s*$/, '')

/* ---------- Primitive ---------- */

const primitivesRoot = parseDeclarations(blockBody(primitivesCss, ':root {'), 'Primitives')
const effects = parseDeclarations(blockBody(primitivesCss, '[data-theme] {'), 'Effect styles').map((t) => ({
  ...t,
  section: t.name.startsWith('--blur-') ? 'Blur' : 'Effect styles',
}))

export const primitiveTokens: Token[] = [...primitivesRoot, ...effects]

/* ---------- Semantic ---------- */

const semanticLight = parseDeclarations(blockBody(semanticsCss, '[data-theme="light"] {'), 'Theme')
const semanticDark = parseDeclarations(blockBody(semanticsCss, '[data-theme="dark"] {'), 'Theme')
const darkByName = new Map(semanticDark.map((t) => [t.name, t.value]))

export interface SemanticToken {
  name: string
  light: string
  dark: string
  /** Группа = первый уровень имени Variable в Figma (Surface, Text, Outline, …). */
  group: string
}

export const semanticTokens: SemanticToken[] = semanticLight.map((t) => ({
  name: t.name,
  light: t.value,
  dark: darkByName.get(t.name) ?? t.value,
  group: t.name.replace(/^--/, '').split('-')[0],
}))

/* ---------- Typography ---------- */

export const typefaceTokens: Token[] = parseDeclarations(blockBody(typographyCss, ':root {'), 'Typeface')

export interface TextStyle {
  className: string
  /** Свойства класса как в файле: font-family / font-size / … -> var(--typeface-*). */
  props: Record<string, string>
}

export const textStyles: TextStyle[] = [...typographyCss.matchAll(/^\.([\w-]+)\s*\{([^}]*)\}/gm)].map((m) => ({
  className: m[1],
  props: Object.fromEntries(
    [...m[2].matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map((p) => [p[1], p[2].trim()]),
  ),
}))

/* ---------- Общее ---------- */

/** Группировка с сохранением порядка. */
export function groupBy<T>(items: T[], key: (t: T) => string): [string, T[]][] {
  const map = new Map<string, T[]>()
  for (const it of items) {
    const k = key(it)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(it)
  }
  return [...map.entries()]
}

/** Подгруппа примитива = имя без последнего сегмента: --color-gray-50 -> color-gray, --space-xl -> space. */
export function primitiveFamily(name: string): string {
  const parts = name.replace(/^--/, '').split('-')
  if (parts[0] === 'project' && parts[1] === 'project') return parts.slice(0, 3).join('-')
  if (parts[0] === 'color' || parts[0] === 'project') return parts.slice(0, 2).join('-')
  if (parts[0] === 'font') return parts.slice(0, Math.min(3, parts.length - 1)).join('-')
  return parts[0]
}

/** Вид токена по значению — чтобы выбрать превью. */
export type TokenKind = 'color' | 'space' | 'radius' | 'shadow' | 'blur' | 'font-family' | 'font-size' | 'font-weight' | 'line-height' | 'letter-spacing' | 'other'

export function kindOf(name: string): TokenKind {
  const n = name.replace(/^--/, '').replace(/^typeface-/, 'font-')
  if (n.startsWith('color-') || n.startsWith('project-')) return 'color'
  if (n.startsWith('space-')) return 'space'
  if (n.startsWith('radius-')) return 'radius'
  if (n.startsWith('blur-') || n.endsWith('-backdrop')) return 'blur'
  if (n.startsWith('font-family')) return 'font-family'
  if (n.startsWith('font-size')) return 'font-size'
  if (n.startsWith('font-weight')) return 'font-weight'
  if (n.startsWith('font-line-height')) return 'line-height'
  if (n.startsWith('font-letter-spacing') || n.startsWith('font-tracking')) return 'letter-spacing'
  if (n.startsWith('elevation-shadow')) return 'color'
  return 'shadow'
}
