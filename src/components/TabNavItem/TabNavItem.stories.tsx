import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { TabNavItem } from './TabNavItem'

const TYPES = ['inactive', 'active-primary'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover'] as const

/**
 * Вкладка. Figma: кит, `Tab-nav-item` `10048:1068` — Type inactive · active-primary × 5 Size × State default · hover, +10.
 * active-primary — выбранная вкладка с подчёркиванием (`aria-selected`). В продукте собирается через `TabNav`.
 *
 * Наведение и фокус — нативные (в ките hover есть только у inactive). Проп `state` только фиксирует состояние для сверки с Figma.
 */
const meta = {
  title: 'Components/TabNavItem',
  component: TabNavItem,
  tags: ['autodocs'],
  args: {
    type: 'active-primary',
    size: 'md',
    children: 'План',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
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
} satisfies Meta<typeof TabNavItem>

export default meta
type Story = StoryObj<typeof meta>

/** Выбранная вкладка. */
export const ActivePrimary: Story = { args: { type: 'active-primary' } }
/** Невыбранная вкладка. */
export const Inactive: Story = { args: { type: 'inactive', children: 'Факт' } }
/** С иконкой и счётчиком. */
export const WithIcons: Story = { args: { type: 'inactive', children: 'Задачи', leftIcon: 'list', secondaryText: '7' } }
/** Принудительный hover для сверки с Figma. */
export const Hover: Story = { args: { type: 'inactive', state: 'hover', children: 'История' } }

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <TabNavItem type={t} size={sz}>План</TabNavItem>} />
      </Block>
      <Block title="Type × State (наведи default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <TabNavItem type={t} size="md" state={st === 'default' ? undefined : st} leftIcon="list" secondaryText="7">
              Задачи
            </TabNavItem>
          )}
        />
      </Block>
    </Stack>
  ),
}
