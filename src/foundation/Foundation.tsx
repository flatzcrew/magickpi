/*
 * Превью токенов для раздела Foundation. Значения и состав читаются из src/tokens/*.css (tokens.ts),
 * превью рисуется живой переменной var(--name) — поэтому семантика следует переключателю темы.
 */
import styles from './Foundation.module.css'
import {
  groupBy,
  kindOf,
  primitiveFamily,
  primitiveTokens,
  semanticTokens,
  shortSection,
  textStyles,
  typefaceTokens,
  type Token,
} from './tokens'

const v = (name: string) => `var(${name})`

function Swatch({ token }: { token: Token }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.chip}>
        <div className={styles.chipFill} style={{ background: v(token.name) }} />
      </div>
      <span className="ui-caption-1-medium">{token.name}</span>
      <span className={`ui-caption-2-normal ${styles.code}`}>{token.value}</span>
    </div>
  )
}

function Preview({ token }: { token: Token }) {
  const kind = kindOf(token.name)
  switch (kind) {
    case 'space':
      return <div className={styles.bar} style={{ width: v(token.name) }} />
    case 'radius':
      return <div className={styles.radiusBox} style={{ borderRadius: v(token.name) }} />
    case 'shadow':
      return (
        <div className={styles.shadowStage}>
          <div className={styles.shadowBox} style={{ boxShadow: v(token.name) }} />
        </div>
      )
    case 'blur':
      return (
        <div className={styles.blurStage}>
          <div className={styles.blurGlass} style={{ backdropFilter: v(token.name) }} />
        </div>
      )
    case 'font-family':
      return <span className={`ui-title-1-medium ${styles.sample}`} style={{ fontFamily: v(token.name) }}>Выполнение плана 98%</span>
    case 'font-size':
      return <span className={styles.sample} style={{ fontSize: v(token.name), lineHeight: 1.1 }}>KPI</span>
    case 'font-weight':
      return <span className={`ui-title-1-normal ${styles.sample}`} style={{ fontWeight: v(token.name) }}>Показатель</span>
    case 'line-height':
      return <div className={styles.bar} style={{ width: v(token.name) }} />
    case 'letter-spacing':
      return <span className={`ui-body-1-medium ${styles.sample}`} style={{ letterSpacing: v(token.name) }}>ПЛАН И ФАКТ</span>
    default:
      return <div className={styles.mini} style={{ background: v(token.name) }} />
  }
}

function TokenRows({ tokens }: { tokens: Token[] }) {
  return (
    <div className={styles.rows}>
      <div className={`${styles.row} ${styles.head} ui-caption-1-medium`}>
        <span>Переменная</span>
        <span>Значение</span>
        <span>Превью</span>
      </div>
      {tokens.map((t) => (
        <div key={t.name} className={styles.row}>
          <span className="ui-para-medium">{t.name}</span>
          <span className={`ui-caption-1-normal ${styles.code}`}>{t.value}</span>
          <Preview token={t} />
        </div>
      ))}
    </div>
  )
}

/** Primitive одного раздела Figma (🍄 Primitives, 🎨 Color Accent, 🆎 Font, 📐 Space, 🟢 Radius, Effect styles, Blur). */
export function PrimitiveSection({ match }: { match: (section: string) => boolean }) {
  const tokens = primitiveTokens.filter((t) => match(t.section))
  const sections = groupBy(tokens, (t) => t.section)
  return (
    <div className={styles.page}>
      {sections.map(([section, items]) => (
        <section key={section} className={styles.section}>
          <h2 className="ui-heading-1-semibold">{shortSection(section)}</h2>
          <p className={`ui-para-normal ${styles.muted}`}>{items.length} переменных · src/tokens/primitives.css</p>
          {groupBy(items, (t) => primitiveFamily(t.name)).map(([family, list]) => (
            <div key={family} className={styles.family}>
              <h3 className="ui-body-1-semibold">--{family}-*</h3>
              {kindOf(list[0].name) === 'color' ? (
                <div className={styles.swatches}>
                  {list.map((t) => (
                    <Swatch key={t.name} token={t} />
                  ))}
                </div>
              ) : (
                <TokenRows tokens={list} />
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

/** Semantic: живое превью в текущей теме + ссылка на примитив в Light и в Dark. */
export function SemanticSection({ group }: { group?: string }) {
  const tokens = group ? semanticTokens.filter((t) => t.group === group) : semanticTokens
  return (
    <div className={styles.page}>
      {groupBy(tokens, (t) => t.group).map(([g, list]) => (
        <section key={g} className={styles.section}>
          <h2 className="ui-heading-1-semibold">{g[0].toUpperCase() + g.slice(1)}</h2>
          <p className={`ui-para-normal ${styles.muted}`}>
            {list.length} переменных · src/tokens/semantics.css · превью — в текущей теме (переключатель «Тема» на панели)
          </p>
          <div className={styles.rows}>
            <div className={`${styles.row} ${styles.rowSemantic} ${styles.head} ui-caption-1-medium`}>
              <span />
              <span>Переменная</span>
              <span>☀️ Light → примитив</span>
              <span>🌒 Dark → примитив</span>
            </div>
            {list.map((t) => (
              <div key={t.name} className={`${styles.row} ${styles.rowSemantic}`}>
                <div className={styles.mini} style={{ background: v(t.name) }} />
                <span className="ui-para-medium">{t.name}</span>
                <span className={`ui-caption-1-normal ${styles.code}`}>{t.light}</span>
                <span className={`ui-caption-1-normal ${styles.code}`}>{t.dark}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export const semanticGroups = [...new Set(semanticTokens.map((t) => t.group))]

/** Typography: каждый TextStyle строкой-примером + его привязки к Typeface/*. */
export function TextStyles({ prefix }: { prefix?: string }) {
  const list = prefix ? textStyles.filter((s) => s.className.startsWith(prefix)) : textStyles
  return (
    <div className={styles.page}>
      <p className={`ui-para-normal ${styles.muted}`}>
        {list.length} стилей · src/tokens/typography.css · класс = имя TextStyle в kebab-case
      </p>
      <div className={styles.rows}>
        {list.map((s) => (
          <div key={s.className} className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className="ui-para-medium">.{s.className}</span>
              <span className={`ui-caption-2-normal ${styles.code}`}>
                {[s.props['font-size'], s.props['font-weight'], s.props['line-height']]
                  .filter(Boolean)
                  .map((x) => x.replace(/^var\(--typeface-|\)$/g, ''))
                  .join(' · ')}
              </span>
            </div>
            <span className={`${s.className} ${styles.sample}`}>Иван Петров выполнил план на 98%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Typeface/* — слой типографики между Font (примитив) и TextStyle; мобильная версия подменяется @media 767px. */
export function TypefaceVars() {
  return (
    <div className={styles.page}>
      <p className={`ui-para-normal ${styles.muted}`}>
        {typefaceTokens.length} переменных Typeface (web) · ссылаются на 🆎 Font · на ширине до 767px подменяются мобильными
      </p>
      <TokenRows tokens={typefaceTokens} />
    </div>
  )
}
