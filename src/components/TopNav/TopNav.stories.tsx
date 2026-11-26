import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { TopNav } from './TopNav'
import type { TopNavOption } from './TopNav'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const ITEM_TYPES = [
  'active-neutral',
  'inactive',
  'inactive-outlined',
  'active',
  'active-naked',
  'active-primary',
  'active-primary-light',
  'active-secondary',
] as const
const INACTIVE_TYPES = ['inactive', 'inactive-outlined'] as const

const SECTIONS: TopNavOption[] = [
  { value: 'my-kpi', label: 'Мои KPI', leftIcon: 'pie-chart' },
  { value: 'team', label: 'Команда', leftIcon: 'users' },
  { value: 'matrix', label: 'Матрица', leftIcon: 'all' },
  { value: 'tasks', label: 'Задачи', leftIcon: 'list', secondaryText: '7' },
  { value: 'approval', label: 'Согласование', leftIcon: 'check' },
]

/**
 * Верхняя навигационная панель. Figma: кит, `Top-nav` `10004:2719` — Size xs…xl.
 * Пункты — `TopNavItem`: текущий получает `activeType` (в ките active-primary-light), остальные — `inactiveType` (inactive).
 *
 * Наведение и фокус пунктов — нативные; текущий пункт управляется `value` / `onChange`.
 */
const meta = {
  title: 'Components/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    items: SECTIONS,
    value: 'my-kpi',
    activeType: 'active-primary-light',
    inactiveType: 'inactive',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    items: { control: 'object' },
    value: { control: 'text' },
    activeType: { control: 'select', options: ITEM_TYPES },
    inactiveType: { control: 'inline-radio', options: INACTIVE_TYPES },
    onChange: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TopNav>

export default meta
type Story = StoryObj<typeof meta>

/** Разделы сервиса, как в ките. */
export const Default: Story = {}
/** Обычные пункты с обводкой, текущий — акцентный. */
export const Outlined: Story = { args: { inactiveType: 'inactive-outlined', activeType: 'active-primary', value: 'team' } }
/** Только подписи, без иконок. */
export const TextOnly: Story = {
  args: {
    items: SECTIONS.map(({ value, label }) => ({ value, label })),
    value: 'matrix',
  },
}

/** Живая навигация: клик переключает раздел. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="my-kpi">
      {(v, set) => (
        <TopNav
          {...args}
          value={v}
          onChange={(x) => {
            set(x)
            args.onChange?.(x)
          }}
        />
      )}
    </Stateful>
  ),
}

/** Size × inactiveType и activeType; все ячейки живые. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size × inactiveType">
        <Matrix
          rows={SIZES}
          cols={INACTIVE_TYPES}
          render={(sz, it) => (
            <Stateful initial="my-kpi">{(v, set) => <TopNav size={sz} inactiveType={it} items={SECTIONS} value={v} onChange={set} />}</Stateful>
          )}
        />
      </Block>
      <Block title="activeType">
        <Matrix
          rows={ITEM_TYPES}
          cols={['sm'] as const}
          render={(at) => (
            <Stateful initial="team">{(v, set) => <TopNav activeType={at} size="sm" items={SECTIONS} value={v} onChange={set} />}</Stateful>
          )}
        />
      </Block>
    </Stack>
  ),
}
