import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { InputFieldMobile } from './InputFieldMobile'

const STATES = ['default', 'filled', 'active', 'danger', 'disabled'] as const
const TYPES = ['default', 'default-with-action', 'textarea'] as const
const SIZES = ['md', 'lg'] as const

/**
 * Мобильное поле с подсказкой. Figma: кит, `Input-field-mobile` `53469:2117` — State default · filled · active · danger · disabled, +1 (Input-hint).
 * InputCellMobile + HintLabel md.
 *
 * filled / active / disabled в работе нативные (значение, фокус, атрибут); danger задаётся пропом `state`.
 */
const meta = {
  title: 'Components/InputFieldMobile',
  component: InputFieldMobile,
  tags: ['autodocs'],
  args: {
    state: 'default',
    label: 'Факт',
    labelSupportText: 'за ноябрь',
    placeholder: '0',
    inputHint: 'План на месяц — 120 сделок',
    onChange: fn(),
  },
  argTypes: {
    state: { control: 'inline-radio', options: STATES },
    inputHint: { control: 'text' },
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text' },
    labelSupportText: { control: 'text' },
    supportText: { control: 'text' },
    leftIcon: { control: 'text' },
    image: { control: 'text' },
    actionText: { control: 'text' },
    htmlType: { control: 'text' },
    rows: { control: 'number' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
    onActionClick: { control: false },
  },
  render: (args) => (
    <Width size="sm">
      <InputFieldMobile {...args} />
    </Width>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputFieldMobile>

export default meta
type Story = StoryObj<typeof meta>

/** Пустое поле. */
export const Default: Story = {}
/** Заполнено. */
export const Filled: Story = { args: { state: 'filled', defaultValue: '98' } }
/** В фокусе. */
export const Active: Story = { args: { state: 'active' } }
/** Ошибка. */
export const Danger: Story = { args: { state: 'danger', defaultValue: 'сто', inputHint: 'Введите число' } }
/** Недоступно: месяц закрыт. */
export const Disabled: Story = { args: { state: 'disabled', defaultValue: '98', inputHint: 'Месяц закрыт, факт изменить нельзя' } }

/** Живое поле: введи факт. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="">
      {(v, set) => (
        <Width size="sm">
          <InputFieldMobile
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

/** State × значение; строка default — живая. */
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
              <InputFieldMobile
                state={st}
                label="Факт"
                placeholder="0"
                inputHint={st === 'danger' ? 'Введите число' : 'План на месяц — 120'}
                defaultValue={c === 'значение' ? '98' : undefined}
              />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
