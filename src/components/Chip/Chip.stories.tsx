import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Chip } from './Chip'

const TYPES = ['unselected', 'selected', 'selected-solid'] as const
const SIZES = ['xs', 'sm', 'md'] as const
const STATES = ['default', 'hover', 'pressed', 'drag', 'disabled'] as const
const FILTERS = ['Отдел продаж', 'Маркетинг', 'Поддержка', 'Без плана'] as const

/**
 * Чип-фильтр с выбором. Figma: кит, `Chip` `10005:4414` — 3 Type × 3 Size × 5 State, +10 (иконки, тексты, картинка).
 *
 * Наведение, нажатие и фокус — нативные; drag есть только принудительно. Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    type: 'unselected',
    size: 'sm',
    children: 'Отдел продаж',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'select', options: [undefined, ...STATES] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    image: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

/** Фильтр не выбран. */
export const Unselected: Story = { args: { type: 'unselected' } }
/** Фильтр выбран — мягкий акцент. */
export const Selected: Story = { args: { type: 'selected' } }
/** Фильтр выбран — сплошная заливка. */
export const SelectedSolid: Story = { args: { type: 'selected-solid' } }
/** С иконками и счётчиком. */
export const WithIcons: Story = { args: { leftIcon: 'users', rightIcon: 'cross', secondaryText: '12', type: 'selected' } }
/** Перетаскивание — только принудительно. */
export const Drag: Story = { args: { state: 'drag' } }
/** Недоступен: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true, children: 'Без плана' } }

/** Живой набор фильтров: клик переключает выбор. */
export const Live: Story = {
  render: (args) => (
    <Stateful<string[]> initial={['Отдел продаж']}>
      {(v, set) => (
        <Row>
          {FILTERS.map((f) => (
            <Chip
              key={f}
              {...args}
              type={v.includes(f) ? 'selected' : 'unselected'}
              onClick={(e) => {
                set(v.includes(f) ? v.filter((x) => x !== f) : [...v, f])
                args.onClick?.(e)
              }}
            >
              {f}
            </Chip>
          ))}
        </Row>
      )}
    </Stateful>
  ),
}

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи и нажми. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <Chip type={t} size={sz}>Отдел продаж</Chip>} />
      </Block>
      <Block title="Type × State (наведи и нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <Chip type={t} size="sm" state={st === 'default' ? undefined : st} leftIcon="users" rightIcon="cross" secondaryText="12">
              Команда
            </Chip>
          )}
        />
      </Block>
    </Stack>
  ),
}
