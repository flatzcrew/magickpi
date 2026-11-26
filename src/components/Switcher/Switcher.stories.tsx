import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { Switcher } from './Switcher'
import type { SwitcherOption } from './Switcher'

const TYPES = ['default', 'secondary'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const ITEM_TYPES = ['active-neutral', 'inactive', 'active', 'active-primary', 'active-primary-light', 'active-secondary'] as const

const PERIODS: SwitcherOption[] = [
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
]
const VIEWS: SwitcherOption[] = [
  { value: 'cards', label: 'Карточки', leftIcon: 'all' },
  { value: 'table', label: 'Таблица', leftIcon: 'list' },
  { value: 'matrix', label: 'Матрица', leftIcon: 'pie-chart', secondaryText: '8' },
]

/**
 * Сегментный переключатель (период, режим отображения). Figma: кит, `Switcher` `10004:1441` — Type default · secondary × 5 Size, State default.
 * Сегменты — `SwitcherItem`: выбранный получает active (default) или active-primary-light (secondary), остальные — inactive.
 *
 * Наведение и фокус сегментов — нативные; выбор управляется `value` / `onChange`.
 */
const meta = {
  title: 'Components/Switcher',
  component: Switcher,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 'sm',
    items: PERIODS,
    value: 'quarter',
    onChange: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    items: { control: 'object' },
    value: { control: 'text' },
    activeType: { control: 'select', options: [undefined, ...ITEM_TYPES] },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Switcher>

export default meta
type Story = StoryObj<typeof meta>

/** Подложка secondary-alpha, выбранный сегмент active. */
export const Default: Story = { args: { type: 'default' } }
/** Белая подложка, выбранный сегмент active-primary-light. */
export const Secondary: Story = { args: { type: 'secondary' } }
/** Переопределённый тип выбранного сегмента. */
export const ActivePrimary: Story = { args: { activeType: 'active-primary' } }
/** Режимы отображения с иконками. */
export const WithIcons: Story = { args: { items: VIEWS, value: 'table', size: 'md' } }

/** Живой переключатель периода: клик меняет выбранный сегмент. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="month">
      {(v, set) => (
        <Switcher
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

/** Матрица Type × Size — каждая ячейка живая, клик переключает сегмент. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix
          rows={TYPES}
          cols={SIZES}
          render={(t, sz) => (
            <Stateful initial="month">{(v, set) => <Switcher type={t} size={sz} items={PERIODS} value={v} onChange={set} />}</Stateful>
          )}
        />
      </Block>
      <Block title="activeType × Type">
        <Matrix
          rows={ITEM_TYPES}
          cols={TYPES}
          render={(at, t) => (
            <Stateful initial="table">
              {(v, set) => <Switcher type={t} size="sm" activeType={at} items={VIEWS} value={v} onChange={set} />}
            </Stateful>
          )}
        />
      </Block>
    </Stack>
  ),
}
