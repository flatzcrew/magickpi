import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Labeled, Row, Stack } from '../../catalog/Catalog'
import { Icon, ICON_NAMES } from './Icon'
import type { IconSize } from './Icon'

const SIZES = [12, 14, 16, 18, 20, 24, 28, 32] as const satisfies readonly IconSize[]

/**
 * Иконка. Figma: кит, `Icons / *` (198 иконок, страница `10003:179`), SVG — `src/assets/icons/`.
 *
 * Имя — kebab-case имени в ките; залитая версия пары — `-filled`. Цвет — `currentColor` (от родителя),
 * многоцветные по замыслу кита: add, icons-placeholder, verification-tick, google, figma.
 * Размер — проп `size` (8 значений кита) или CSS-переменная `--icon-size` у родителя, по умолчанию 24.
 * Имени нет в ките — рамка-заглушка и предупреждение в консоли.
 */
const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    name: 'pie-chart',
    size: 24,
    label: 'Выполнение плана',
  },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: 'select', options: [undefined, ...SIZES] },
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/** Иконка 24 — размер по умолчанию. */
export const Default: Story = {}
/** Мелкая иконка 16 — в подписях и тегах. */
export const Small: Story = { args: { size: 16, name: 'calender', label: 'Месяц' } }
/** Без `label` иконка декоративная (aria-hidden). */
export const Decorative: Story = { args: { label: undefined, name: 'user' } }
/** Имени нет в ките — заглушка нужного размера. */
export const Missing: Story = { args: { name: 'not-in-kit', label: undefined } }

/** Все размеры и все 198 иконок кита с именами. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack>
      <Block title="Size">
        <Row>
          {SIZES.map((sz) => (
            <Labeled key={sz} label={String(sz)}>
              <Icon name="pie-chart" size={sz} />
            </Labeled>
          ))}
        </Row>
      </Block>
      <Block title={`Name — ${ICON_NAMES.length} иконок кита`}>
        <Row>
          {ICON_NAMES.map((n) => (
            <Labeled key={n} label={n}>
              <Icon name={n} />
            </Labeled>
          ))}
        </Row>
      </Block>
    </Stack>
  ),
}
