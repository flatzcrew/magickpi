import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import { CheckboxLabel } from './CheckboxLabel'

const DIRECTIONS = ['left', 'right'] as const
const SIZES = ['sm', 'md'] as const
const STATES = [
  'unchecked',
  'hover',
  'checked',
  'disabled',
  'indeterminate',
  'indeterminate-disabled',
  'checked-pressed',
] as const

/**
 * Чекбокс с подписью и описанием. Figma: кит, `Checkbox-label` `10095:3846` — Direction left · right × Size sm · md, +2 (Label, Description).
 * Контрол — `Checkbox` (Size sm → 20, md → 24); состояния берутся из него.
 *
 * Наведение, нажатие и фокус — нативные. Проп `state` (из Checkbox) только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/CheckboxLabel',
  component: CheckboxLabel,
  tags: ['autodocs'],
  args: {
    direction: 'left',
    size: 'sm',
    children: 'Показатель выполнен',
    description: 'Факт за месяц не ниже плана',
    onChange: fn(),
  },
  argTypes: {
    direction: { control: 'inline-radio', options: DIRECTIONS },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'select', options: [undefined, ...STATES] },
    children: { control: 'text' },
    description: { control: 'text' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CheckboxLabel>

export default meta
type Story = StoryObj<typeof meta>

/** Чекбокс слева от текста — основной вариант в списках и формах. */
export const Left: Story = { args: { direction: 'left' } }
/** Чекбокс справа — для строк настроек, где текст важнее контрола. */
export const Right: Story = { args: { direction: 'right', children: 'Уведомлять о согласовании', description: 'Письмо, когда руководитель утвердит план' } }
/** Size md — крупный контрол и текст. */
export const Medium: Story = { args: { size: 'md' } }
/** Только подпись, без второй строки. */
export const WithoutDescription: Story = { args: { description: undefined, children: 'Отдел продаж' } }
/** Частичный выбор: часть сотрудников группы отмечена. */
export const Indeterminate: Story = { args: { indeterminate: true, children: 'Вся команда', description: 'Выбрано 3 из 8 сотрудников' } }
/** Недоступен: нативный `disabled`. */
export const Disabled: Story = { args: { disabled: true } }

/** Живой контролируемый чекбокс: клик по подписи меняет значение. */
export const Live: Story = {
  render: (args) => (
    <Stateful initial={false}>
      {(v, set) => (
        <CheckboxLabel
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
            <CheckboxLabel direction={d} size={sz} description="Факт за месяц не ниже плана" defaultChecked>
              Показатель выполнен
            </CheckboxLabel>
          )}
        />
      </Block>
      <Block title="State × Size (native — живой)">
        <Matrix
          rows={['native', ...STATES] as const}
          cols={SIZES}
          render={(st, sz) => (
            <CheckboxLabel size={sz} state={st === 'native' ? undefined : st} description="Отдел продаж">
              Иван Петров
            </CheckboxLabel>
          )}
        />
      </Block>
    </Stack>
  ),
}
