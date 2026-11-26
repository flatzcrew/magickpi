import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Block, Matrix, Stack } from '../../catalog/Catalog'
import { Link } from './Link'

const TYPES = ['primary', 'secondary', 'tertiary'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const STATES = ['default', 'hover', 'disabled'] as const

/**
 * Текстовая ссылка. Figma: кит, `Link` `10055:1344` — 3 Type × 5 Size × 3 State, иконки слева и справа.
 *
 * Наведение и фокус — нативные (`:hover`, `:focus-visible`); недоступность — проп `disabled` (без href, aria-disabled).
 * Проп `state` только фиксирует состояние для сверки с Figma — в продукте его не передают.
 */
const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    type: 'primary',
    size: 'md',
    children: 'Все задачи сотрудника',
    href: '#',
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: TYPES },
    size: { control: 'inline-radio', options: SIZES },
    state: { control: 'inline-radio', options: [undefined, ...STATES] },
    children: { control: 'text' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    onClick: { control: false },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

/** Брендовая ссылка — переход к деталям. */
export const Primary: Story = { args: { type: 'primary' } }
/** Вторичная ссылка. */
export const Secondary: Story = { args: { type: 'secondary', children: 'Отдел продаж' } }
/** Приглушённая ссылка. */
export const Tertiary: Story = { args: { type: 'tertiary', children: 'История согласования' } }
/** С иконками слева и справа. */
export const WithIcons: Story = { args: { leftIcon: 'calender', rightIcon: 'chevron-right', children: 'Ноябрь 2026' } }
/** Недоступна: без href, aria-disabled. */
export const Disabled: Story = { args: { disabled: true } }

/** Матрица Type × Size и Type × State. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Type × Size">
        <Matrix rows={TYPES} cols={SIZES} render={(t, sz) => <Link type={t} size={sz} href="#">Все задачи</Link>} />
      </Block>
      <Block title="Type × State (наведи на default — переход живой)">
        <Matrix
          rows={TYPES}
          cols={STATES}
          render={(t, st) => (
            <Link type={t} state={st === 'default' ? undefined : st} leftIcon="calender" rightIcon="chevron-right" href="#">
              Ноябрь 2026
            </Link>
          )}
        />
      </Block>
    </Stack>
  ),
}
