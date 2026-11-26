import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { SidebarItemCompact } from './SidebarItemCompact'

const TYPES = ['active-neutral', 'inactive', 'active', 'active-primary', 'active-primary-light', 'active-secondary', 'active-tertiary'] as const
const SIZES = ['md', 'lg'] as const
const STATES = ['default', 'hover'] as const

/**
 * Пункт свёрнутой боковой навигации: иконка над короткой подписью. Figma: кит, `Sidebar-item-compact` `42927:1227` — 7 Type × Size md · lg × State default · hover, +3.
 * Типы и эффекты — из SidebarItem. md — иконка 18, lg — 20; оба 48 × 56.
 *
 * Наведение и фокус — нативные. Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/SidebarItemCompact',
  component: SidebarItemCompact,
  tags: ['autodocs'],
  args: {
    type: 'active-primary',
    size: 'md',
    icon: 'pie-chart',
    children: 'KPI',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    children: { control: 'text' },
    icon: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SidebarItemCompact>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveNeutral: Story = { args: { type: 'active-neutral' } }
/** Обычный пункт. */
export const Inactive: Story = { args: { type: 'inactive', icon: 'users', children: 'Команда' } }
export const Active: Story = { args: { type: 'active' } }
/** Текущий раздел, акцентная заливка. */
export const ActivePrimary: Story = { args: { type: 'active-primary' } }
export const ActivePrimaryLight: Story = { args: { type: 'active-primary-light' } }
export const ActiveSecondary: Story = { args: { type: 'active-secondary' } }
export const ActiveTertiary: Story = { args: { type: 'active-tertiary' } }
/** Size lg. */
export const Large: Story = { args: { size: 'lg', icon: 'all', children: 'Матрица' } }
/** Только иконка, без подписи. */
export const IconOnly: Story = { args: { children: undefined, 'aria-label': 'Мои KPI' } }

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <SidebarItemCompact type={t} size={sz} icon="pie-chart">KPI</SidebarItemCompact>} />
      </Block>
      <Block title="Type × State (наведи default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <SidebarItemCompact type={t} state={st === 'default' ? undefined : st} icon="users">
              Команда
            </SidebarItemCompact>
          )}
        />
      </Block>
    </Stack>
  ),
}
