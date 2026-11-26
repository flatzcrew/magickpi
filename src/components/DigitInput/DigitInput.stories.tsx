import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { DigitInput } from './DigitInput'

const STATES = ['default', 'hover', 'default-dark', 'filled', 'active', 'danger', 'disabled', 'filled-dark', 'hover-dark'] as const
const SIZES = ['md', 'lg'] as const
const LIVE = ['живой', ...STATES] as const

/**
 * Одна ячейка кода подтверждения. Figma: кит, `Digit-input` `12045:686` — 9 State.
 *
 * В работе: hover — `:hover`, active — `:focus`, filled — есть значение, disabled — атрибут;
 * danger задаётся пропом. Варианты `*-dark` повторяют тему (тему переключает `[data-theme]`).
 * Проп `state` только фиксирует состояние для сверки с Figma.
 * `size` lg — в Figma не вариант, а оверрайд в InputField `digit-lg`.
 */
const meta = {
  title: 'Components/DigitInput',
  component: DigitInput,
  tags: ['autodocs'],
  args: {
    size: 'md',
    'aria-label': 'Цифра кода',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'select', options: [undefined, ...STATES] },
    size: { control: 'inline-radio', options: SIZES },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DigitInput>

export default meta
type Story = StoryObj<typeof meta>

/** Пустая ячейка. */
export const Default: Story = {}
/** Заполнена цифрой. */
export const Filled: Story = { args: { state: 'filled', defaultValue: '7' } }
/** В фокусе. */
export const Active: Story = { args: { state: 'active' } }
/** Неверный код. */
export const Danger: Story = { args: { state: 'danger', defaultValue: '3' } }
/** Недоступна. */
export const Disabled: Story = { args: { state: 'disabled' } }
/** Крупная ячейка (как в InputField digit-lg). */
export const Large: Story = { args: { size: 'lg' } }
/** Живая ячейка: введи цифру. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="">
      {(v, set) => <DigitInput {...args} value={v} onChange={(e) => set(e.target.value.slice(-1))} />}
    </Stateful>
  ),
}

/** Матрица Size × State; первый столбец без `state` — hover и фокус живые. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size × State">
        <Matrix
          rows={SIZES}
          cols={LIVE}
          render={(sz, st) => (
            <DigitInput
              size={sz}
              state={st === 'живой' ? undefined : st}
              defaultValue={st.startsWith('filled') || st === 'danger' ? '7' : undefined}
              aria-label="Цифра кода"
            />
          )}
        />
      </Block>
    </Stack>
  ),
}
