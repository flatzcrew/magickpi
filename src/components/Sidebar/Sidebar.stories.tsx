import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Frame, Labeled, Row, Stack, Stateful, Width } from '../../catalog/Catalog'
import { NavDot } from '../NavDot'
import type { SidebarNavOption, SidebarSection } from './Sidebar'
import { Sidebar } from './Sidebar'

const STATES = ['expanded', 'collapsed-compact'] as const

const SECTIONS: SidebarSection[] = [
  {
    heading: 'Работа',
    items: [
      { value: 'my-kpi', label: 'Мои KPI', icon: 'pie-chart' },
      { value: 'team', label: 'Команда', icon: 'users', tag: '12' },
      { value: 'matrix', label: 'Матрица', icon: 'list' },
      { value: 'tasks', label: 'Задачи', icon: 'check', badge: <NavDot label="Есть новые задачи" /> },
    ],
  },
  {
    heading: 'Помощник',
    items: [{ value: 'kipi', label: 'Кипи', icon: 'chat' }],
  },
]

const BOTTOM: SidebarNavOption[] = [
  { value: 'settings', label: 'Настройки', icon: 'settings' },
  { value: 'notifications', label: 'Уведомления', icon: 'notification', tag: '3' },
  { value: 'logout', label: 'Выйти', icon: 'logout' },
]

/**
 * Боковая навигация приложения. Figma: кит, `Sidebar` `12171:3030` — State expanded (304) · collapsed-compact (64), +5
 * (CTAs, профиль, секции, header, переключатель темы).
 * expanded — `SidebarItem` md с заголовками секций; collapsed-compact — `SidebarItemCompact` md, только иконки.
 * Высота — 100% родителя, поэтому в stories панель живёт в `Frame tall`. Наведение пунктов нативное.
 * Логомарк в шапке — `LogomarkKpi` (знак из макетов).
 */
const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    state: 'expanded',
    title: 'KPI Bro',
    subtitle: 'ver. 1.0.1',
    cta: { label: 'Новая задача', icon: 'plus', onClick: fn() },
    sections: SECTIONS,
    value: 'my-kpi',
    bottomItems: BOTTOM,
    profile: { name: 'Иван Петров', subtitle: 'Отдел продаж', initials: 'ИП', icon: 'edit-note' },
    showProfile: true,
    themeLabel: 'Тема',
    onChange: fn(),
    onProfileClick: fn(),
    onThemeChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    header: { control: false },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    headerAction: { control: 'object' },
    cta: { control: 'object' },
    sections: { control: 'object' },
    value: { control: 'text' },
    onChange: { control: false },
    activeType: {
      control: 'select',
      options: [undefined, 'active-neutral', 'inactive', 'active', 'active-primary', 'active-primary-light', 'active-secondary', 'active-tertiary'],
    },
    bottomItems: { control: 'object' },
    profile: { control: 'object' },
    showProfile: { control: 'boolean' },
    onProfileClick: { control: false },
    themes: { control: 'object' },
    theme: { control: 'text' },
    onThemeChange: { control: false },
    themeLabel: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Frame tall>
          <Story />
        </Frame>
      ),
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/** Развёрнутая панель. */
export const Expanded: Story = { args: { state: 'expanded' } }
/** Свёрнутая: только иконки, профиль — аватар. */
export const CollapsedCompact: Story = { args: { state: 'collapsed-compact' } }

