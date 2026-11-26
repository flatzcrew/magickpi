import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { NotificationBell } from './NotificationBell'

const TYPES = ['numeric', 'status', 'numeric-sm', 'status-sm'] as const

/**
 * Колокольчик уведомлений со счётчиком или точкой. Figma: кит, `Notification-bell` `37569:3495` — Type numeric · status · numeric-sm · status-sm.
 * numeric — счётчик (пусто / 0 — скрыт), status — красная точка `Status` danger; *-sm — 36 вместо 40.
 * С `onClick` рендерится как `<button>` (нативные hover и фокус), без него — `<span role="img">`.
 */
const meta = {
  title: 'Components/NotificationBell',
  component: NotificationBell,
  tags: ['autodocs'],
  args: {
    type: 'numeric',
    count: 3,
    label: 'Уведомления: 3 новых согласования',
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    count: { control: 'text' },
    label: { control: 'text' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NotificationBell>

export default meta
type Story = StoryObj<typeof meta>

/** Счётчик новых уведомлений. */
export const Numeric: Story = { args: { type: 'numeric' } }
/** Точка: есть непрочитанное. */
export const Status: Story = { args: { type: 'status', label: 'Есть новые уведомления' } }
/** Компактный счётчик. */
export const NumericSm: Story = { args: { type: 'numeric-sm' } }
/** Компактная точка. */
export const StatusSm: Story = { args: { type: 'status-sm', label: 'Есть новые уведомления' } }
/** Нет новых — счётчик скрыт. */
export const Empty: Story = { args: { count: 0, label: 'Уведомлений нет' } }
/** Кликабельный колокольчик — кнопка открытия списка уведомлений. */
export const Clickable: Story = { args: { onClick: fn() } }

/** Все Type: статичные и кликабельные. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × вид (button — живой)">
        <Matrix
          rows={TYPES}
          cols={['span', 'button', 'count 12'] as const}
          render={(t, c) =>
            c === 'span' ? (
              <NotificationBell type={t} count={3} />
            ) : c === 'button' ? (
              <NotificationBell type={t} count={3} onClick={() => {}} />
            ) : (
              <NotificationBell type={t} count={12} />
            )
          }
        />
      </Block>
    </Stack>
  ),
}
