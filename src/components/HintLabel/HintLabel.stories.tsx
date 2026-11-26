import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { HintLabel } from './HintLabel'

const SIZES = ['sm', 'md', 'lg'] as const
const TONES = ['default', 'danger', 'disabled'] as const

/**
 * Подсказка или ошибка под полем. Figma: кит, `Hint-label` `12021:6331` — 3 Size, плюс иконка и пояснение.
 *
 * `tone` (default · danger · disabled) — в Figma не вариант, а оверрайд инстанса в InputField:
 * danger — текст ошибки, disabled — приглушённый. Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/HintLabel',
  component: HintLabel,
  tags: ['autodocs'],
  args: {
    size: 'md',
    tone: 'default',
    children: 'Сумма плана по сотрудникам',
    supportText: '120 000 / 150 000',
    icon: 'info',
  },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    tone: { control: 'inline-radio', options: TONES },
    children: { control: 'text' },
    supportText: { control: 'text' },
    icon: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof HintLabel>

export default meta
type Story = StoryObj<typeof meta>

/** Обычная подсказка. */
export const Default: Story = {}
/** Ошибка: план не сходится. */
export const Danger: Story = { args: { tone: 'danger', children: 'Сумма планов больше плана отдела', supportText: undefined } }
/** Поле недоступно. */
export const Disabled: Story = { args: { tone: 'disabled' } }
/** Маленькая. */
export const Small: Story = { args: { size: 'sm' } }
/** Крупная. */
export const Large: Story = { args: { size: 'lg' } }

/** Матрица Tone × Size. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Tone × Size">
        <Matrix
          rows={TONES}
          cols={SIZES}
          render={(t, sz) => (
            <HintLabel size={sz} tone={t} icon="info" supportText="0/100">
              Комментарий к согласованию
            </HintLabel>
          )}
        />
      </Block>
    </Stack>
  ),
}
