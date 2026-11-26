import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Matrix, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Radio } from './Radio'

const STATES = ['inactive', 'hover', 'active', 'disabled', 'active-pressed'] as const
const SIZES = ['sm', 'md'] as const
const LIVE = ['живой', ...STATES] as const
const PERIODS = ['Месяц', 'Квартал', 'Год'] as const

/**
 * Радиокнопка без подписи. Figma: кит, `Radio` `10053:1943` — 5 State × 2 Size.
 *
 * Нативный `<input type="radio">` поверх визуального слоя: checked, `:hover`, `:active`, `:focus-visible`,
 * `:disabled` работают сами. Проп `state` только фиксирует вид для сверки с Figma
 * (выставляет checked / disabled; в Figma `disabled` — выбранная радиокнопка).
 */
const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    size: 'md',
    name: 'period',
    'aria-label': 'Месяц',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    size: { control: 'inline-radio', options: SIZES },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

/** Не выбрана. */
export const Inactive: Story = { args: { state: 'inactive' } }
/** Выбрана. */
export const Active: Story = { args: { state: 'active' } }
/** Недоступна (выбрана). */
export const Disabled: Story = { args: { state: 'disabled' } }
/** Живая группа: выбор периода отчёта. */
export const Live: Story = {
  render: (args) => (
    <Stateful<string> initial="Месяц">
      {(v, set) => (
        <Row>
          {PERIODS.map((p) => (
            <Labeled key={p} label={p}>
              <Radio size={args.size} name="period-live" aria-label={p} checked={v === p} onChange={() => set(p)} />
            </Labeled>
          ))}
        </Row>
      )}
    </Stateful>
  ),
}

/** Матрица Size × State; первый столбец без `state` — кликается, hover и нажатие живые. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size × State">
        <Matrix
          rows={SIZES}
          cols={LIVE}
          render={(sz, st) => <Radio size={sz} state={st === 'живой' ? undefined : st} name={`all-${sz}-${st}`} aria-label="Месяц" />}
        />
      </Block>
    </Stack>
  ),
}
