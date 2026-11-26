import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { InputCellSpecial } from './InputCellSpecial'

const TYPES = ['default', 'default-with-button', 'textarea'] as const
const SIZES = ['md', 'lg'] as const
const STATES = ['resting', 'pressed'] as const
const TONES = ['default', 'hover', 'default-dark', 'filled', 'active', 'danger', 'disabled', 'filled-dark', 'hover-dark'] as const

/**
 * Ячейка поля с плавающей подписью. Figma: кит, `Input-cell-special` `12041:566` — 3 Type × Size md · lg × State resting · pressed, +9.
 * resting — подпись на месте значения; pressed — подпись уменьшается и уходит вверх. Рамку состояний поля задаёт InputFieldSpecial через `tone`.
 *
 * В работе pressed включается сам (фокус или непустое значение). Проп `state` только фиксирует вид для сверки с Figma; `tone` — оверрайд из поля.
 */
const meta = {
  title: 'Components/InputCellSpecial',
  component: InputCellSpecial,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 'md',
    label: 'План на месяц',
    labelSupportText: '(шт.)',
    onChange: fn(),
    onButtonClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    tone: { control: 'select', options: [undefined, ...TONES] },
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
      <InputCellSpecial {...args} />
    </Width>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputCellSpecial>

export default meta
type Story = StoryObj<typeof meta>

/** Пустая ячейка: подпись на месте значения. */
export const Default: Story = {}
/** С кнопкой справа. */
export const WithButton: Story = { args: { type: 'default-with-button', label: 'Комментарий к факту', labelSupportText: undefined, buttonText: 'Отправить' } }
/** Многострочная. */
export const Textarea: Story = { args: { type: 'textarea', label: 'Описание задачи', labelSupportText: undefined } }
/** Заполнена: подпись наверху, значение с суффиксом. */
export const Pressed: Story = { args: { defaultValue: '120', secondaryText: 'шт.', labelSupportText: undefined } }
/** Size lg. */
export const Large: Story = { args: { size: 'lg', leftIcon: 'analytics' } }

/** Живая ячейка: введи значение — подпись уезжает вверх. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="">
      {(v, set) => (
        <Width size="sm">
          <InputCellSpecial
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

/** Type × State по каждому Size и tone; native — без принудительного состояния, кликни и введи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      {SIZES.map((sz) => (
        <Block key={sz} title={`Type × State — size ${sz} (native — живой)`}>
          <Matrix
            rows={TYPES}
            cols={['native', ...STATES] as const}
            render={(t, st) => (
              <Width size="sm">
                <InputCellSpecial
                  type={t}
                  size={sz}
                  state={st === 'native' ? undefined : st}
                  label="План на месяц"
                  labelSupportText="(шт.)"
                  leftIcon="analytics"
                  defaultValue={st === 'pressed' ? '120' : undefined}
                />
              </Width>
            )}
          />
        </Block>
      ))}
      <Block title="tone × значение">
        <Matrix
          rows={TONES}
          cols={['пусто', 'значение'] as const}
          render={(tn, c) => (
            <Width size="sm">
              <InputCellSpecial tone={tn} label="Факт за месяц" defaultValue={c === 'значение' ? '98' : undefined} secondaryText="шт." />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
