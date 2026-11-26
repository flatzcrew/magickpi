import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { InfoNote } from './InfoNote'

const STATES = ['default', 'info', 'success', 'warning', 'danger', 'brand'] as const
const SIZES = ['sm', 'md', 'lg'] as const

/**
 * Компактная поясняющая заметка. Figma: кит, `Info-note` `12126:4670` — 6 State × 3 Size, плюс иконка.
 *
 * `state` здесь — цвет заметки, а не интерактивное состояние. Иконка по умолчанию `info`, `icon={false}` скрывает.
 * Ширина — по родителю. Интерактивных состояний нет.
 */
const meta = {
  title: 'Components/InfoNote',
  component: InfoNote,
  tags: ['autodocs'],
  args: {
    state: 'default',
    size: 'md',
    icon: 'info',
    children: 'План на месяц согласуется с руководителем до 5 числа',
  },
  argTypes: {
    state: { control: 'select', options: STATES },
    size: { control: 'inline-radio', options: SIZES },
    icon: { control: 'text' },
    children: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <Width size="md">
      <InfoNote {...args} />
    </Width>
  ),
} satisfies Meta<typeof InfoNote>

export default meta
type Story = StoryObj<typeof meta>

/** Нейтральная заметка. */
export const Default: Story = {}
/** Информация о процессе. */
export const Info: Story = { args: { state: 'info', children: 'Факт за ноябрь подтянется из CRM 1 декабря' } }
/** План выполнен. */
export const Success: Story = { args: { state: 'success', children: 'Выполнение плана 98% — премия начислена' } }
/** Риск. */
export const Warning: Story = { args: { state: 'warning', children: 'До закрытия месяца 3 дня, выполнение 64%' } }
/** Ошибка. */
export const Danger: Story = { args: { state: 'danger', children: 'Сумма весов показателей больше 100%' } }
/** Брендовая. */
export const Brand: Story = { args: { state: 'brand', children: 'Новое: план можно разбить по неделям' } }
/** Без иконки. */
export const NoIcon: Story = { args: { icon: false } }

/** Матрица State × Size. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="State × Size">
        <Matrix
          rows={STATES}
          cols={SIZES}
          render={(st, sz) => (
            <Width size="sm">
              <InfoNote state={st} size={sz}>
                Выполнение плана 98%
              </InfoNote>
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
