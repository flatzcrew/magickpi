import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Labeled, Row, Stack, Stateful, Width } from '../../catalog/Catalog'
import { InputField } from './InputField'

const STATES = ['default', 'hover', 'filled', 'active', 'danger', 'disabled', 'naked', 'digit', 'digit-lg', 'default-dark', 'default-dark-hover', 'filled-dark', 'naked-disabled'] as const
const CELL_TYPES = ['default', 'default-with-button', 'textarea'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

/**
 * Поле ввода целиком. Figma: кит, `Input-field` `12022:7132` — 13 State, плюс подпись, подсказка, разделитель.
 *
 * Состав: InputLabel + InputCell + HintLabel; в `digit` / `digit-lg` вместо ячейки — ряд DigitInput (3 + «-» + 3).
 * default / hover / active / filled / disabled в работе нативные (hover, фокус, значение, атрибут);
 * danger, naked, digit задаются пропом. Варианты `*-dark` повторяют тему (тему переключает `[data-theme]`).
 */
const meta = {
  title: 'Components/InputField',
  component: InputField,
  tags: ['autodocs'],
  args: {
    state: 'default',
    inputLabel: 'План на ноябрь',
    inputHint: 'Сумма по отделу продаж — 1 500 000 ₽',
    placeholder: 'Введите план',
    secondaryText: '₽',
    separator: true,
    digits: 6,
    onChange: fn(),
    onDigitChange: fn(),
    onButtonClick: fn(),
  },
  argTypes: {
    state: { control: 'select', options: STATES },
    inputLabel: { control: 'text' },
    inputHint: { control: 'text' },
    separator: { control: 'boolean' },
    digits: { control: 'number' },
    digitValue: { control: 'text' },
    type: { control: 'inline-radio', options: CELL_TYPES },
    size: { control: 'inline-radio', options: SIZES },
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
    onDigitChange: { control: false },
    onButtonClick: { control: false },
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <Width size="sm">
      <InputField {...args} />
    </Width>
  ),
} satisfies Meta<typeof InputField>

export default meta
type Story = StoryObj<typeof meta>

/** Пустое поле с подписью и подсказкой. */
export const Default: Story = {}
/** Заполнено. */
export const Filled: Story = { args: { state: 'filled', defaultValue: '150 000' } }
/** Ошибка: подсказка становится текстом ошибки. */
export const Danger: Story = { args: { state: 'danger', defaultValue: '1 800 000', inputHint: 'Больше плана отдела на 300 000 ₽' } }
/** Недоступно: план уже согласован. */
export const Disabled: Story = { args: { state: 'disabled', defaultValue: '150 000', inputHint: 'План согласован, изменить нельзя' } }
/** Без рамки. */
export const Naked: Story = { args: { state: 'naked' } }
/** Код подтверждения: 6 ячеек. */
export const Digit: Story = { args: { state: 'digit', inputLabel: 'Код из письма', inputHint: 'Отправили на почту руководителя' } }
/** Код подтверждения, крупные ячейки. */
export const DigitLarge: Story = { args: { state: 'digit-lg', inputLabel: 'Код из письма', inputHint: undefined } }
/** Живое поле: ввод меняет значение, пустое — ошибка. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="150 000">
      {(v, set) => (
        <Width size="sm">
          <InputField
            {...args}
            value={v}
            state={v ? 'default' : 'danger'}
            inputHint={v ? 'Сумма по отделу продаж — 1 500 000 ₽' : 'Укажите план'}
            onChange={(e) => set(e.target.value)}
          />
        </Width>
      )}
    </Stateful>
  ),
}
/** Живой код подтверждения: ввод переходит к следующей ячейке. */
export const LiveDigit: Story = {
  render: (args) => (
    <Stateful initial="">
      {(v, set) => <InputField {...args} state="digit" inputLabel="Код из письма" digitValue={v} onDigitChange={set} />}
    </Stateful>
  ),
}

/** Все 13 State; default подан без принудительного вида — hover и фокус живые. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="State">
        <Row>
          {STATES.map((st) => (
            <Labeled key={st} label={st}>
              <Width size="sm">
                <InputField
                  state={st}
                  inputLabel="План на ноябрь"
                  inputHint="Сумма по отделу — 1 500 000 ₽"
                  placeholder="Введите план"
                  secondaryText="₽"
                  defaultValue={st.startsWith('filled') ? '150 000' : undefined}
                />
              </Width>
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
