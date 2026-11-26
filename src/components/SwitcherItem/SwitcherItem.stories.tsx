import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { SwitcherItem } from './SwitcherItem'

const TYPES = ['active-neutral', 'inactive', 'active', 'active-primary', 'active-primary-light', 'active-secondary'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover'] as const

/**
 * Сегмент сегментного переключателя. Figma: кит, `Switcher-item` `10004:1260` — 6 Type × 5 Size × 2 State, +10 (иконки, тексты, картинка).
 * `inactive` — невыбранный сегмент, `active-*` — выбранный. В продукте собирается через `Switcher`.
 *
 * Наведение и фокус — нативные. Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/SwitcherItem',
  component: SwitcherItem,
  tags: ['autodocs'],
  args: {
    type: 'active-primary',
    size: 'sm',
    children: 'Квартал',
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
} satisfies Meta<typeof SwitcherItem>

export default meta
type Story = StoryObj<typeof meta>

/** Выбранный сегмент с акцентной заливкой. */
export const ActivePrimary: Story = { args: { type: 'active-primary' } }
/** Выбранный сегмент, мягкий акцент (Switcher secondary). */
export const ActivePrimaryLight: Story = { args: { type: 'active-primary-light' } }
export const ActiveSecondary: Story = { args: { type: 'active-secondary' } }
/** Выбранный сегмент на подложке (Switcher default). */
export const Active: Story = { args: { type: 'active' } }
export const ActiveNeutral: Story = { args: { type: 'active-neutral' } }
/** Невыбранный сегмент. */
export const Inactive: Story = { args: { type: 'inactive', children: 'Месяц' } }
/** С иконками и вторичным текстом-счётчиком. */
export const WithIcons: Story = {
  args: { leftIcon: 'calender', rightIcon: 'chevron-down', secondaryText: '12', children: 'Задачи' },
}
/** Принудительный hover для сверки с Figma. */
export const Hover: Story = { args: { type: 'inactive', state: 'hover', children: 'Год' } }

/** Матрица Type × Size и Type × State; default — без принудительного состояния, наведи. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <SwitcherItem type={t} size={sz}>Квартал</SwitcherItem>} />
      </Block>
      <Block title="Type × State (наведи default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <SwitcherItem type={t} size="sm" state={st === 'default' ? undefined : st} leftIcon="calender" rightIcon="chevron-down" secondaryText="12">
              Задачи
            </SwitcherItem>
          )}
        />
      </Block>
    </Stack>
  ),
}
