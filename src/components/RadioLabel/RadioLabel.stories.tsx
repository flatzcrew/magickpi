import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { RadioLabel } from './RadioLabel'

const DIRECTIONS = ['left', 'right'] as const
const SIZES = ['sm', 'md'] as const
const STATES = ['inactive', 'hover', 'active', 'disabled', 'active-pressed'] as const
const PERIODS = [
  { value: 'month', label: 'Месяц', description: 'План и факт по каждому месяцу' },
  { value: 'quarter', label: 'Квартал', description: 'Итог по трём месяцам' },
  { value: 'year', label: 'Год', description: 'Годовой результат сотрудника' },
] as const

/**
 * Радиокнопка с подписью и описанием. Figma: кит, `Radio-label` `10100:3931` — Direction left · right × Size sm · md, +2 (Label, Description).
 * Контрол — `Radio` (Size sm → 20, md → 24); раскладка общая с CheckboxLabel.
 *
 * Наведение, нажатие и фокус — нативные. Проп `state` (из Radio) только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/RadioLabel',
  component: RadioLabel,
  tags: ['autodocs'],
  args: {
    direction: 'left',
    size: 'sm',
    name: 'period',
    children: 'Квартал',
    description: 'Итог по трём месяцам',
    onChange: fn(),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: DIRECTIONS },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'select', options: [undefined, ...STATES] },
    children: { control: 'text' },
    description: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RadioLabel>

export default meta
type Story = StoryObj<typeof meta>

/** Радио слева от текста — основной вариант. */
export const Left: Story = { args: { direction: 'left' } }
/** Радио справа от текста. */
export const Right: Story = { args: { direction: 'right' } }
/** Size md — крупный контрол и текст. */
export const Medium: Story = { args: { size: 'md' } }
/** Выбранный пункт. */
export const Active: Story = { args: { state: 'active' } }
/** Недоступен: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true } }

/** Живая группа выбора периода: клик меняет выбранный пункт. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="month">
      {(v, set) => (
        <Stack>
          {PERIODS.map((p) => (
            <RadioLabel
              key={p.value}
              {...args}
              name="period-live"
              value={p.value}
              checked={v === p.value}
              description={p.description}
              onChange={(e) => {
                set(p.value)
                args.onChange?.(e)
              }}
            >
              {p.label}
            </RadioLabel>
          ))}
        </Stack>
      )}
    </Stateful>
  ),
}

/** Матрица Direction × Size и State × Size; строка native — без принудительного состояния, наведи и нажми. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Direction × Size">
        <Matrix
          rows={DIRECTIONS}
          cols={SIZES}
          render={(d, sz) => (
            <RadioLabel direction={d} size={sz} name={`rl-${d}-${sz}`} description="Итог по трём месяцам" defaultChecked>
              Квартал
            </RadioLabel>
          )}
        />
      </Block>
      <Block title="State × Size (native — живой)">
        <Matrix
          rows={['native', ...STATES] as const}
          cols={SIZES}
          render={(st, sz) => (
            <RadioLabel size={sz} name={`rs-${st}-${sz}`} state={st === 'native' ? undefined : st} description="План и факт по месяцам">
              Месяц
            </RadioLabel>
          )}
        />
      </Block>
    </Stack>
  ),
}
