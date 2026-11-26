import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { InputFieldSpecial } from './InputFieldSpecial'

const STATES = ['default', 'hover', 'default-dark', 'filled', 'active', 'danger', 'disabled', 'filled-dark', 'hover-dark'] as const
const TYPES = ['default', 'default-with-button', 'textarea'] as const
const SIZES = ['md', 'lg'] as const

/**
 * Поле с плавающей подписью и подсказкой. Figma: кит, `Input-field-special` `12041:1143` — 9 State, +1 (Input-hint).
 * InputCellSpecial + HintLabel md; подписи над полем нет — она плавающая внутри ячейки (`label`).
 *
 * hover / active / filled / disabled в работе нативные (наведение, фокус, значение, атрибут); danger и *-dark задаются пропом `state`.
 * Тёмные варианты повторяют тему — в продукте тему переключает `[data-theme]`.
 */
const meta = {
  title: 'Components/InputFieldSpecial',
  component: InputFieldSpecial,
  tags: ['autodocs'],
  args: {
    state: 'default',
    label: 'Плановое значение',
    inputHint: 'Сколько сделок нужно закрыть за месяц',
    secondaryText: 'шт.',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'select', options: STATES },
    inputHint: { control: 'text' },
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text' },
    labelSupportText: { control: 'text' },
    secondaryText: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    image: { control: 'text' },
    buttonText: { control: 'text' },
    htmlType: { control: 'text' },
    rows: { control: 'number' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
    onButtonClick: { control: false },
  },
  render: (args) => (
    <Width size="sm">
      <InputFieldSpecial {...args} />
    </Width>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputFieldSpecial>

export default meta
type Story = StoryObj<typeof meta>

/** Пустое поле — наведение и фокус нативные. */
export const Default: Story = {}
/** Заполнено. */
export const Filled: Story = { args: { state: 'filled', defaultValue: '40' } }
/** В фокусе. */
export const Active: Story = { args: { state: 'active' } }
/** Ошибка: подсказка становится текстом ошибки. */
export const Danger: Story = { args: { state: 'danger', defaultValue: '-5', inputHint: 'План не может быть отрицательным' } }
/** Недоступно: план уже согласован. */
export const Disabled: Story = { args: { state: 'disabled', defaultValue: '40', inputHint: 'План согласован, изменить нельзя' } }
/** Тёмный вариант кита. */
export const DefaultDark: Story = { args: { state: 'default-dark' } }

/** Живое поле: введи значение плана. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="">
      {(v, set) => (
        <Width size="sm">
          <InputFieldSpecial
            {...args}
            value={v}
            onChange={(e) => {
              set(e.target.value)
              args.onChange?.(e)
            }}
          />
        </Width>
      )}
    </Stateful>
  ),
}

/** State × значение; строка default — живая, наведи, кликни и введи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="State × значение">
        <Matrix
          rows={STATES}
          cols={['пусто', 'значение'] as const}
          render={(st, c) => (
            <Width size="sm">
              <InputFieldSpecial
                state={st}
                label="Плановое значение"
                secondaryText="шт."
                inputHint={st === 'danger' ? 'План не может быть отрицательным' : 'Сколько сделок за месяц'}
                defaultValue={c === 'значение' ? '40' : undefined}
              />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
