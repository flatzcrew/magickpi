import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { MobileNavItem } from './MobileNavItem'

const TYPES = [
  'active-neutral',
  'inactive',
  'active',
  'active-naked',
  'active-primary',
  'active-primary-light',
  'active-primary-naked',
] as const
const SIZES = ['lg', 'xl'] as const
const STATES = ['default', 'pressed'] as const

/**
 * Пункт нижней мобильной навигации. Figma: кит, `Mobile-nav-item` `14246:19681` — 7 Type × Size lg · xl × State default · pressed, +5
 * (иконка, картинка, подпись).
 * inactive — обычный пункт, active-* — текущий раздел (aria-current="page").
 * Нажатие нативное (`:active`); проп `state` только фиксирует pressed для сверки с Figma.
 */
const meta = {
  title: 'Components/MobileNavItem',
  component: MobileNavItem,
  tags: ['autodocs'],
  args: {
    type: 'active-primary',
    size: 'lg',
    icon: 'pie-chart',
    children: 'Мои KPI',
    htmlType: 'button',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    children: { control: 'text' },
    icon: { control: 'text' },
    image: { control: 'text' },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MobileNavItem>

export default meta
type Story = StoryObj<typeof meta>

export const ActiveNeutral: Story = { args: { type: 'active-neutral' } }
/** Обычный пункт. */
export const Inactive: Story = { args: { type: 'inactive', icon: 'users', children: 'Команда' } }
export const Active: Story = { args: { type: 'active' } }
export const ActiveNaked: Story = { args: { type: 'active-naked' } }
/** Текущий раздел — по умолчанию в ките. */
export const ActivePrimary: Story = { args: { type: 'active-primary' } }
export const ActivePrimaryLight: Story = { args: { type: 'active-primary-light' } }
export const ActivePrimaryNaked: Story = { args: { type: 'active-primary-naked' } }
/** Крупный пункт xl. */
export const SizeXl: Story = { args: { size: 'xl' } }
/** Нажатие — зафиксировано для сверки с Figma. */
export const Pressed: Story = { args: { state: 'pressed' } }

/** Матрица Type × Size и Type × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <MobileNavItem type={t} size={sz} icon="pie-chart">Мои KPI</MobileNavItem>} />
      </Block>
      <Block title="Type × State (нажми default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <MobileNavItem type={t} state={st === 'default' ? undefined : st} icon="pie-chart">
              Мои KPI
            </MobileNavItem>
          )}
        />
      </Block>
    </Stack>
  ),
}
