import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { InputCell } from './InputCell'

const TYPES = ['default', 'default-with-button', 'textarea'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'filled', 'active', 'danger', 'disabled', 'naked', 'default-dark', 'default-dark-hover', 'filled-dark', 'naked-disabled'] as const
const LIVE = ['живой', ...STATES] as const

/**
 * Ячейка поля ввода. Figma: кит, `Input-cell` `8016:286` — 3 Type × 5 Size, плюс иконки, суффикс, картинка, кнопка.
 *
 * Рамку состояний обычно задаёт InputField. `state` — в Figma не вариант, а оверрайд инстанса в Input-field;
 * в работе hover — `:hover`, active — `:focus-within`, disabled — атрибут, filled — по значению.
 * Проп `state` только фиксирует состояние для сверки с Figma. Варианты `*-dark` повторяют тему.
 */
const meta = {
  title: 'Components/InputCell',
  component: InputCell,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 'md',
    placeholder: 'Введите план',
    secondaryText: '₽',
    leftIcon: 'search',
    onChange: fn(),
    onButtonClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'select', options: [undefined, ...STATES] },
    secondaryText: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    image: { control: 'text' },
    buttonText: { control: 'text' },
    htmlType: { control: 'text' },
    rows: { control: 'number' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
    onButtonClick: { control: false },
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <Width size="sm">
      <InputCell {...args} />
    </Width>
  ),
} satisfies Meta<typeof InputCell>

export default meta
type Story = StoryObj<typeof meta>

/** Обычная ячейка с иконкой и суффиксом. */
export const Default: Story = {}
/** С кнопкой справа: применить план ко всем. */
export const WithButton: Story = { args: { type: 'default-with-button', buttonText: 'Применить', secondaryText: undefined, leftIcon: undefined } }
/** Многострочная: комментарий к согласованию. */
export const Textarea: Story = { args: { type: 'textarea', placeholder: 'Комментарий к согласованию', rows: 3 } }
/** Ошибка значения. */
export const Danger: Story = { args: { state: 'danger', defaultValue: '-500' } }
/** Недоступна. */
export const Disabled: Story = { args: { disabled: true, defaultValue: '150 000' } }
/** Без рамки — внутри таблицы. */
export const Naked: Story = { args: { state: 'naked' } }
/** Живая ячейка: ввод меняет значение. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="150 000">
      {(v, set) => (
        <Width size="sm">
          <InputCell {...args} value={v} onChange={(e) => set(e.target.value)} />
        </Width>
      )}
    </Stateful>
  ),
}

/** Матрица Type × Size и все State; первый State без `state` — hover и фокус живые. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix
          rows={TYPES}
          cols={SIZES}
          render={(t, sz) => (
            <Width size="sm">
              <InputCell type={t} size={sz} placeholder="Введите план" leftIcon="search" buttonText="Применить" />
            </Width>
          )}
        />
      </Block>
      <Block title="State">
        <Matrix
          rows={LIVE}
          cols={['md'] as const}
          render={(st) => (
            <Width size="sm">
              <InputCell
                state={st === 'живой' ? undefined : st}
                placeholder="Введите план"
                secondaryText="₽"
                defaultValue={st.startsWith('filled') ? '150 000' : undefined}
              />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
