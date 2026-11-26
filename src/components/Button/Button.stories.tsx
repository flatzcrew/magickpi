import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { Button } from './Button'

const TYPES = ['primary', 'primary-gradient', 'primary-light', 'secondary', 'tertiary', 'quaternary', 'neutral', 'flat', 'primary-flat'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'pressed', 'disabled'] as const

/**
 * Кнопка действия. Figma: кит, `Button` `8003:300` — 9 Type × 5 Size × 4 State.
 *
 * Наведение, нажатие и фокус — нативные (`:hover`, `:active`, `:focus-visible`), с переходом 0.15s.
 * Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    children: 'Утвердить план',
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
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Основное действие экрана: одно на экран. */
export const Primary: Story = { args: { type: 'primary' } }
/** Акцент с градиентом — для промо-действий. */
export const PrimaryGradient: Story = { args: { type: 'primary-gradient' } }
/** Мягкий акцент. */
export const PrimaryLight: Story = { args: { type: 'primary-light', children: 'Добавить показатель' } }
/** Второстепенное действие рядом с основным. */
export const Secondary: Story = { args: { type: 'secondary', children: 'Отмена' } }
export const Tertiary: Story = { args: { type: 'tertiary', children: 'Отмена' } }
export const Quaternary: Story = { args: { type: 'quaternary', children: 'Отмена' } }
export const Neutral: Story = { args: { type: 'neutral', children: 'Экспорт' } }
/** Без фона — действие в строке или карточке. */
export const Flat: Story = { args: { type: 'flat', children: 'Подробнее' } }
export const PrimaryFlat: Story = { args: { type: 'primary-flat', children: 'Все задачи' } }
/** С иконками и вторичным текстом-счётчиком. */
export const WithIcons: Story = {
  args: { leftIcon: 'plus', rightIcon: 'chevron-down', secondaryText: '3', children: 'Задачи' },
}
/** Недоступна: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State — все варианты рядом для сверки с Figma. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <Button type={t} size={sz}>Утвердить</Button>} />
      </Block>
      <Block title="Type × State (наведи и нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <Button type={t} state={st === 'default' ? undefined : st} leftIcon="plus" rightIcon="chevron-down" secondaryText="3">
              Задачи
            </Button>
          )}
        />
      </Block>
    </Stack>
  ),
}
