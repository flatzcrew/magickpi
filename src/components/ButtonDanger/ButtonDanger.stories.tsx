import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { ButtonDanger } from './ButtonDanger'

const TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'pressed', 'disabled'] as const

/**
 * Кнопка деструктивного действия: удалить, отклонить. Figma: кит, `Button-danger` `10076:1687` — 6 Type × 5 Size × 4 State.
 *
 * Обёртка над Button: размеры, слоты и состояния те же, перекрыт только цвет. Дефолтный Size — xs, как в Figma.
 * Наведение, нажатие и фокус — нативные (`:hover`, `:active`, `:focus-visible`).
 * Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/ButtonDanger',
  component: ButtonDanger,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    children: 'Отклонить план',
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
} satisfies Meta<typeof ButtonDanger>

export default meta
type Story = StoryObj<typeof meta>

/** Основное деструктивное действие. */
export const Primary: Story = { args: { type: 'primary' } }
export const PrimaryGradient: Story = { args: { type: 'primary-gradient' } }
/** Мягкий вариант: удалить показатель из матрицы. */
export const PrimaryLight: Story = { args: { type: 'primary-light', children: 'Удалить показатель', leftIcon: 'bin' } }
export const Secondary: Story = { args: { type: 'secondary', children: 'Удалить задачу' } }
export const Tertiary: Story = { args: { type: 'tertiary', children: 'Удалить задачу' } }
export const Quaternary: Story = { args: { type: 'quaternary', children: 'Удалить задачу' } }
/** Недоступна. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <ButtonDanger type={t} size={sz}>Удалить</ButtonDanger>} />
      </Block>
      <Block title="Type × State (наведи и нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <ButtonDanger type={t} size="md" state={st === 'default' ? undefined : st} leftIcon="bin" secondaryText="3">
              Удалить
            </ButtonDanger>
          )}
        />
      </Block>
    </Stack>
  ),
}
