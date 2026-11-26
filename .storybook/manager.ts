/*
 * Интерфейс Storybook (manager) под ДС: тема — только переменные из src/tokens (подключены в manager-head.html),
 * шапка сайдбара — как Header у Sidebar кита: Logomark-KPI 36 + название + версия. Название — «Magic UI», подпись — «by Pitonize DS v.1.0.1» (решение дизайнера 2026-11-26).
 * Оформление дерева под Sidebar-item — в manager-head.html.
 */
import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

/**
 * Значение токена, вычисленное браузером (var() внутри уже подставлены). Нужно там, где Storybook
 * пересчитывает цвет сам (appBorderColor → полупрозрачная стрелка): переменную он разобрать не может.
 * Токены подключены <link> в manager-head.html и загружаются до скриптов интерфейса.
 */
const tok = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || `var(${name})`

const theme = create({
  base: 'light',

  // Бренд: HTML в brandTitle (Storybook вставляет его как есть) — логотип + две строки, как Header у Sidebar
  brandTitle: [
    '<span class="ds-brand">',
    '<img class="ds-brand-logo" src="./ds/logo/logomark.svg" alt="" />',
    '<span class="ds-brand-text">',
    '<span class="ds-brand-name ui-para-medium">Magic UI</span>',
    '<span class="ds-brand-version ui-caption-2-normal">by Pitonize DS v.1.0.1</span>',
    '</span>',
    '</span>',
  ].join(''),
  brandUrl: './',
  brandTarget: '_self',

  // Цвета — семантика Theme (Light)
  colorPrimary: tok('--surface-primary-med-em'),
  colorSecondary: tok('--surface-primary-med-em'),
  appBg: tok('--surface-s1'),
  appContentBg: tok('--surface-s0'),
  appPreviewBg: tok('--surface-s0'),
  appBorderColor: tok('--outline-low-em'),
  barBg: tok('--surface-s0'),
  barTextColor: tok('--text-med-em'),
  barSelectedColor: tok('--text-primary-high-em'),
  barHoverColor: tok('--text-high-em'),
  textColor: tok('--text-high-em'),
  textMutedColor: tok('--text-low-em'),
  textInverseColor: tok('--text-primary-on-primary'),
  inputBg: tok('--surface-s0'),
  inputBorder: tok('--outline-med-em'),
  inputTextColor: tok('--text-high-em'),
  buttonBg: tok('--surface-s0'),
  buttonBorder: tok('--outline-med-em'),
  booleanBg: tok('--surface-s2'),
  booleanSelectedBg: tok('--surface-s0'),

  // Шрифт — Geist (семейство body), как в продукте
  fontBase: 'var(--typeface-family-body), system-ui, sans-serif',
  fontCode: 'ui-monospace, monospace',
})

addons.setConfig({
  theme,
  // Колонка 340 (у Storybook по умолчанию 300): чтобы «Magic UI · by Pitonize DS v.1.0.1» в шапке помещалась целиком.
  // Ширину, которую пользователь уже перетянул руками, Storybook помнит сам — эта задаёт только начальную.
  layout: {
    navSize: 340,
    recentVisibleSizes: { navSize: 340, bottomPanelHeight: 300, rightPanelWidth: 400 },
  },
  sidebar: { showRoots: true },
})
