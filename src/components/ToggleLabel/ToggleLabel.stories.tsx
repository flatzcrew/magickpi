import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { ToggleLabel } from './ToggleLabel'

const DIRECTIONS = ['left', 'right'] as const
const SIZES = ['sm', 'md'] as const
const STATES = ['switch-off', 'switch-off-disabled', 'switch-on', 'switch-on-disabled', 'switch-on-pressed'] as const

/**
 * Переключатель с подписью и описанием. Figma: кит, `Toggle-label` `10101:3995` — Direction left · right × Size sm · md, +1 (Description).
 * Контрол — `Toggle` (sm → 40×28, md → 48×28); раскладка общая с CheckboxLabel.
 *
 * Нажатие и фокус — нативные. Проп `state` (из Toggle) только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/ToggleLabel',
  component: ToggleLabel,
  tags: ['autodocs'],
  args: {
    direction: 'left',
    size: 'sm',
    children: 'Напоминать о вводе факта',
    description: 'За три дня до закрытия месяца',
    onChange: fn(),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: DIRECTIONS },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'select', options: [undefined, ...STATES] },
    children: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToggleLabel>

export default meta
type Story = StoryObj<typeof meta>

/** Переключатель слева от текста. */
export const Left: Story = { args: { direction: 'left' } }
/** Переключатель справа — строка настроек. */
export const Right: Story = { args: { direction: 'right' } }
/** Size md. */
export const Medium: Story = { args: { size: 'md' } }
/** Включён. */
export const On: Story = { args: { state: 'switch-on' } }
/** Недоступен: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true } }

/** Живой контролируемый переключатель. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial={true}>
      {(v, set) => (
        <ToggleLabel
          {...args}
          checked={v}
          onChange={(e) => {
            set(e.target.checked)
            args.onChange?.(e)
          }}
        />
      )}
    </Stateful>
  ),
}

/** Матрица Direction × Size и State × Size; строка native — без принудительного состояния, нажми. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Direction × Size">
        <Matrix
          rows={DIRECTIONS}
          cols={SIZES}
          render={(d, sz) => (
            <ToggleLabel direction={d} size={sz} description="За три дня до закрытия месяца" defaultChecked>
              Напоминать о вводе факта
            </ToggleLabel>
          )}
        />
      </Block>
      <Block title="State × Size (native — живой)">
        <Matrix
          rows={['native', ...STATES] as const}
          cols={SIZES}
          render={(st, sz) => (
            <ToggleLabel size={sz} state={st === 'native' ? undefined : st} description="Видно всей команде">
              Показывать мои KPI
            </ToggleLabel>
          )}
        />
      </Block>
    </Stack>
  ),
}
