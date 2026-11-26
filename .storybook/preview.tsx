import { useEffect } from 'react'
import type { Decorator, Preview } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
// Токены ДС — как в приложении (src/main.tsx): примитивы -> семантика (Light/Dark) -> типографика (+ шрифты) -> база документа
import '../src/tokens/primitives.css'
import '../src/tokens/semantics.css'
import '../src/tokens/typography.css'
import '../src/base.css'
import './preview.css'
import { DocsPage } from './DocsPage'

/** Тема ДС: Light — :root, Dark — [data-theme="dark"] на <html>, как в приложении. */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? 'light'
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return <Story />
}

/**
 * Живые сценарии в каждой story (решение дизайнера 2026-11-26): компонент сообщает о смене — значение пишется
 * в его args, и он перерисовывается. Так в любой story (Default → Switcher и т. д.) клик по неактивному пункту,
 * чекбоксу, строке, странице пагинации работает как в продукте; исходный обработчик (fn() → вкладка Actions) тоже вызывается.
 * Пары «событие → свойство» — по именам пропсов базы; Date и объекты не пишутся (Datepicker и так работает без контроля).
 * Отключить для story: parameters.liveArgs = false.
 */
const PAIRS: Record<string, string> = {
  onCheckedChange: 'checked',
  onSelectedChange: 'selected',
  onExpandedChange: 'expanded',
  onThemeChange: 'theme',
  onShortcutChange: 'shortcut',
  onDigitChange: 'digitValue',
  onValueChange: 'value',
}

const isPlain = (v: unknown): v is string | number | boolean =>
  typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'

const withLiveArgs: Decorator = (Story, ctx) => {
  const [args, updateArgs] = useArgs()
  if (ctx.parameters.liveArgs === false) return <Story />
  const keys = new Set([...Object.keys(ctx.argTypes ?? {}), ...Object.keys(args)])
  const wired: Record<string, unknown> = {}
  // Обработчик подключается, когда у компонента есть парное свойство — даже если самого события нет в argTypes
  // (унаследованный onChange у Checkbox / Toggle / InputField docgen не показывает)
  const wire = (cb: string, toPatch: (...a: unknown[]) => Record<string, unknown> | null) => {
    const original = args[cb]
    wired[cb] = (...a: unknown[]) => {
      const patch = toPatch(...a)
      // Story с зафиксированным state (для сверки с Figma: Unchecked, Hover…) — при первом живом действии фиксация
      // снимается, дальше компонент ведёт себя как в продукте. Не снимать: parameters.keepState = true.
      if (patch && args.state !== undefined && cb !== 'onClose' && cb !== 'onClick' && ctx.parameters.keepState !== true) {
        patch.state = undefined
      }
      if (patch) updateArgs(patch)
      if (typeof original === 'function') return original(...a)
    }
  }
  for (const [cb, prop] of Object.entries(PAIRS)) {
    // свои события компонентов (onCheckedChange…) — только если компонент их объявляет
    if (keys.has(prop) && keys.has(cb)) wire(cb, (v) => (isPlain(v) ? { [prop]: v } : null))
  }
  if (keys.has('value') || keys.has('checked') || keys.has('current')) wire('onChange', (v) => {
    // Нативное событие поля / контрола выбора
    if (v && typeof v === 'object' && 'target' in v) {
      const t = (v as { target: HTMLInputElement }).target
      if ((t.type === 'checkbox' || t.type === 'radio') && keys.has('checked')) return { checked: t.checked }
      if (keys.has('value') && typeof t.value === 'string') return { value: t.value }
      return null
    }
    // Пагинация — номер страницы; группы (Switcher, TopNav, TabNav, Sidebar…) — value
    if (keys.has('current') && typeof v === 'number') return { current: v }
    if (keys.has('value') && isPlain(v)) return { value: v }
    return null
  })
  // Окна и меню: закрытие — open=false; триггер с open (Dropdown, ProfileDropdown) — клик переключает open
  if (keys.has('open')) {
    if (keys.has('onClose')) wire('onClose', () => ({ open: false }))
    else if (keys.has('onClick')) wire('onClick', () => ({ open: !args.open }))
  }
  return <Story args={{ ...args, ...wired }} />
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема ДС',
      toolbar: {
        title: 'Тема',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withLiveArgs, withTheme],
  parameters: {
    // Страница компонента: главный пример закреплён при прокрутке к настройкам
    docs: { page: DocsPage },
    // Фон холста — из темы (body: var(--surface-s0) в base.css), без своих фонов Storybook
    backgrounds: { disable: true },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Foundation', ['Primitive', 'Semantic', 'Typography'], 'Components', 'Sandboxes'],
      },
    },
    a11y: {
      // 'todo' — нарушения видны в панели и тестах, сборку не роняют
      test: 'todo',
    },
  },
}

export default preview
