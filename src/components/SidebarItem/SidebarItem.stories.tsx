import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack, Width } from '../../catalog/Catalog'
import { SidebarItem } from './SidebarItem'

const TYPES = ['active-neutral', 'inactive', 'active', 'active-primary', 'active-primary-light', 'active-secondary', 'active-tertiary'] as const
const SIZES = ['sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover'] as const

/**
 * Пункт боковой навигации. Figma: кит, `Sidebar-item` `12018:6386` — 7 Type × Size sm · md · lg · xl × State default · hover, +9.
 * `inactive` — обычный пункт, `active-*` — текущий раздел (`aria-current="page"`); `tag` — счётчик справа (Tag tertiary, размер по Size).
 *
 * Наведение и фокус — нативные. Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  args: {
    type: 'active-primary',
    size: 'md',
    leftIcon: 'pie-chart',
    children: 'Мои KPI',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    children: { control: 'text' },
    secondaryText: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    tag: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  render: (args) => (
    <Width size="sm">
      <SidebarItem {...args} />
    </Width>
  ),
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SidebarItem>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveNeutral: Story = { args: { type: 'active-neutral' } }
/** Обычный пункт. */
export const Inactive: Story = { args: { type: 'inactive', children: 'Команда', leftIcon: 'users' } }
export const Active: Story = { args: { type: 'active' } }
/** Текущий раздел, акцентная заливка. */
export const ActivePrimary: Story = { args: { type: 'active-primary' } }
/** Текущий раздел, мягкий акцент. */
export const ActivePrimaryLight: Story = { args: { type: 'active-primary-light' } }
export const ActiveSecondary: Story = { args: { type: 'active-secondary' } }
export const ActiveTertiary: Story = { args: { type: 'active-tertiary' } }
/** Со счётчиком задач на согласовании. */
export const WithTag: Story = { args: { type: 'inactive', children: 'Согласование', leftIcon: 'check', tag: '3' } }
/** С вторичным текстом и стрелкой. */
export const WithSecondaryText: Story = { args: { type: 'inactive', children: 'Отдел продаж', secondaryText: '12', leftIcon: 'users', rightIcon: 'chevron-down' } }

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи. */
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
              <SidebarItem type={t} size={sz} leftIcon="check" rightIcon="chevron-down" tag="3">
                Согласование
              </SidebarItem>
            </Width>
          )}
        />
      </Block>
      <Block title="Type × State (наведи default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <Width size="sm">
              <SidebarItem type={t} size="md" state={st === 'default' ? undefined : st} leftIcon="pie-chart" tag="3">
                Мои KPI
              </SidebarItem>
            </Width>
          )}
        />
      </Block>
    </Stack>
  ),
}
