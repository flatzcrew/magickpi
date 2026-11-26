import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { Status } from './Status'

const TYPES = ['success', 'warning', 'danger', 'disabled'] as const
const OUTLINES = ['outline=false', 'outline=true'] as const

/**
 * Точка статуса. Figma: кит, `Status` `10009:933` — 4 Type × Outline false/true.
 *
 * Размер 4×4 по умолчанию, родитель меняет его через `--status-size` (так делает Avatar).
 * Outline — обводка для точки поверх аватара или иконки. Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/Status',
  component: Status,
  tags: ['autodocs'],
  args: {
    type: 'success',
    outline: false,
    'aria-label': 'План выполнен',
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    outline: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Status>

export default meta
type Story = StoryObj<typeof meta>

/** План выполнен. */
export const Success: Story = { args: { type: 'success' } }
/** Есть риск невыполнения. */
export const Warning: Story = { args: { type: 'warning', 'aria-label': 'Риск невыполнения' } }
/** План провален. */
export const Danger: Story = { args: { type: 'danger', 'aria-label': 'План не выполнен' } }
/** Нет данных. */
export const Disabled: Story = { args: { type: 'disabled', 'aria-label': 'Нет данных' } }
/** С обводкой — поверх аватара сотрудника. */
export const Outline: Story = { args: { outline: true } }

/** Матрица Type × Outline. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Outline × Type">
        <Matrix rows={OUTLINES} cols={TYPES} render={(r, c) => <Status type={c} outline={r === 'outline=true'} />} />
      </Block>
    </Stack>
  ),
}
