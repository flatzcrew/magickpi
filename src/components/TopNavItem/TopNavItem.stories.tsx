import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { TopNavItem } from './TopNavItem'

const TYPES = [
  'active-neutral',
  'inactive',
  'inactive-outlined',
  'active',
  'active-naked',
  'active-primary',
  'active-primary-light',
  'active-secondary',
] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover'] as const

/**
 * Пункт верхней навигации. Figma: кит, `Top-nav-item` `10092:4521` — 8 Type × 5 Size × 2 State, +10 (иконки, тексты, картинка).
 * `inactive*` — обычный пункт, `active-*` — текущий (ставит `aria-current="page"`). В продукте собирается через `TopNav`.
 *
 * Наведение и фокус — нативные. Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/TopNavItem',
  component: TopNavItem,
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
    image: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TopNavItem>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveNeutral: Story = { args: { type: 'active-neutral' } }
/** Обычный пункт. */
export const Inactive: Story = { args: { type: 'inactive', children: 'Команда', leftIcon: 'users' } }
/** Обычный пункт с обводкой. */
export const InactiveOutlined: Story = { args: { type: 'inactive-outlined', children: 'Матрица', leftIcon: 'all' } }
export const Active: Story = { args: { type: 'active' } }
/** Текущий пункт без подложки. */
export const ActiveNaked: Story = { args: { type: 'active-naked' } }
/** Текущий пункт с акцентной заливкой. */
export const ActivePrimary: Story = { args: { type: 'active-primary' } }
/** Текущий пункт, мягкий акцент — по умолчанию в TopNav. */
export const ActivePrimaryLight: Story = { args: { type: 'active-primary-light' } }
export const ActiveSecondary: Story = { args: { type: 'active-secondary' } }
/** Со счётчиком и стрелкой. */
export const WithSecondaryText: Story = { args: { type: 'inactive', children: 'Задачи', leftIcon: 'list', secondaryText: '7', rightIcon: 'chevron-down' } }

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <TopNavItem type={t} size={sz} leftIcon="pie-chart">Мои KPI</TopNavItem>} />
      </Block>
      <Block title="Type × State (наведи default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <TopNavItem type={t} size="md" state={st === 'default' ? undefined : st} leftIcon="list" secondaryText="7" rightIcon="chevron-down">
              Задачи
            </TopNavItem>
          )}
        />
      </Block>
    </Stack>
  ),
}
