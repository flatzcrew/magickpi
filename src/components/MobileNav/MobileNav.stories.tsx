import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Frame, Matrix, Stack, Stateful } from '../../catalog/Catalog'
import type { MobileNavOption } from './MobileNav'
import { MobileNav } from './MobileNav'

const TYPES = ['default', 'floating'] as const
const SIZES = ['md', 'lg'] as const
const ITEM_TYPES = [
  'active-neutral',
  'inactive',
  'active',
  'active-naked',
  'active-primary',
  'active-primary-light',
  'active-primary-naked',
] as const

const ITEMS: MobileNavOption[] = [
  { value: 'my-kpi', label: 'Мои KPI', icon: 'pie-chart' },
  { value: 'team', label: 'Команда', icon: 'users' },
  { value: 'matrix', label: 'Матрица', icon: 'list' },
  { value: 'tasks', label: 'Задачи', icon: 'check' },
  { value: 'kipi', label: 'Кипи', icon: 'chat' },
]

/**
 * Нижняя навигация мобильного приложения. Figma: кит, `Mobile-nav` `14246:19645` — Type default · floating × Size md · lg.
 * Size панели задаёт Size пунктов `MobileNavItem`: md → lg (48), lg → xl (56). default — прибита к низу, с Home-indicator
 * (в ките default есть только в lg). Ширина кита 402 — в stories панель живёт в `Frame wide`.
 * Нажатие пунктов нативное.
 */
const meta = {
  title: 'Components/MobileNav',
  component: MobileNav,
  tags: ['autodocs'],
  args: {
    type: 'floating',
    size: 'md',
    items: ITEMS,
    value: 'my-kpi',
    activeType: 'active',
    inactiveType: 'inactive',
    onChange: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    items: { control: 'object' },
    value: { control: 'inline-radio', options: ITEMS.map((i) => i.value) },
    onChange: { control: false },
    activeType: { control: 'select', options: ITEM_TYPES },
    inactiveType: { control: 'select', options: ITEM_TYPES },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <Frame wide>
          <Story />
        </Frame>
      ),
  ],
} satisfies Meta<typeof MobileNav>

export default meta
type Story = StoryObj<typeof meta>

/** Плавающая плашка md. */
export const FloatingMd: Story = { args: { type: 'floating', size: 'md' } }
/** Плавающая плашка lg. */
export const FloatingLg: Story = { args: { type: 'floating', size: 'lg' } }
/** Прибита к низу, с Home-indicator (как в ките — lg). */
export const DefaultLg: Story = { args: { type: 'default', size: 'lg' } }
/** default md — в ките такой ячейки нет, рендерится по аналогии. */
export const DefaultMd: Story = { args: { type: 'default', size: 'md' } }
/** Акцентный текущий пункт. */
export const ActivePrimary: Story = { args: { activeType: 'active-primary' } }
/** Живой выбор раздела. */
export const Live: Story = {
  render: (args) => <Stateful initial="my-kpi">{(v, set) => <MobileNav {...args} value={v} onChange={set} />}</Stateful>,
}

/** Матрица Type × Size. */
export const AllVariants: Story = {
  parameters: { layout: 'padded', bare: true },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix
          rows={TYPES}
          cols={SIZES}
          render={(t, sz) => (
            <Frame wide>
              <Stateful initial="my-kpi">{(v, set) => <MobileNav type={t} size={sz} items={ITEMS} value={v} onChange={set} />}</Stateful>
            </Frame>
          )}
        />
      </Block>
    </Stack>
  ),
}
