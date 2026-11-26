import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Matrix, Row, Stack, Stateful } from '../../catalog/Catalog'
import { Checkbox } from './Checkbox'

const STATES = ['unchecked', 'hover', 'checked', 'disabled', 'indeterminate', 'indeterminate-disabled', 'checked-pressed'] as const
const SIZES = ['sm', 'md', 'lg'] as const
const LIVE = ['живой', ...STATES] as const
const EMPLOYEES = ['Иван Петров', 'Анна Смирнова', 'Олег Котов'] as const

/**
 * Чекбокс без подписи. Figma: кит, `Checkbox` `10030:982` — 7 State × 3 Size.
 *
 * Нативный `<input type="checkbox">` поверх визуального слоя: checked, indeterminate, `:hover`, `:active`,
 * `:focus-visible`, `:disabled` работают сами. Проп `state` только фиксирует вид для сверки с Figma
 * (выставляет checked / indeterminate / disabled; в Figma `disabled` — отмеченный чекбокс).
 */
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    size: 'md',
    'aria-label': 'Выбрать показатель',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'select', options: [undefined, ...STATES] },
    size: { control: 'inline-radio', options: SIZES },
    indeterminate: { control: 'boolean' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** Не отмечен. */
export const Unchecked: Story = { args: { state: 'unchecked' } }
/** Отмечен. */
export const Checked: Story = { args: { state: 'checked' } }
/** Частично: выбрана часть сотрудников отдела. */
export const Indeterminate: Story = { args: { state: 'indeterminate' } }
/** Недоступен (отмечен). */
export const Disabled: Story = { args: { state: 'disabled' } }
/** Недоступен, частично. */
export const IndeterminateDisabled: Story = { args: { state: 'indeterminate-disabled' } }
/** Живой чекбокс: клик переключает. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial={false}>
      {(v, set) => <Checkbox {...args} checked={v} onChange={(e) => set(e.target.checked)} />}
    </Stateful>
  ),
}
/** Живой «выбрать всех»: indeterminate, когда выбрана часть сотрудников. */
export const LiveSelectAll: Story = {
  render: (args) => (
    <Stateful initial={[true, false, false]}>
      {(v, set) => {
        const all = v.every(Boolean)
        const some = v.some(Boolean)
        return (
          <Row>
            <Labeled label="Отдел продаж">
              <Checkbox
                size={args.size}
                aria-label="Выбрать всех"
                checked={all}
                indeterminate={some && !all}
                onChange={() => set(v.map(() => !all))}
              />
            </Labeled>
            {EMPLOYEES.map((name, i) => (
              <Labeled key={name} label={name}>
                <Checkbox
                  size={args.size}
                  aria-label={name}
                  checked={v[i]}
                  onChange={(e) => set(v.map((x, j) => (j === i ? e.target.checked : x)))}
                />
              </Labeled>
            ))}
          </Row>
        )
      }}
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
          render={(sz, st) => <Checkbox size={sz} state={st === 'живой' ? undefined : st} aria-label="Выбрать показатель" />}
        />
      </Block>
    </Stack>
  ),
}
