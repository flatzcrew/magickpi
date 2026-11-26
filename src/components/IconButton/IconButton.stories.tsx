import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { IconButton } from './IconButton'

const TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'flat', 'primary-flat'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'pressed', 'disabled'] as const

/**
 * Квадратная кнопка с одной иконкой. Figma: кит, `Icon-button` `10078:2975` — 9 Type × 5 Size × 4 State.
 *
 * Цвета и состояния — те же, что у Button. Текста нет, поэтому `aria-label` обязателен.
 * Наведение, нажатие и фокус — нативные (`:hover`, `:active`, `:focus-visible`).
 * Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    icon: 'plus',
    'aria-label': 'Добавить показатель',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    icon: { control: 'text' },
    'aria-label': { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/** Основное действие иконкой: добавить показатель. */
export const Primary: Story = { args: { type: 'primary' } }
/** Акцент с градиентом. */
export const PrimaryGradient: Story = { args: { type: 'primary-gradient' } }
/** Мягкий акцент. */
export const PrimaryLight: Story = { args: { type: 'primary-light' } }
/** Второстепенное действие: редактировать показатель. */
export const Secondary: Story = { args: { type: 'secondary', icon: 'edit', 'aria-label': 'Редактировать показатель' } }
export const Tertiary: Story = { args: { type: 'tertiary', icon: 'edit', 'aria-label': 'Редактировать показатель' } }
export const Quaternary: Story = { args: { type: 'quaternary', icon: 'edit', 'aria-label': 'Редактировать показатель' } }
/** Нейтральное действие: экспорт отчёта. */
export const Neutral: Story = { args: { type: 'neutral', icon: 'download', 'aria-label': 'Экспорт отчёта' } }
/** Без фона — действие в строке таблицы. */
export const Flat: Story = { args: { type: 'flat', icon: 'more-horizontal', 'aria-label': 'Ещё действия' } }
export const PrimaryFlat: Story = { args: { type: 'primary-flat', icon: 'more-horizontal', 'aria-label': 'Ещё действия' } }
/** Недоступна: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State — все варианты рядом для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <IconButton type={t} size={sz} icon="plus" aria-label="Добавить показатель" />} />
      </Block>
      <Block title="Type × State (наведи и нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => <IconButton type={t} state={st === 'default' ? undefined : st} icon="plus" aria-label="Добавить показатель" />}
        />
      </Block>
    </Stack>
  ),
}