/** Живая навигация: выбор пункта, смена темы и сворачивание кнопкой в шапке. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial={{ value: 'my-kpi', theme: 'system', compact: false }}>
      {(st, set) => (
        <Sidebar
          {...args}
          state={st.compact ? 'collapsed-compact' : 'expanded'}
          value={st.value}
          onChange={(value) => set({ ...st, value })}
          theme={st.theme}
          onThemeChange={(theme) => set({ ...st, theme })}
          headerAction={{ icon: 'chevron-left', 'aria-label': 'Свернуть меню', onClick: () => set({ ...st, compact: true }) }}
          cta={
            st.compact
              ? { icon: 'chevron-right', 'aria-label': 'Развернуть меню', onClick: () => set({ ...st, compact: false }) }
              : { label: 'Новая задача', icon: 'plus' }
          }
        />
      )}
    </Stateful>
  ),
}

/** State expanded · collapsed-compact рядом. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="State">
        <Row>
          {STATES.map((st) => (
            <Labeled key={st} label={st}>
              <Frame tall>
                <Sidebar
                  state={st}
                  title="KPI Bro"
                  cta={{ label: 'Новая задача', icon: 'plus' }}
                  sections={SECTIONS}
                  value="my-kpi"
                  bottomItems={BOTTOM}
                  profile={{ name: 'Иван Петров', subtitle: 'Отдел продаж', initials: 'ИП', icon: 'edit-note' }}
                  showProfile
                />
              </Frame>
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}

/**
 * Как в макете: тот же состав, что у Sidebar на экранах kpi-bro · web (инстанс `91:969`, ширина 240):
 * без CTA и заголовков секций, текущий пункт — `active-neutral` (тёмный), внизу профиль, тема, Настройки, Помощь,
 * Уведомления с Tag и Выйти. Для сверки отступов с макетом один к одному.
 */
export const AsInMockup: Story = {
  name: 'Как в макете',
  parameters: { bare: true, layout: 'centered' },
  args: {
    title: 'Magic KPI',
    subtitle: 'ver. 1.0',
    headerAction: { icon: 'panel', 'aria-label': 'Свернуть меню' },
    cta: false,
    sections: [
      {
        items: [
          { value: 'kipi', label: 'Ассистент Кипи', icon: 'ai' },
          { value: 'matrix', label: 'Моя матрица', icon: 'pie-chart' },
          { value: 'team', label: 'Сотрудники', icon: 'users' },
          { value: 'tasks', label: 'Задачи', icon: 'list', tag: '8' },
        ],
      },
    ],
    value: 'tasks',
    activeType: 'active-neutral',
    bottomItems: [
      { value: 'settings', label: 'Настройки', icon: 'settings' },
      { value: 'help', label: 'Помощь', icon: 'help' },
      { value: 'notifications', label: 'Уведомления', icon: 'notification', tag: '3' },
      { value: 'logout', label: 'Выйти', icon: 'logout' },
    ],
    profile: { name: 'Андрей Смирнов', subtitle: 'Procter&Gamble', initials: 'АС', icon: 'edit-note' },
  },
  render: (args) => (
    <Frame screen flush>
      <Width size="nav">
        <Sidebar {...args} />
      </Width>
    </Frame>
  ),
}

/**
 * Свёрнутая — как в макете: инстанс `83:730` экранов (ширина 64). Только иконки без подписей, текущий пункт тёмный,
 * внизу «Уведомления» с NavDot и аватар. Клик по логотипу — развернуть, кнопка в шапке развёрнутой — свернуть:
 * сценарий целиком. Пункты выбираются кликом.
 */
export const AsInMockupCollapsed: Story = {
  name: 'Свёрнутая — как в макете',
  parameters: { bare: true, layout: 'centered', liveArgs: false },
  args: {
    ...AsInMockup.args,
    state: 'collapsed-compact',
    value: 'team',
    bottomItems: [{ value: 'notifications', label: 'Уведомления', icon: 'notification', badge: <NavDot label="Есть новые уведомления" /> }],
  },
  render: (args) => (
    <Stateful<{ state: 'expanded' | 'collapsed-compact'; value: string }> initial={{ state: 'collapsed-compact', value: 'team' }}>
      {(st, set) => {
        const expanded = st.state === 'expanded'
        return (
          <Frame screen flush>
            <Width size={expanded ? 'nav' : 'rail'}>
              <Sidebar
                {...args}
                state={st.state}
                value={st.value}
                onChange={(v) => set({ ...st, value: v })}
                headerAction={{
                  icon: 'panel',
                  'aria-label': expanded ? 'Свернуть меню' : 'Развернуть меню',
                  onClick: () => set({ ...st, state: expanded ? 'collapsed-compact' : 'expanded' }),
                }}
                bottomItems={expanded ? AsInMockup.args?.bottomItems : args.bottomItems}
              />
            </Width>
          </Frame>
        )
      }}
    </Stateful>
  ),
}
