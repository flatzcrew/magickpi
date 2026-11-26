import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { Toggle } from './Toggle'

const STATES = ['switch-off', 'switch-off-disabled', 'switch-on', 'switch-on-disabled', 'switch-on-pressed'] as const
const SIZES = ['sm', 'md', 'lg', 'mobile'] as const
const LIVE = ['живой', ...STATES] as const

/**
 * Переключатель вкл/выкл. Figma: кит, `Toggle` `10023:1125` — 5 State × 4 Size.
 *
 * Нативный `<input type="checkbox" role="switch">` поверх визуального слоя: checked, `:active`,
 * `:focus-visible`, `:disabled` работают сами. Проп `state` только фиксирует вид для сверки с Figma
 * (выставляет checked / disabled).
 */
const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {
    size: 'md',
    'aria-label': 'Уведомлять о согласовании',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    size: { control: 'inline-radio', options: SIZES },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

/** Выключен. */
export const SwitchOff: Story = { args: { state: 'switch-off' } }
/** Включён. */
export const SwitchOn: Story = { args: { state: 'switch-on' } }
/** Выключен и недоступен. */
export const SwitchOffDisabled: Story = { args: { state: 'switch-off-disabled' } }
/** Включён и недоступен. */
export const SwitchOnDisabled: Story = { args: { state: 'switch-on-disabled' } }
/** Мобильный размер. */
export const Mobile: Story = { args: { size: 'mobile', state: 'switch-on' } }
/** Живой переключатель: клик меняет состояние. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial={true}>
      {(v, set) => <Toggle {...args} checked={v} onChange={(e) => set(e.target.checked)} />}
    </Stateful>
  ),
}

/** Матрица Size × State; первый столбец без `state` — кликается, нажатие живое. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size × State">
        <Matrix
          rows={SIZES}
          cols={LIVE}
          render={(sz, st) => <Toggle size={sz} state={st === 'живой' ? undefined : st} aria-label="Уведомлять о согласовании" />}
        />
      </Block>
    </Stack>
  ),
}
