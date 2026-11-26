import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful, Width } from '../../catalog/Catalog'
import { InputCellMobile } from './InputCellMobile'

const TYPES = ['default', 'default-with-action', 'textarea'] as const
const SIZES = ['md', 'lg'] as const
const TONES = ['default', 'filled', 'active', 'danger', 'disabled'] as const

/**
 * Ячейка мобильного поля: стеклянная подложка, подпись слева в строке со значением. Figma: кит, `Input-cell-mobile` `53469:2145` — 3 Type × Size md · lg, +6.
 * В default-with-action подпись не выводится, справа — Button secondary. Рамку состояний задаёт InputFieldMobile через `tone`.
 *
 * Фокус и ввод — нативные; `tone` — оверрайд из поля для сверки с Figma.
 */
const meta = {
  title: 'Components/InputCellMobile',
  component: InputCellMobile,
  tags: ['autodocs'],
  args: {
    type: 'default',
    size: 'md',
    label: 'Факт',
    labelSupportText: 'за ноябрь',
    placeholder: '0',
    onChange: fn(),
    onActionClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    tone: { control: 'select', options: [undefined, ...TONES] },
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
      <InputCellMobile {...args} />
    </Width>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputCellMobile>

export default meta
type Story = StoryObj<typeof meta>

/** Подпись слева, значение справа. */
export const Default: Story = {}
/** С кнопкой действия; подпись не выводится. */
export const WithAction: Story = { args: { type: 'default-with-action', defaultValue: '98 из 120', actionText: 'Изменить' } }
/** Многострочная: подпись над значением. */
export const Textarea: Story = { args: { type: 'textarea', label: 'Комментарий к факту', labelSupportText: undefined, placeholder: 'Почему план не выполнен' } }
/** Size lg с иконкой и пояснением под значением. */
export const Large: Story = { args: { size: 'lg', leftIcon: 'analytics', supportText: 'план 120' } }

/** Живая ячейка: введи факт. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial="">
      {(v, set) => (
        <Width size="sm">
          <InputCellMobile
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

/** Type × Size и tone × значение; ячейки живые — кликни и введи. */
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
              <InputCellMobile type={t} size={sz} label="Факт" labelSupportText="за ноябрь" leftIcon="analytics" placeholder="0" />
            </Width>
          )}
        />
      </Block>
      <Block title="tone × значение">
        <Matrix
          rows={TONES}
          cols={['пусто', 'значение'] as const}
          render={(tn, c) => (
            <Width size="sm">
              <InputCellMobile tone={tn} label="Факт" placeholder="0" defaultValue={c === 'значение' ? '98' : undefined} />
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
