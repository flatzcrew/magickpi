import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Stack, Stateful } from '../../catalog/Catalog'
import { TabNav } from './TabNav'
import type { TabNavOption } from './TabNav'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const TABS: TabNavOption[] = [
  { value: 'plan', label: 'План' },
  { value: 'fact', label: 'Факт' },
  { value: 'tasks', label: 'Задачи', secondaryText: '7' },
  { value: 'approval', label: 'Согласование' },
  { value: 'history', label: 'История' },
]

/**
 * Панель вкладок карточки сотрудника. Figma: кит, `Tab-nav` `10048:1249` — Type default × 5 Size × State default.
 * Вкладки — `TabNavItem`: выбранная — active-primary, остальные — inactive. Type и State в ките с единственным значением.
 *
 * Наведение и фокус вкладок — нативные; выбор управляется `value` / `onChange`.
 */
const meta = {
  title: 'Components/TabNav',
  component: TabNav,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 'md',
    state: 'default',
    items: TABS,
    value: 'plan',
    onChange: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['default'] },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: ['default'] },
    items: { control: 'object' },
    value: { control: 'text' },
    onChange: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TabNav>

export default meta
type Story = StoryObj<typeof meta>

/** Вкладки карточки сотрудника. */
export const Default: Story = {}
/** Компактные вкладки. */
export const Small: Story = { args: { size: 'xs', value: 'tasks' } }

/** Живые вкладки: клик переключает выбранную. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="plan">
      {(v, set) => (
        <TabNav
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

/** Все Size; каждая панель живая. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size">
        <Stack>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={sz}>
              <Stateful initial="plan">{(v, set) => <TabNav size={sz} items={TABS} value={v} onChange={set} />}</Stateful>
            </Labeled>
          ))}
        </Stack>
      </Block>
    </Stack>
  ),
}
