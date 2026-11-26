import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { ButtonSuccess } from './ButtonSuccess'

const TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'pressed', 'disabled'] as const

/**
 * Кнопка подтверждающего действия: согласовать, принять. Figma: кит, `Button-success` `10078:1874` — 6 Type × 5 Size × 4 State.
 *
 * Обёртка над Button: размеры, слоты и состояния те же, перекрыт только цвет. Дефолтный Size — xs, как в Figma.
 * Наведение, нажатие и фокус — нативные (`:hover`, `:active`, `:focus-visible`).
 * Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/ButtonSuccess',
  component: ButtonSuccess,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    children: 'Согласовать план',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
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
} satisfies Meta<typeof ButtonSuccess>

export default meta
type Story = StoryObj<typeof meta>

/** Основное подтверждение: согласовать план. */
export const Primary: Story = { args: { type: 'primary' } }
export const PrimaryGradient: Story = { args: { type: 'primary-gradient' } }
/** Мягкий вариант: принять факт. */
export const PrimaryLight: Story = { args: { type: 'primary-light', children: 'Принять факт', leftIcon: 'check' } }
export const Secondary: Story = { args: { type: 'secondary', children: 'Принять задачу' } }
export const Tertiary: Story = { args: { type: 'tertiary', children: 'Принять задачу' } }
export const Quaternary: Story = { args: { type: 'quaternary', children: 'Принять задачу' } }
/** Недоступна. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <ButtonSuccess type={t} size={sz}>Принять</ButtonSuccess>} />
      </Block>
      <Block title="Type × State (наведи и нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <ButtonSuccess type={t} size="md" state={st === 'default' ? undefined : st} leftIcon="check" secondaryText="3">
              Принять
            </ButtonSuccess>
          )}
        />
      </Block>
    </Stack>
  ),
}
